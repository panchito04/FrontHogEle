import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function CajasProductos({ user }) {
  const [activeTab, setActiveTab] = useState('cajas')
  const [cajas, setCajas] = useState([])
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCaja, setFilterCaja] = useState('todas')
  const [filterCategoria, setFilterCategoria] = useState('todas')
  const [filterEstado, setFilterEstado] = useState('todos')
  
  // Modales
  const [showCajaModal, setShowCajaModal] = useState(false)
  const [showProductoModal, setShowProductoModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showCajaDetailModal, setShowCajaDetailModal] = useState(false)
  
  // Estados de edición/eliminación
  const [editingCaja, setEditingCaja] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteType, setDeleteType] = useState(null)
  const [selectedCajaDetail, setSelectedCajaDetail] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // Formularios
  const [newCaja, setNewCaja] = useState({
    codigo: '',
    descripcion: '',
    fecha_llegada: '',
    proveedor: '',
    costo_total: '',
    observaciones: ''
  })

  const [newProducto, setNewProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    id_categoria: '',
    id_caja: '',
    imagen_url: '',
    imagen_file: null
  })

  const [newCategoria, setNewCategoria] = useState({
    nombre: '',
    descripcion: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    await Promise.all([fetchCajas(), fetchProductos(), fetchCategorias()])
    setIsLoading(false)
  }

  const fetchCajas = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cajas`)
      setCajas(response.data)
    } catch (error) {
      console.error('Error al obtener cajas:', error)
    }
  }

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/productos`)
      setProductos(response.data)
    } catch (error) {
      console.error('Error al obtener productos:', error)
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

  // ==================== CRUD CAJAS ====================
  const handleCreateCaja = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/api/cajas`, newCaja)
      alert('✅ Caja creada exitosamente')
      setShowCajaModal(false)
      setNewCaja({ codigo: '', descripcion: '', fecha_llegada: '', proveedor: '', costo_total: '', observaciones: '' })
      fetchCajas()
    } catch (error) {
      alert(error.response?.data?.error || 'Error al crear la caja')
    }
  }

  const handleUpdateCaja = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`${API_URL}/api/cajas/${editingCaja.id_caja}`, editingCaja)
      alert('✅ Caja actualizada exitosamente')
      setShowCajaModal(false)
      setEditingCaja(null)
      fetchCajas()
    } catch (error) {
      alert(error.response?.data?.error || 'Error al actualizar la caja')
    }
  }

  const handleDeleteCaja = async () => {
    try {
      await axios.delete(`${API_URL}/api/cajas/${deletingId}`)
      alert('✅ Caja eliminada exitosamente')
      setShowDeleteConfirm(false)
      setDeletingId(null)
      fetchCajas()
    } catch (error) {
      alert(error.response?.data?.error || 'Error al eliminar la caja')
      setShowDeleteConfirm(false)
    }
  }

  // ==================== CRUD PRODUCTOS ====================
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
      
      if (newProducto.id_caja) {
        formData.append('id_caja', parseInt(newProducto.id_caja))
      }
      
      if (newProducto.imagen_file) {
        formData.append('imagen', newProducto.imagen_file)
      } else if (newProducto.imagen_url) {
        formData.append('imagen_url', newProducto.imagen_url)
      }

      await axios.post(`${API_URL}/api/productos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      alert('✅ Producto creado exitosamente')
      setShowProductoModal(false)
      setFilePreview(null)
      setNewProducto({ nombre: '', descripcion: '', precio: '', id_categoria: '', id_caja: '', imagen_url: '', imagen_file: null })
      fetchProductos()
      fetchCajas()
    } catch (error) {
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
      
      if (editingProduct.id_caja) {
        formData.append('id_caja', parseInt(editingProduct.id_caja))
      }
      
      if (editingProduct.imagen_file) {
        formData.append('imagen', editingProduct.imagen_file)
      } else if (editingProduct.imagen_url) {
        formData.append('imagen_url', editingProduct.imagen_url)
      }

      await axios.put(`${API_URL}/api/productos/${editingProduct.id_producto}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      alert('✅ Producto actualizado exitosamente')
      setShowProductoModal(false)
      setFilePreview(null)
      setEditingProduct(null)
      fetchProductos()
      fetchCajas()
    } catch (error) {
      alert(error.response?.data?.error || 'Error al actualizar el producto')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteProducto = async () => {
    try {
      await axios.delete(`${API_URL}/api/productos/${deletingId}`)
      alert('✅ Producto eliminado exitosamente')
      setShowDeleteConfirm(false)
      setDeletingId(null)
      fetchProductos()
      fetchCajas()
    } catch (error) {
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
      alert('Error al crear la categoría')
    }
  }

  const openEditCajaModal = (caja) => {
    setEditingCaja({...caja})
    setShowCajaModal(true)
  }

  const openEditProductoModal = (producto) => {
    if (producto.vendido) {
      alert('⚠️ No puedes editar un producto que ya ha sido vendido')
      return
    }
    setEditingProduct({...producto, imagen_file: null})
    setFilePreview(producto.imagen_url || null)
    setShowProductoModal(true)
  }

  const confirmDelete = (id, type) => {
    setDeletingId(id)
    setDeleteType(type)
    setShowDeleteConfirm(true)
  }

  const openCajaDetail = async (cajaId) => {
    try {
      const response = await axios.get(`${API_URL}/api/cajas/${cajaId}`)
      setSelectedCajaDetail(response.data)
      setShowCajaDetailModal(true)
    } catch (error) {
      alert('Error al cargar detalles de la caja')
    }
  }

  const filteredCajas = cajas.filter(caja => {
    const matchesSearch = caja.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caja.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caja.proveedor?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCaja = filterCaja === 'todas' || producto.id_caja?.toString() === filterCaja
    const matchesCategoria = filterCategoria === 'todas' || producto.id_categoria?.toString() === filterCategoria
    const matchesEstado = filterEstado === 'todos' || 
      (filterEstado === 'disponibles' && producto.disponible) ||
      (filterEstado === 'vendidos' && producto.vendido)

    return matchesSearch && matchesCaja && matchesCategoria && matchesEstado
  })

  const totalProductos = productos.length
  const totalVendidos = productos.filter(p => p.vendido).length
  const totalDisponibles = totalProductos - totalVendidos

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                📦 Gestión de Cajas y Productos
              </h1>
              <p className="text-gray-600 mt-1">Organiza tus productos por cajas de llegada</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCategoryModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center space-x-2"
              >
                <span>🏷️ Nueva Categoría</span>
              </button>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-white rounded-3xl shadow-xl p-2 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('cajas')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'cajas'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📦 Cajas ({cajas.length})
            </button>
            <button
              onClick={() => setActiveTab('productos')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'productos'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🎁 Productos ({totalProductos})
            </button>
          </div>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-xl">
            <p className="text-blue-100 text-xs font-medium uppercase mb-1">Total Cajas</p>
            <h3 className="text-3xl font-bold">{cajas.length}</h3>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white shadow-xl">
            <p className="text-indigo-100 text-xs font-medium uppercase mb-1">Total Productos</p>
            <h3 className="text-3xl font-bold">{totalProductos}</h3>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-xl">
            <p className="text-green-100 text-xs font-medium uppercase mb-1">Disponibles</p>
            <h3 className="text-3xl font-bold">{totalDisponibles}</h3>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-5 text-white shadow-xl">
            <p className="text-orange-100 text-xs font-medium uppercase mb-1">Vendidos</p>
            <h3 className="text-3xl font-bold">{totalVendidos}</h3>
          </div>
        </div>

        {/* CONTENIDO POR TAB */}
        {activeTab === 'cajas' ? (
          <>
            {/* FILTROS Y BÚSQUEDA CAJAS */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Buscar por código, descripción o proveedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                  <svg className="absolute left-4 top-4 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  onClick={() => {
                    setEditingCaja(null)
                    setNewCaja({ codigo: '', descripcion: '', fecha_llegada: '', proveedor: '', costo_total: '', observaciones: '' })
                    setShowCajaModal(true)
                  }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Nueva Caja</span>
                </button>
              </div>
            </div>

            {/* GRID DE CAJAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-20">
                  <div className="animate-spin w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
                </div>
              ) : filteredCajas.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-2xl">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500 text-lg">No se encontraron cajas</p>
                </div>
              ) : (
                filteredCajas.map((caja) => (
                  <div key={caja.id_caja} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border-2 border-indigo-100">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{caja.codigo}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          caja.estado === 'en_proceso' ? 'bg-yellow-400 text-yellow-900' :
                          caja.estado === 'completada' ? 'bg-green-400 text-green-900' :
                          'bg-gray-400 text-gray-900'
                        }`}>
                          {caja.estado === 'en_proceso' ? '⏳ En Proceso' :
                           caja.estado === 'completada' ? '✅ Completada' : '📁 Archivada'}
                        </span>
                      </div>
                      <p className="text-indigo-100 text-sm">📅 {new Date(caja.fecha_llegada).toLocaleDateString()}</p>
                    </div>

                    <div className="p-5">
                      <p className="text-gray-700 mb-4 line-clamp-2 min-h-[3rem]">{caja.descripcion || 'Sin descripción'}</p>
                      
                      {caja.proveedor && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold">Proveedor:</span> {caja.proveedor}
                        </p>
                      )}

                      {caja.costo_total && (
                        <p className="text-lg font-bold text-green-600 mb-4">
                          💰 Bs. {parseFloat(caja.costo_total).toFixed(2)}
                        </p>
                      )}

                      <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50 p-3 rounded-xl">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-indigo-600">{caja.total_productos || 0}</p>
                          <p className="text-xs text-gray-600">Total</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{caja.productos_disponibles || 0}</p>
                          <p className="text-xs text-gray-600">Disponibles</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">{caja.productos_vendidos || 0}</p>
                          <p className="text-xs text-gray-600">Vendidos</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openCajaDetail(caja.id_caja)}
                          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-600 transition-all"
                        >
                          👁️ Ver
                        </button>
                        <button
                          onClick={() => openEditCajaModal(caja)}
                          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => confirmDelete(caja.id_caja, 'caja')}
                          className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {/* FILTROS Y BÚSQUEDA PRODUCTOS */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
                <svg className="absolute left-4 top-4 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <select
                  value={filterCaja}
                  onChange={(e) => setFilterCaja(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="todas">📦 Todas las cajas</option>
                  {cajas.map((caja) => (
                    <option key={caja.id_caja} value={caja.id_caja}>{caja.codigo}</option>
                  ))}
                </select>

                <select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="todas">🏷️ Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
                  ))}
                </select>

                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="todos">📊 Todos los estados</option>
                  <option value="disponibles">✅ Disponibles</option>
                  <option value="vendidos">🔴 Vendidos</option>
                </select>

                <button
                  onClick={() => {
                    setEditingProduct(null)
                    setFilePreview(null)
                    setNewProducto({ nombre: '', descripcion: '', precio: '', id_categoria: '', id_caja: '', imagen_url: '', imagen_file: null })
                    setShowProductoModal(true)
                  }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  ➕ Nuevo Producto
                </button>
              </div>
            </div>

            {/* GRID DE PRODUCTOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-20">
                  <div className="animate-spin w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
                </div>
              ) : filteredProductos.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-2xl">
                  <div className="text-6xl mb-4">🎁</div>
                  <p className="text-gray-500 text-lg">No se encontraron productos</p>
                </div>
              ) : (
                filteredProductos.map((producto) => (
                  <div key={producto.id_producto} className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border-2 ${
                    producto.vendido ? 'border-red-200' : 'border-green-200'
                  }`}>
                    <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-500">
                      {producto.imagen_url ? (
                        <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2">
                        {producto.vendido ? (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">🔴 VENDIDO</span>
                        ) : (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">✅ DISPONIBLE</span>
                        )}
                      </div>

                      <div className="absolute top-2 left-2">
                        <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          ID: {producto.id_producto}
                        </span>
                      </div>

                      {producto.caja && (
                        <div className="absolute bottom-2 left-2">
                          <span className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                            📦 {producto.caja.codigo}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">
                        {producto.nombre}
                      </h3>
                      
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 mb-2">
                        {producto.categoria?.nombre || 'Sin categoría'}
                      </span>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                        {producto.descripcion || 'Sin descripción'}
                      </p>

                      <div className="flex items-center justify-between mb-3 pb-3 border-b-2 border-gray-100">
                        <span className="text-2xl font-bold text-green-600">
                          💰 Bs. {producto.precio?.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditProductoModal(producto)}
                          disabled={producto.vendido}
                          className={`flex-1 px-3 py-2 rounded-xl font-semibold transition-all text-sm ${
                            producto.vendido
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md'
                          }`}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => confirmDelete(producto.id_producto, 'producto')}
                          disabled={producto.vendido}
                          className={`px-3 py-2 rounded-xl font-semibold transition-all ${
                            producto.vendido
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-red-500 text-white hover:bg-red-600 shadow-md'
                          }`}
                        >
                          🗑️
                        </button>
                      </div>

                      {producto.vendido && (
                        <p className="text-center text-xs text-gray-500 mt-2 italic">
                          🔒 Producto vendido
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* MODAL CREAR/EDITAR CAJA */}
      {showCajaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">
                    {editingCaja ? '✏️ Editar Caja' : '📦 Nueva Caja'}
                  </h3>
                  <p className="text-indigo-100 mt-1">
                    {editingCaja ? 'Modifica los datos de la caja' : 'Registra una nueva caja de productos'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCajaModal(false)
                    setEditingCaja(null)
                  }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={editingCaja ? handleUpdateCaja : handleCreateCaja} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    🔢 Código de Caja *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCaja ? editingCaja.codigo : newCaja.codigo}
                    onChange={(e) => editingCaja
                      ? setEditingCaja({...editingCaja, codigo: e.target.value})
                      : setNewCaja({...newCaja, codigo: e.target.value})
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Ej: CAJA-2024-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📅 Fecha de Llegada *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingCaja ? editingCaja.fecha_llegada?.split('T')[0] : newCaja.fecha_llegada}
                    onChange={(e) => editingCaja
                      ? setEditingCaja({...editingCaja, fecha_llegada: e.target.value})
                      : setNewCaja({...newCaja, fecha_llegada: e.target.value})
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📝 Descripción
                </label>
                <textarea
                  rows="3"
                  value={editingCaja ? editingCaja.descripcion : newCaja.descripcion}
                  onChange={(e) => editingCaja
                    ? setEditingCaja({...editingCaja, descripcion: e.target.value})
                    : setNewCaja({...newCaja, descripcion: e.target.value})
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                  placeholder="Describe el contenido de esta caja..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    🏢 Proveedor
                  </label>
                  <input
                    type="text"
                    value={editingCaja ? editingCaja.proveedor : newCaja.proveedor}
                    onChange={(e) => editingCaja
                      ? setEditingCaja({...editingCaja, proveedor: e.target.value})
                      : setNewCaja({...newCaja, proveedor: e.target.value})
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Nombre del proveedor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    💰 Costo Total (Bs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCaja ? editingCaja.costo_total : newCaja.costo_total}
                    onChange={(e) => editingCaja
                      ? setEditingCaja({...editingCaja, costo_total: e.target.value})
                      : setNewCaja({...newCaja, costo_total: e.target.value})
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {editingCaja && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📊 Estado de la Caja
                  </label>
                  <select
                    value={editingCaja.estado}
                    onChange={(e) => setEditingCaja({...editingCaja, estado: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  >
                    <option value="en_proceso">⏳ En Proceso</option>
                    <option value="completada">✅ Completada</option>
                    <option value="archivada">📁 Archivada</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📋 Observaciones
                </label>
                <textarea
                  rows="3"
                  value={editingCaja ? editingCaja.observaciones : newCaja.observaciones}
                  onChange={(e) => editingCaja
                    ? setEditingCaja({...editingCaja, observaciones: e.target.value})
                    : setNewCaja({...newCaja, observaciones: e.target.value})
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                  placeholder="Notas adicionales sobre esta caja..."
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCajaModal(false)
                    setEditingCaja(null)
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  {editingCaja ? '💾 Actualizar' : '✨ Crear Caja'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR/EDITAR PRODUCTO */}
      {showProductoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">
                    {editingProduct ? '✏️ Editar Producto' : '✨ Nuevo Producto'}
                  </h3>
                  <p className="text-indigo-100 mt-1">
                    {editingProduct ? 'Modifica los datos del producto' : 'Agrega un producto a una caja'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowProductoModal(false)
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent disabled:opacity-50"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none disabled:opacity-50"
                  placeholder="Describe las características del producto..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent disabled:opacity-50"
                    placeholder="0.00"
                  />
                </div>

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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent disabled:opacity-50"
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
                    📦 Caja
                  </label>
                  <select
                    disabled={isUploading}
                    value={editingProduct ? editingProduct.id_caja || '' : newProducto.id_caja}
                    onChange={(e) => editingProduct
                      ? setEditingProduct({...editingProduct, id_caja: e.target.value})
                      : setNewProducto({...newProducto, id_caja: e.target.value})
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="">Sin caja</option>
                    {cajas.map((caja) => (
                      <option key={caja.id_caja} value={caja.id_caja}>
                        {caja.codigo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
                    📷 Subir imagen
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    📱 Máximo 5MB
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
                    🔗 URL de imagen
                  </label>
                  <input
                    type="url"
                    disabled={isUploading}
                    value={editingProduct ? editingProduct.imagen_url || '' : newProducto.imagen_url || ''}
                    onChange={(e) => {
                      const url = e.target.value
                      if (url) setFilePreview(url)
                      if (editingProduct) {
                        setEditingProduct({...editingProduct, imagen_url: url, imagen_file: null})
                      } else {
                        setNewProducto({...newProducto, imagen_url: url, imagen_file: null})
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent disabled:opacity-50"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
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
                    <p className="text-xs text-yellow-600">Por favor espera</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductoModal(false)
                    setEditingProduct(null)
                    setFilePreview(null)
                  }}
                  disabled={isUploading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
                >
                  {isUploading ? 'Subiendo...' : editingProduct ? '💾 Actualizar' : '✨ Crear'}
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
                  <p className="text-purple-100 mt-1">Organiza tus productos</p>
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
                  📝 Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={newCategoria.nombre}
                  onChange={(e) => setNewCategoria({...newCategoria, nombre: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Ej: Joyería"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                  placeholder="Describe la categoría..."
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                >
                  ✨ Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE CAJA */}
      {showCajaDetailModal && selectedCajaDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">📦 {selectedCajaDetail.codigo}</h3>
                  <p className="text-blue-100 mt-1">Detalles de la caja</p>
                </div>
                <button
                  onClick={() => {
                    setShowCajaDetailModal(false)
                    setSelectedCajaDetail(null)
                  }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Información de la caja */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">📅 Fecha de Llegada</p>
                  <p className="text-lg font-bold text-gray-800">
                    {new Date(selectedCajaDetail.fecha_llegada).toLocaleDateString()}
                  </p>
                </div>

                {selectedCajaDetail.proveedor && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">🏢 Proveedor</p>
                    <p className="text-lg font-bold text-gray-800">{selectedCajaDetail.proveedor}</p>
                  </div>
                )}

                {selectedCajaDetail.costo_total && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">💰 Costo Total</p>
                    <p className="text-lg font-bold text-green-600">
                      Bs. {parseFloat(selectedCajaDetail.costo_total).toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">📊 Estado</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                    selectedCajaDetail.estado === 'en_proceso' ? 'bg-yellow-200 text-yellow-900' :
                    selectedCajaDetail.estado === 'completada' ? 'bg-green-200 text-green-900' :
                    'bg-gray-200 text-gray-900'
                  }`}>
                    {selectedCajaDetail.estado === 'en_proceso' ? '⏳ En Proceso' :
                     selectedCajaDetail.estado === 'completada' ? '✅ Completada' : '📁 Archivada'}
                  </span>
                </div>
              </div>

              {selectedCajaDetail.descripcion && (
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-blue-800 font-semibold mb-2">📝 Descripción</p>
                  <p className="text-gray-700">{selectedCajaDetail.descripcion}</p>
                </div>
              )}

              {selectedCajaDetail.observaciones && (
                <div className="bg-yellow-50 p-4 rounded-xl">
                  <p className="text-sm text-yellow-800 font-semibold mb-2">📋 Observaciones</p>
                  <p className="text-gray-700">{selectedCajaDetail.observaciones}</p>
                </div>
              )}

              {/* Productos de la caja */}
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  🎁 Productos en esta caja ({selectedCajaDetail.productos?.length || 0})
                </h4>

                {selectedCajaDetail.productos && selectedCajaDetail.productos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedCajaDetail.productos.map((producto) => (
                      <div key={producto.id_producto} className={`bg-white border-2 rounded-xl p-4 shadow-sm ${
                        producto.vendido ? 'border-red-200' : 'border-green-200'
                      }`}>
                        {producto.imagen_url && (
                          <img
                            src={producto.imagen_url}
                            alt={producto.nombre}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        
                        <h5 className="font-bold text-gray-800 mb-1 line-clamp-1">
                          {producto.nombre}
                        </h5>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {producto.descripcion || 'Sin descripción'}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600">
                            Bs. {producto.precio?.toFixed(2)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            producto.vendido ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {producto.vendido ? '🔴 Vendido' : '✅ Disponible'}
                          </span>
                        </div>

                        {producto.categoria && (
                          <p className="text-xs text-gray-500 mt-2">
                            🏷️ {producto.categoria.nombre}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-xl">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="text-gray-500">Esta caja aún no tiene productos asignados</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setShowCajaDetailModal(false)
                  setSelectedCajaDetail(null)
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                Cerrar
              </button>
            </div>
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
                ¿Estás seguro de que deseas eliminar {deleteType === 'caja' ? 'esta caja' : 'este producto'}?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeletingId(null)
                    setDeleteType(null)
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={deleteType === 'caja' ? handleDeleteCaja : handleDeleteProducto}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
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

export default CajasProductos