import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'

function Pedidos({ user }) {
  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [detallesPedidos, setDetallesPedidos] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDetalleModal, setShowDetalleModal] = useState(false)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [newPedido, setNewPedido] = useState({
    id_cliente: '',
    observaciones: '',
    detalles: []
  })
  const [newDetalle, setNewDetalle] = useState({
    id_producto: '',
    cantidad: '',
    precio_unitario: ''
  })

  useEffect(() => {
    if (location.state?.openModal) {
      setShowModal(true)
      window.history.replaceState({}, document.title)
    }
  }, [location])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [pedidosRes, clientesRes, productosRes] = await Promise.all([
  fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`),
  fetch(`${import.meta.env.VITE_API_URL}/api/clientes`),
  fetch(`${import.meta.env.VITE_API_URL}/api/productos`)
])
      
      const pedidosData = await pedidosRes.json()
      const clientesData = await clientesRes.json()
      const productosData = await productosRes.json()
      
      setPedidos(pedidosData)
      setClientes(clientesData)
      setProductos(productosData)
      
      // Obtener detalles de cada pedido
      const detallesMap = {}
      for (const pedido of pedidosData) {
        try {
          const detalleRes = await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos/${pedido.id_pedido}/detalles`)
          if (detalleRes.ok) {
            detallesMap[pedido.id_pedido] = await detalleRes.json()
          }
        } catch (err) {
          console.error(`Error al cargar detalles del pedido ${pedido.id_pedido}:`, err)
        }
      }
      setDetallesPedidos(detallesMap)
    } catch (error) {
      console.error('Error al obtener datos:', error)
      alert('Error al cargar los datos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePedido = async (e) => {
    e.preventDefault()
    
    if (newPedido.detalles.length === 0) {
      alert('Debes agregar al menos un producto al pedido')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newPedido)
})
      
      if (response.ok) {
        alert('Pedido creado exitosamente')
        setShowModal(false)
        setNewPedido({ id_cliente: '', observaciones: '', detalles: [] })
        setNewDetalle({ id_producto: '', cantidad: '', precio_unitario: '' })
        fetchData()
      } else {
        alert('Error al crear el pedido')
      }
    } catch (error) {
      console.error('Error al crear pedido:', error)
      alert('Error al crear el pedido')
    }
  }

  const agregarDetalle = () => {
    if (!newDetalle.id_producto || !newDetalle.cantidad || !newDetalle.precio_unitario) {
      alert('Completa todos los campos del producto')
      return
    }

    const producto = productos.find(p => p.id_producto === parseInt(newDetalle.id_producto))
    
    setNewPedido({
      ...newPedido,
      detalles: [...newPedido.detalles, {
        ...newDetalle,
        id_producto: parseInt(newDetalle.id_producto),
        cantidad: parseInt(newDetalle.cantidad),
        precio_unitario: parseFloat(newDetalle.precio_unitario),
        nombre_producto: producto?.nombre
      }]
    })
    
    setNewDetalle({ id_producto: '', cantidad: '', precio_unitario: '' })
  }

  const eliminarDetalle = (index) => {
    setNewPedido({
      ...newPedido,
      detalles: newPedido.detalles.filter((_, i) => i !== index)
    })
  }

  const handleProductoChange = (id_producto) => {
    const producto = productos.find(p => p.id_producto === parseInt(id_producto))
    setNewDetalle({
      id_producto,
      cantidad: newDetalle.cantidad,
      precio_unitario: producto?.precio || ''
    })
  }

  const getClienteNombre = (id_cliente) => {
    const cliente = clientes.find(c => c.id_cliente === id_cliente)
    return cliente?.nombre || 'Desconocido'
  }

  const getProductoNombre = (id_producto) => {
    const producto = productos.find(p => p.id_producto === id_producto)
    return producto?.nombre || 'Producto desconocido'
  }

  const getEstadoBadge = (estado) => {
    const estados = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'pagado': 'bg-green-100 text-green-800',
      'enviado': 'bg-blue-100 text-blue-800',
      'entregado': 'bg-purple-100 text-purple-800',
      'cancelado': 'bg-red-100 text-red-800'
    }
    return estados[estado] || 'bg-gray-100 text-gray-800'
  }

  const calcularTotalPedido = (id_pedido) => {
    const detalles = detallesPedidos[id_pedido] || []
    return detalles.reduce((sum, det) => sum + (det.cantidad * det.precio_unitario), 0)
  }

  const verDetalle = (pedido) => {
    setPedidoSeleccionado(pedido)
    setShowDetalleModal(true)
  }

  const filteredPedidos = pedidos.filter(pedido => {
    const clienteNombre = getClienteNombre(pedido.id_cliente).toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    const detalles = detallesPedidos[pedido.id_pedido] || []
    const productosNombres = detalles.map(d => getProductoNombre(d.id_producto).toLowerCase()).join(' ')
    
    return (
      pedido.id_pedido.toString().includes(searchLower) ||
      clienteNombre.includes(searchLower) ||
      pedido.estado?.toLowerCase().includes(searchLower) ||
      pedido.observaciones?.toLowerCase().includes(searchLower) ||
      productosNombres.includes(searchLower)
    )
  })

  const calcularTotal = () => {
    return newPedido.detalles.reduce((sum, det) => 
      sum + (det.cantidad * det.precio_unitario), 0
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      
      <div className="flex-1 overflow-auto lg:ml-0 pt-16 lg:pt-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Gestión de Pedidos
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Administra todos los pedidos con detalles</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Nuevo Pedido</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Barra de búsqueda */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por ID, cliente, producto, estado u observaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition duration-200 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Vista Desktop - Tabla */}
          <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <svg className="animate-spin h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : filteredPedidos.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 text-lg">No se encontraron pedidos</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Productos</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPedidos.map((pedido) => {
                      const detalles = detallesPedidos[pedido.id_pedido] || []
                      const total = calcularTotalPedido(pedido.id_pedido)
                      
                      return (
                        <tr key={pedido.id_pedido} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">#{pedido.id_pedido}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                {getClienteNombre(pedido.id_cliente).charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{getClienteNombre(pedido.id_cliente)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-1">
                              {detalles.slice(0, 2).map((detalle, idx) => (
                                <div key={idx} className="flex items-center text-sm text-gray-600">
                                  <svg className="w-4 h-4 mr-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                  </svg>
                                  <span>{detalle.cantidad}x {getProductoNombre(detalle.id_producto)}</span>
                                </div>
                              ))}
                              {detalles.length > 2 && (
                                <span className="text-xs text-indigo-600 font-medium">+{detalles.length - 2} más</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-lg font-bold text-green-600">Bs. {total.toFixed(2)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {new Date(pedido.fecha).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadge(pedido.estado)}`}>
                              {pedido.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button 
                              onClick={() => verDetalle(pedido)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button className="text-green-600 hover:text-green-900 mr-3 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button className="text-red-600 hover:text-red-900 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Vista Mobile - Cards */}
          <div className="md:hidden space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <svg className="animate-spin h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : filteredPedidos.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 text-lg">No se encontraron pedidos</p>
              </div>
            ) : (
              filteredPedidos.map((pedido) => {
                const detalles = detallesPedidos[pedido.id_pedido] || []
                const total = calcularTotalPedido(pedido.id_pedido)
                
                return (
                  <div key={pedido.id_pedido} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {getClienteNombre(pedido.id_cliente).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{getClienteNombre(pedido.id_cliente)}</h3>
                          <p className="text-xs text-gray-500">Pedido #{pedido.id_pedido}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </div>

                    <div className="space-y-2 border-t border-gray-100 pt-3">
                      <div className="bg-indigo-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 font-medium mb-2">Productos:</p>
                        {detalles.map((detalle, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-700">{detalle.cantidad}x {getProductoNombre(detalle.id_producto)}</span>
                            <span className="text-gray-900 font-semibold">Bs. {(detalle.cantidad * detalle.precio_unitario).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(pedido.fecha).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </div>
                        <p className="text-xl font-bold text-green-600">Bs. {total.toFixed(2)}</p>
                      </div>

                      {pedido.observaciones && (
                        <div className="flex items-start text-sm pt-2 border-t border-gray-100">
                          <svg className="w-4 h-4 mr-2 text-yellow-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          <span className="text-gray-600 flex-1">{pedido.observaciones}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-100">
                      <button 
                        onClick={() => verDetalle(pedido)}
                        className="flex-1 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-sm">Ver</span>
                      </button>
                      <button className="flex-1 p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center justify-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span className="text-sm">Editar</span>
                      </button>
                      <button className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Información adicional */}
          <div className="mt-4 sm:mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 border-2 border-indigo-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Total de Pedidos</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800">{pedidos.length}</p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xs sm:text-sm text-gray-600">Resultados mostrados</p>
                <p className="text-xl sm:text-2xl font-bold text-indigo-600">{filteredPedidos.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear pedido */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
              <h3 className="text-xl sm:text-2xl font-bold">Nuevo Pedido</h3>
              <p className="text-indigo-100 mt-1 text-sm sm:text-base">Completa los datos del pedido</p>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente *
                </label>
                <select
                  required
                  value={newPedido.id_cliente}
                  onChange={(e) => setNewPedido({...newPedido, id_cliente: parseInt(e.target.value)})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">Selecciona un cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id_cliente} value={cliente.id_cliente}>
                      {cliente.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  rows="2"
                  value={newPedido.observaciones}
                  onChange={(e) => setNewPedido({...newPedido, observaciones: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm sm:text-base"
                  placeholder="Ej: Entrega rápida, por favor"
                ></textarea>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Productos del Pedido</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div>
                    <select
                      value={newDetalle.id_producto}
                      onChange={(e) => handleProductoChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 text-sm"
                    >
                      <option value="">Producto</option>
                      {productos.map(producto => (
                        <option key={producto.id_producto} value={producto.id_producto}>
                          {producto.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={newDetalle.cantidad}
                      onChange={(e) => setNewDetalle({...newDetalle, cantidad: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 text-sm"
                      placeholder="Cantidad"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      value={newDetalle.precio_unitario}
                      onChange={(e) => setNewDetalle({...newDetalle, precio_unitario: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 text-sm"
                      placeholder="Precio"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={agregarDetalle}
                  className="w-full bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-200 transition duration-200 flex items-center justify-center space-x-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Agregar Producto</span>
                </button>

                {newPedido.detalles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h5 className="font-semibold text-gray-700 text-sm">Productos agregados:</h5>
                    {newPedido.detalles.map((detalle, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{detalle.nombre_producto}</p>
                          <p className="text-xs text-gray-600">
                            {detalle.cantidad} x Bs. {detalle.precio_unitario.toFixed(2)} = Bs. {(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => eliminarDetalle(index)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <div className="bg-indigo-50 p-3 rounded-lg border-2 border-indigo-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">Total:</span>
                        <span className="text-xl font-bold text-indigo-600">Bs. {calcularTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setNewPedido({ id_cliente: '', observaciones: '', detalles: [] })
                    setNewDetalle({ id_producto: '', cantidad: '', precio_unitario: '' })
                  }}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition duration-200 text-sm sm:text-base"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreatePedido}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-200 text-sm sm:text-base"
                >
                  Crear Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalle del Pedido */}
      {showDetalleModal && pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">Pedido #{pedidoSeleccionado.id_pedido}</h3>
                  <p className="text-indigo-100 mt-1 text-sm sm:text-base">Detalles completos</p>
                </div>
                <button 
                  onClick={() => setShowDetalleModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
              {/* Información del Cliente */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Información del Cliente
                </h4>
                <p className="text-gray-700"><span className="font-semibold">Nombre:</span> {getClienteNombre(pedidoSeleccionado.id_cliente)}</p>
                <p className="text-gray-700 mt-1"><span className="font-semibold">Fecha:</span> {new Date(pedidoSeleccionado.fecha).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}</p>
                <div className="mt-2">
                  <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getEstadoBadge(pedidoSeleccionado.estado)}`}>
                    {pedidoSeleccionado.estado}
                  </span>
                </div>
              </div>

              {/* Productos */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Productos
                </h4>
                <div className="space-y-2">
                  {(detallesPedidos[pedidoSeleccionado.id_pedido] || []).map((detalle, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{getProductoNombre(detalle.id_producto)}</p>
                        <p className="text-sm text-gray-600">Cantidad: {detalle.cantidad} | Precio unitario: Bs. {detalle.precio_unitario.toFixed(2)}</p>
                      </div>
                      <p className="text-lg font-bold text-indigo-600">Bs. {(detalle.cantidad * detalle.precio_unitario).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-300 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-green-600">Bs. {calcularTotalPedido(pedidoSeleccionado.id_pedido).toFixed(2)}</span>
                </div>
              </div>

              {/* Observaciones */}
              {pedidoSeleccionado.observaciones && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Observaciones
                  </h4>
                  <p className="text-gray-700">{pedidoSeleccionado.observaciones}</p>
                </div>
              )}

              <button
                onClick={() => setShowDetalleModal(false)}
                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pedidos