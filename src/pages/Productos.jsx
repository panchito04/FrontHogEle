// src/pages/Productos.jsx - VERSIÓN OPTIMIZADA
import { useState, useEffect, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import CameraCapture from '../components/CameraCapture'
import Toast from '../components/common/Toast'

import { useProductos } from '../hooks/useProductos'
import { useCajas } from '../hooks/useCajas'
import { useCategorias } from '../hooks/useCategorias'
import { useToast } from '../hooks/useToast'
import { useProgressiveLoad } from '../hooks/useProgressiveLoad'

import ProductStats from '../components/productos/ProductStats'
import ProductFilters from '../components/productos/ProductFilters'
import ProductCard from '../components/productos/ProductCard'
import ProductCardSkeleton from '../components/productos/ProductCardSkeleton'
import ProductModal from '../components/productos/ProductModal'
import DeleteConfirmModal from '../components/productos/DeleteConfirmModal'

import BoxCard from '../components/cajas/BoxCard'
import BoxModal from '../components/cajas/BoxModal'
import BoxDetailModal from '../components/cajas/BoxDetailModal'
import CategoryModal from '../components/categorias/CategoryModal'

function Productos({ user }) {
  const { productos, isLoading, fetchProductos, updateProducto, createProducto, deleteProducto } = useProductos()
  const { cajas, fetchCajas, createCaja, updateCaja, deleteCaja, getCajaDetail } = useCajas()
  const { categorias, fetchCategorias, createCategoria } = useCategorias()
  const { toast, showToast, hideToast } = useToast()
  const [tempFormData, setTempFormData] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('todos')
  const [filterCategoria, setFilterCategoria] = useState('todas')
  const [filterCaja, setFilterCaja] = useState('todas')

  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showBoxModal, setShowBoxModal] = useState(false)
  const [showBoxDetailModal, setShowBoxDetailModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showCamera, setShowCamera] = useState(false)

  const [editingProduct, setEditingProduct] = useState(null)
  const [editingBox, setEditingBox] = useState(null)
  const [selectedBox, setSelectedBox] = useState(null)
  const [deletingProductId, setDeletingProductId] = useState(null)

  const [filePreview, setFilePreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('productos')
  const [cameraInitialFile, setCameraInitialFile] = useState(null)

  useEffect(() => {
    const loadInitialData = async () => {
      const [productosResult, categoriasResult, cajasResult] = await Promise.all([
        fetchProductos(),
        fetchCategorias(),
        fetchCajas()
      ])

      if (productosResult && !productosResult.success) {
        showToast(productosResult.message, 'error')
      }
    }

    loadInitialData()
  }, [])

  // Memoizar productos filtrados
  const filteredProductos = useMemo(() => {
    return productos.filter(producto => {
      const matchesSearch = producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesEstado = filterEstado === 'todos' ||
        (filterEstado === 'disponibles' && producto.disponible) ||
        (filterEstado === 'vendidos' && producto.vendido)

      const matchesCategoria = filterCategoria === 'todas' ||
        producto.id_categoria?.toString() === filterCategoria

      const matchesCaja = filterCaja === 'todas' ||
        producto.id_caja?.toString() === filterCaja

      return matchesSearch && matchesEstado && matchesCategoria && matchesCaja
    })
  }, [productos, searchTerm, filterEstado, filterCategoria, filterCaja])

  // Hook de carga progresiva
  const {
    displayedItems,
    hasMore,
    isLoadingMore,
    loadMoreRef
  } = useProgressiveLoad(filteredProductos, 12) // 12 productos iniciales

  // En Productos.jsx, después de useProgressiveLoad:
  useEffect(() => {
    console.log('📊 Estado de carga:', {
      totalProductos: filteredProductos.length,
      mostrados: displayedItems.length,
      hasMore,
      isLoadingMore
    })
  }, [filteredProductos.length, displayedItems.length, hasMore, isLoadingMore])

  useEffect(() => {
    const handleModalBack = () => {
      if (showCamera) { setShowCamera(false); setCameraInitialFile(null); return true }
      if (showProductModal) { setShowProductModal(false); setEditingProduct(null); setFilePreview(null); return true }
      if (showBoxModal) { setShowBoxModal(false); setEditingBox(null); return true }
      if (showBoxDetailModal) { setShowBoxDetailModal(false); setSelectedBox(null); return true }
      if (showCategoryModal) { setShowCategoryModal(false); return true }
      if (showDeleteConfirm) { setShowDeleteConfirm(false); setDeletingProductId(null); return true }
      return false
    }

    if (showCamera || showProductModal || showBoxModal || showBoxDetailModal || showCategoryModal || showDeleteConfirm) {
      window.history.pushState({ modal: true }, '')

      const handlePopState = (e) => {
        if (e.state?.modal) {
          handleModalBack()
          e.stopImmediatePropagation()
        }
      }

      window.addEventListener('popstate', handlePopState, true)
      return () => window.removeEventListener('popstate', handlePopState, true)
    }
  }, [showCamera, showProductModal, showBoxModal, showBoxDetailModal, showCategoryModal, showDeleteConfirm])

  const handleCameraCapture = (file, previewUrl) => {
    setFilePreview(previewUrl)

    if (editingProduct && editingProduct.id_producto) {
      const updatedProduct = {
        ...editingProduct,
        imagen_file: file,
        imagen_url: '',
        preview_url: previewUrl
      }
      setEditingProduct(updatedProduct)
    } else {
      const updatedProduct = {
        nombre: tempFormData?.nombre || editingProduct?.nombre || '',
        descripcion: tempFormData?.descripcion || editingProduct?.descripcion || '',
        precio: tempFormData?.precio || editingProduct?.precio || '',
        id_categoria: tempFormData?.id_categoria || editingProduct?.id_categoria || '',
        id_caja: tempFormData?.id_caja || editingProduct?.id_caja || '',
        imagen_file: file,
        imagen_url: '',
        preview_url: previewUrl,
        cantidad: tempFormData?.cantidad || editingProduct?.cantidad || 1,
      }
      setEditingProduct(updatedProduct)
      localStorage.setItem('tempProductFormData', JSON.stringify(updatedProduct))
    }

    setShowCamera(false)
    setCameraInitialFile(null)
    setShowProductModal(true)
    setTempFormData(null)
  }

  const handleOpenCameraWithFile = (file, currentFormData) => {
    setTempFormData(currentFormData)
    setCameraInitialFile(file)
    setShowProductModal(false)
    setShowCamera(true)
  }

  const handleCreateOrUpdateProduct = async (e, formData) => {
    e.preventDefault()
    setIsUploading(true)

    const form = new FormData()

    form.append('nombre', formData.nombre)
    form.append('descripcion', formData.descripcion || '')
    form.append('precio', parseFloat(formData.precio))
    form.append('cantidad', parseInt(formData.cantidad) || 1)

    if (formData.id_categoria) form.append('id_categoria', parseInt(formData.id_categoria))
    if (formData.id_caja) form.append('id_caja', parseInt(formData.id_caja))

    if (formData.imagen_file) {
      form.append('imagen', formData.imagen_file)
    } else if (formData.imagen_url) {
      form.append('imagen_url', formData.imagen_url)
    }

    const isRealEdit = editingProduct && editingProduct.id_producto

    const result = isRealEdit
      ? await updateProducto(editingProduct.id_producto, form)
      : await createProducto(form)

    if (result.success) {
      showToast(result.message, 'success')
      setShowProductModal(false)
      setFilePreview(null)
      setEditingProduct(null)
      localStorage.removeItem('tempProductFormData')
      fetchCajas()
    } else {
      showToast(result.message, 'error')
    }

    setIsUploading(false)
  }

  const openEditProductModal = (producto) => {
    if (producto.vendido) {
      showToast('No puedes editar un producto que ya ha sido vendido', 'warning')
      return
    }
    setEditingProduct({ ...producto, imagen_file: null })
    setFilePreview(producto.imagen_url || null)
    setShowProductModal(true)
  }

  const openCreateProductModal = () => {
    setEditingProduct(null)
    setFilePreview(null)

    const savedFormData = localStorage.getItem('tempProductFormData')
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData)
        if (window.confirm('¿Deseas recuperar los datos del producto que estabas creando?')) {
          setEditingProduct(parsed)
          if (parsed.preview_url) {
            setFilePreview(parsed.preview_url)
          }
        } else {
          localStorage.removeItem('tempProductFormData')
        }
      } catch (error) {
        console.error('Error al cargar datos guardados:', error)
      }
    }

    setShowProductModal(true)
  }

  const confirmDeleteProduct = (id) => {
    setDeletingProductId(id)
    setShowDeleteConfirm(true)
  }

  const handleDeleteProduct = async () => {
    const result = await deleteProducto(deletingProductId)

    if (result.success) {
      showToast(result.message, 'success')
      setShowDeleteConfirm(false)
      setDeletingProductId(null)
      fetchCajas()
    } else {
      showToast(result.message, 'error')
    }
  }

  const handleCreateOrUpdateBox = async (e, formData) => {
    e.preventDefault()

    const result = editingBox
      ? await updateCaja(editingBox.id_caja, formData)
      : await createCaja(formData)

    if (result.success) {
      showToast(result.message, 'success')
      setShowBoxModal(false)
      setEditingBox(null)
    } else {
      showToast(result.message, 'error')
    }
  }

  const openBoxDetailModal = async (caja) => {
    const result = await getCajaDetail(caja.id_caja)

    if (result.success) {
      setSelectedBox(result.data)
      setShowBoxDetailModal(true)
    } else {
      showToast(result.message, 'error')
    }
  }

  const openEditBoxModal = (caja) => {
    setEditingBox(caja)
    setShowBoxModal(true)
  }

  const openCreateBoxModal = () => {
    setEditingBox(null)
    setShowBoxModal(true)
  }

  const handleDeleteBox = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta caja? Solo se puede eliminar si no tiene productos asignados.')) {
      return
    }

    const result = await deleteCaja(id)

    if (result.success) {
      showToast(result.message, 'success')
      fetchProductos()
    } else {
      showToast(result.message, 'error')
    }
  }

  const handleCreateCategory = async (categoriaData) => {
    const result = await createCategoria(categoriaData)

    if (result.success) {
      showToast(result.message, 'success')
      setShowCategoryModal(false)
    } else {
      showToast(result.message, 'error')
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar user={user} />

      <div className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan1-600 via-ocean1-600 to-pink-600 bg-clip-text text-transparent">
                  Acciones Registro
                </h1>
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={openCreateBoxModal} className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-1.5 text-xs sm:text-sm shadow-lg hover:shadow-xl">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="hidden sm:inline">Nueva Caja</span>
                  <span className="sm:hidden">Caja</span>
                </button>
                <button onClick={() => setShowCategoryModal(true)} className="bg-gradient-to-r from-ocean1-600 to-pink-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-ocean1-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-1.5 text-xs sm:text-sm shadow-lg hover:shadow-xl">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="hidden sm:inline">Nueva Categoría</span>
                  <span className="sm:hidden">Categoría</span>
                </button>
                <button onClick={openCreateProductModal} className="bg-gradient-to-r from-cyan1-600 to-ocean1-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-cyan1-700 hover:to-ocean1-700 transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-lg hover:shadow-xl text-xs sm:text-sm">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden sm:inline">Nuevo Producto</span>
                  <span className="sm:hidden">Producto</span>
                </button>
              </div>
            </div>

            <div className="flex gap-2 mt-4 border-b">
              <button onClick={() => setActiveTab('productos')} className={`px-4 py-2 font-semibold transition-all ${activeTab === 'productos' ? 'border-b-2 border-cyan1-600 text-cyan1-600' : 'text-gray-500 hover:text-gray-700'}`}>
                📦 Productos
              </button>
              <button onClick={() => setActiveTab('cajas')} className={`px-4 py-2 font-semibold transition-all ${activeTab === 'cajas' ? 'border-b-2 border-cyan1-600 text-cyan1-600' : 'text-gray-500 hover:text-gray-700'}`}>
                📦 Cajas ({cajas.length})
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'productos' ? (
            <>
              {/* Stats siempre visibles */}
              <ProductStats
                filteredProductos={filteredProductos}
                filterCaja={filterCaja}
                filterCategoria={filterCategoria}
              />

              <ProductFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterEstado={filterEstado}
                setFilterEstado={setFilterEstado}
                filterCategoria={filterCategoria}
                setFilterCategoria={setFilterCategoria}
                filterCaja={filterCaja}
                setFilterCaja={setFilterCaja}
                categorias={categorias}
                cajas={cajas}
              />
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                  {isLoading ? (
                    // Mostrar 8 skeletons mientras carga
                    Array.from({ length: 8 }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))
                  ) : filteredProductos.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-white rounded-2xl">
                      <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg font-semibold">No se encontraron productos</p>
                      <p className="text-gray-400 text-sm mt-2">Intenta cambiar los filtros de búsqueda</p>
                    </div>
                  ) : (
                    <>
                      {displayedItems.map((producto) => (
                        <ProductCard
                          key={producto.id_producto}
                          producto={producto}
                          onEdit={openEditProductModal}
                          onDelete={confirmDeleteProduct}
                        />
                      ))}

                      {/* Skeletons para carga progresiva */}
                      {isLoadingMore && (
                        Array.from({ length: 4 }).map((_, i) => (
                          <ProductCardSkeleton key={`skeleton-loading-${i}`} />
                        ))
                      )}
                    </>
                  )}
                </div>

                {/* ELEMENTO OBSERVER - SIEMPRE VISIBLE CUANDO HAY PRODUCTOS */}
                {!isLoading && filteredProductos.length > 0 && (
                  <div className="w-full py-8">
                    {hasMore ? (
                      <div
                        ref={loadMoreRef}
                        className="flex items-center justify-center min-h-[100px]"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 border-4 border-cyan1-200 border-t-cyan1-600 rounded-full animate-spin"></div>
                          <p className="text-sm text-gray-500 font-medium">Cargando más productos...</p>
                          <p className="text-xs text-gray-400">
                            Mostrando {displayedItems.length} de {filteredProductos.length}
                          </p>
                        </div>
                      </div>
                    ) : displayedItems.length > 12 ? (
                      <div className="text-center py-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-green-700 font-medium">
                            ✨ Mostrando todos los productos ({displayedItems.length})
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* BOTÓN MANUAL DE CARGAR MÁS (FALLBACK) - SIEMPRE VISIBLE */}
                {!isLoading && hasMore && displayedItems.length > 0 && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => {
                        console.log('🔘 Botón manual presionado')
                        loadMore()
                      }}
                      disabled={isLoadingMore}
                      className="px-6 py-3 bg-gradient-to-r from-cyan1-600 to-ocean1-600 text-white rounded-xl font-semibold hover:from-cyan1-700 hover:to-ocean1-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                    >
                      {isLoadingMore ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Cargando...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                          <span>Cargar más productos ({displayedItems.length}/{filteredProductos.length})</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cajas.map((caja) => (
                <BoxCard
                  key={caja.id_caja}
                  caja={caja}
                  onViewDetail={openBoxDetailModal}
                  onEdit={openEditBoxModal}
                  onDelete={handleDeleteBox}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODALES */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false)
          setEditingProduct(null)
          setFilePreview(null)
        }}
        onSubmit={handleCreateOrUpdateProduct}
        editingProduct={editingProduct}
        categorias={categorias}
        cajas={cajas}
        isUploading={isUploading}
        onOpenCamera={(currentFormData) => {
          setTempFormData(currentFormData)
          setShowProductModal(false)
          setShowCamera(true)
        }}
        onOpenCameraWithFile={handleOpenCameraWithFile}
        onFormChange={(formData) => {
          if (!formData.id_producto) {
            localStorage.setItem('tempProductFormData', JSON.stringify(formData))
          }
        }}
      />

      <BoxModal
        isOpen={showBoxModal}
        onClose={() => {
          setShowBoxModal(false)
          setEditingBox(null)
        }}
        onSubmit={handleCreateOrUpdateBox}
        editingBox={editingBox}
      />

      <BoxDetailModal
        isOpen={showBoxDetailModal}
        onClose={() => {
          setShowBoxDetailModal(false)
          setSelectedBox(null)
        }}
        selectedBox={selectedBox}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSubmit={handleCreateCategory}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setDeletingProductId(null)
        }}
        onConfirm={handleDeleteProduct}
      />

      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => {
            setShowCamera(false)
            setCameraInitialFile(null)
          }}
          initialFile={cameraInitialFile}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          duration={toast.duration}
        />
      )}
    </div>
  )
}

export default Productos