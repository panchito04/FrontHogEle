import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function Productos({ user }) {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [stats, setStats] = useState({ total: 0, vendidos: 0, disponibles: 0, porCategoria: {} })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('todos')
  const [filterCategoria, setFilterCategoria] = useState('todas')
  const [showModal, setShowModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProductId, setDeletingProductId] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [newProducto, setNewProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    id_categoria: '',
    imagen_url: '',
    imagen_file: null
  })
  const [newCategoria, setNewCategoria] = useState({
    nombre: '',
    descripcion: ''
  })

  useEffect(() => {
    fetchProductos()
    fetchCategorias()
  }, [])

  const fetchProductos = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${API_URL}/api/productos`)
      setProductos(response.data)

      const statsResponse = await axios.get(`${API_URL}/api/productos/stats/resumen`)
      setStats(statsResponse.data)
    } catch (error) {
      console.error('Error al obtener productos:', error)
      alert('Error al cargar los productos')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categorias`)
      setCategorias(response.data)
    } catch (error) {
      console.error('Error al obtener categorías:', error)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (file.size > 5 * 1024 * 1024) {
      alert('⚠️ La imagen no puede pesar más de 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('⚠️ Solo se permiten archivos de imagen')
      return
    }

    setFilePreview(URL.createObjectURL(file))
    
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, imagen_file: file, imagen_url: '' })
    } else {
      setNewProducto({ ...newProducto, imagen_file: file, imagen_url: '' })
    }
  }

  const handleCreateProducto = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('nombre', newProducto.nombre)
      formData.append('descripcion', newProducto.descripcion || '')
      formData.append('precio', parseFloat(newProducto.precio))
      
      if (newProducto.id_categoria) {
        formData.append('id_categoria', parseInt(newProducto.id_categoria))
      }
      
      if (newProducto.imagen_file) {
        formData.append('imagen', newProducto.imagen_file)
      } else if (newProducto.imagen_url) {
        formData.append('imagen_url', newProducto.imagen_url)
      }

      await axios.post(`${API_URL}/api/productos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      alert('✅ Producto único creado exitosamente')
      setShowModal(false)
      setFilePreview(null)
      setNewProducto({ nombre: '', descripcion: '', precio: '', id_categoria: '', imagen_url: '', imagen_file: null })
      fetchProductos()
    } catch (error) {
      console.error('Error al crear producto:', error)
      alert(error.response?.data?.error || 'Error al crear el producto')
    } finally {
      setIsUploading(false)
    }
  }

  const handleUpdateProducto = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('nombre', editingProduct.nombre)
      formData.append('descripcion', editingProduct.descripcion || '')
      formData.append('precio', parseFloat(editingProduct.precio))
      
      if (editingProduct.id_categoria) {
        formData.append('id_categoria', parseInt(editingProduct.id_categoria))
      }
      
      if (editingProduct.imagen_file) {
        formData.append('imagen', editingProduct.imagen_file)
      } else if (editingProduct.imagen_url) {
        formData.append('imagen_url', editingProduct.imagen_url)
      }

      await axios.put(`${API_URL}/api/productos/${editingProduct.id_producto}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      alert('✅ Producto actualizado exitosamente')
      setShowModal(false)
      setFilePreview(null)
      setEditingProduct(null)
      fetchProductos()
    } catch (error) {
      console.error('Error al actualizar producto:', error)
      alert(error.response?.data?.error || 'Error al actualizar el producto')
    } finally {
      setIsUploading(false)
    }
  }

  const confirmDelete = (id) => {
    setDeletingProductId(id)
    setShowDeleteConfirm(true)
  }

  const handleDeleteProducto = async () => {
    try {
      await axios.delete(`${API_URL}/api/productos/${deletingProductId}`)
      alert('✅ Producto eliminado exitosamente')
      setShowDeleteConfirm(false)
      setDeletingProductId(null)
      fetchProductos()
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      alert(error.response?.data?.error || 'Error al eliminar el producto')
      setShowDeleteConfirm(false)
    }
  }

  const handleCreateCategoria = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/api/categorias`, newCategoria)
      alert('✅ Categoría creada exitosamente')
      setShowCategoryModal(false)
      setNewCategoria({ nombre: '', descripcion: '' })
      fetchCategorias()
    } catch (error) {
      console.error('Error al crear categoría:', error)
      alert('Error al crear la categoría')
    }
  }

  const openEditModal = (producto) => {
    if (producto.vendido) {
      alert('⚠️ No puedes editar un producto que ya ha sido vendido')
      return
    }
    setEditingProduct({...producto, imagen_file: null})
    setFilePreview(producto.imagen_url || null)
    setShowModal(true)
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setFilePreview(null)
    setNewProducto({ nombre: '', descripcion: '', precio: '', id_categoria: '', imagen_url: '', imagen_file: null })
    setShowModal(true)
  }

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEstado = filterEstado === 'todos' || 
      (filterEstado === 'disponibles' && producto.disponible) ||
      (filterEstado === 'vendidos' && producto.vendido)
    
    const matchesCategoria = filterCategoria === 'todas' || 
      producto.id_categoria?.toString() === filterCategoria

    return matchesSearch && matchesEstado && matchesCategoria
  })

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar user={user} />
      
      <div className="flex-1 overflow-auto lg:ml-0 pt-16 lg:pt-0">
        <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Productos Únicos
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Cada producto es exclusivo
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>Nueva Categoría</span>
                </button>
                <button
                  onClick={openCreateModal}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Nuevo Producto</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white shadow-xl transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-xs font-medium uppercase tracking-wide mb-1">Total Productos</p>
                  <h3 className="text-3xl font-bold">{stats.total}</h3>
                  <p className="text-indigo-200 text-xs mt-1">Piezas únicas</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-xl transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs font-medium uppercase tracking-wide mb-1">Disponibles</p>
                  <h3 className="text-3xl font-bold">{stats.disponibles}</h3>
                  <p className="text-green-200 text-xs mt-1">Para venta</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-5 text-white shadow-xl transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-xs font-medium uppercase tracking-wide mb-1">Vendidos</p>
                  <h3 className="text-3xl font-bold">{stats.vendidos}</h3>
                  <p className="text-orange-200 text-xs mt-1">Completados</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition duration-200 text-sm sm:text-base"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition duration-200 text-sm"
              >
                <option value="todos">📦 Todos los estados</option>
                <option value="disponibles">✅ Disponibles</option>
                <option value="vendidos">🔴 Vendidos</option>
              </select>

              <select
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition duration-200 text-sm"
              >
                <option value="todas">🏷️ Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center py-20">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-10 h-10 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
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
              filteredProductos.map((producto) => (
                <div 
                  key={producto.id_producto} 
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                    producto.vendido ? 'border-red-200' : 'border-green-200'
                  }`}
                >
                  <div className="relative h-52 bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden">
                    {producto.imagen_url ? (
                      <img 
                        src={producto.imagen_url} 
                        alt={producto.nombre} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-20 h-20 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="absolute top-3 right-3">
                      {producto.vendido ? (
                        <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          VENDIDO
                        </span>
                      ) : (
                        <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center animate-pulse">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          DISPONIBLE
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 left-3">
                      <span className="bg-black bg-opacity-50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-semibold">
                        ID: {producto.id_producto}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 min-h-[3.5rem]">
                        {producto.nombre}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {producto.categoria?.nombre || 'Sin categoría'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                      {producto.descripcion || 'Sin descripción disponible'}
                    </p>

                    <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-100">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-2xl font-bold text-green-600">
                          Bs. {producto.precio?.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(producto)}
                        disabled={producto.vendido}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                          producto.vendido 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span className="text-sm">Editar</span>
                      </button>
                      <button 
                        onClick={() => confirmDelete(producto.id_producto)}
                        disabled={producto.vendido}
                        className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
                          producto.vendido 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {producto.vendido && (
                      <p className="text-center text-xs text-gray-500 mt-3 italic">
                        🔒 Este producto ya fue vendido y no puede ser modificado
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

<div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Mostrando</p>
                  <p className="text-3xl font-bold text-gray-800">{filteredProductos.length}</p>
                  <p className="text-xs text-gray-500">de {productos.length} productos</p>
                </div>
              </div>
              <button
                onClick={fetchProductos}
                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Actualizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CREAR/EDITAR PRODUCTO CON CLOUDINARY */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">
                    {editingProduct ? '✏️ Editar Producto' : '✨ Nuevo Producto Único'}
                  </h3>
                  <p className="text-indigo-100 mt-1">
                    {editingProduct ? 'Modifica los datos del producto' : 'Cada producto es una pieza exclusiva'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingProduct(null)
                    setFilePreview(null)
                  }}
                  disabled={isUploading}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all disabled:opacity-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={editingProduct ? handleUpdateProducto : handleCreateProducto} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📝 Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  disabled={isUploading}
                  value={editingProduct ? editingProduct.nombre : newProducto.nombre}
                  onChange={(e) => editingProduct 
                    ? setEditingProduct({...editingProduct, nombre: e.target.value})
                    : setNewProducto({...newProducto, nombre: e.target.value})
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="Ej: Collar de Plata Artesanal"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📄 Descripción
                </label>
                <textarea
                  rows="3"
                  disabled={isUploading}
                  value={editingProduct ? editingProduct.descripcion : newProducto.descripcion}
                  onChange={(e) => editingProduct
                    ? setEditingProduct({...editingProduct, descripcion: e.target.value})
                    : setNewProducto({...newProducto, descripcion: e.target.value})
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all resize-none disabled:opacity-50"
                  placeholder="Describe las características únicas de este producto..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    🏷️ Categoría *
                  </label>
                  <select
                    required
                    disabled={isUploading}
                    value={editingProduct ? editingProduct.id_categoria : newProducto.id_categoria}
                    onChange={(e) => editingProduct
                      ? setEditingProduct({...editingProduct, id_categoria: e.target.value})
                      : setNewProducto({...newProducto, id_categoria: e.target.value})
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all disabled:opacity-50"
                  >
                    <option value="">Selecciona...</option>
                    {categorias.map((cat) => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    💰 Precio (Bs.) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    disabled={isUploading}
                    value={editingProduct ? editingProduct.precio : newProducto.precio}
                    onChange={(e) => editingProduct
                      ? setEditingProduct({...editingProduct, precio: e.target.value})
                      : setNewProducto({...newProducto, precio: e.target.value})
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* SECCIÓN DE IMAGEN CON CLOUDINARY */}
              <div className="space-y-4 bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border-2 border-indigo-100">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📸 Imagen del Producto
                </label>
                
                {filePreview && (
                  <div className="relative mb-4">
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="w-full h-64 object-cover rounded-xl shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFilePreview(null)
                        if (editingProduct) {
                          setEditingProduct({...editingProduct, imagen_file: null, imagen_url: ''})
                        } else {
                          setNewProducto({...newProducto, imagen_file: null, imagen_url: ''})
                        }
                      }}
                      disabled={isUploading}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all shadow-lg disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-indigo-700 mb-2">
                    📷 Tomar foto o elegir archivo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    📱 En móvil: toca para usar la cámara | 💻 En PC: elige un archivo (máx. 5MB)
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gradient-to-br from-indigo-50 to-purple-50 text-gray-600 font-semibold">O</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-indigo-700 mb-2">
                    🔗 Pegar URL de imagen
                  </label>
                  <input
                    type="url"
                    disabled={isUploading}
                    value={editingProduct ? editingProduct.imagen_url || '' : newProducto.imagen_url || ''}
                    onChange={(e) => {
                      const url = e.target.value
                      if (url) {
                        setFilePreview(url)
                      }
                      if (editingProduct) {
                        setEditingProduct({...editingProduct, imagen_url: url, imagen_file: null})
                      } else {
                        setNewProducto({...newProducto, imagen_url: url, imagen_file: null})
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    💡 Tip: La imagen se subirá automáticamente a Cloudinary
                  </p>
                </div>
              </div>

              {isUploading && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-center space-x-3">
                  <svg className="animate-spin h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">Subiendo imagen...</p>
                    <p className="text-xs text-yellow-600">Por favor espera, esto puede tomar unos segundos</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingProduct(null)
                    setFilePreview(null)
                  }}
                  disabled={isUploading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subiendo...
                    </span>
                  ) : (
                    editingProduct ? '💾 Actualizar' : '✨ Crear Producto'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NUEVA CATEGORÍA */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">🏷️ Nueva Categoría</h3>
                  <p className="text-purple-100 mt-1">Organiza tus productos únicos</p>
                </div>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateCategoria} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📝 Nombre de Categoría *
                </label>
                <input
                  type="text"
                  required
                  value={newCategoria.nombre}
                  onChange={(e) => setNewCategoria({...newCategoria, nombre: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  placeholder="Ej: Joyería Artesanal"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📄 Descripción
                </label>
                <textarea
                  rows="3"
                  value={newCategoria.descripcion}
                  onChange={(e) => setNewCategoria({...newCategoria, descripcion: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all resize-none"
                  placeholder="Describe esta categoría..."
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  ✨ Crear Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACIÓN ELIMINACIÓN */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">⚠️ Confirmar Eliminación</h3>
                  <p className="text-red-100 mt-1">Esta acción no se puede deshacer</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 text-center mb-6 text-lg">
                ¿Estás seguro de que deseas eliminar este producto único?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeletingProductId(null)
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteProducto}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Productos