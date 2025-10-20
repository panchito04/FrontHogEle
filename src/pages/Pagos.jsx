import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'

function Pagos({ user }) {
  const [pagos, setPagos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newPago, setNewPago] = useState({
    id_pedido: '',
    monto: '',
    metodo: '',
    comprobante_url: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [pagosRes, pedidosRes] = await Promise.all([
  fetch(`${import.meta.env.VITE_API_URL}/api/pagos`),
  fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`)
])
      
      const pagosData = await pagosRes.json()
      const pedidosData = await pedidosRes.json()
      
      setPagos(pagosData)
      setPedidos(pedidosData)
    } catch (error) {
      console.error('Error al obtener datos:', error)
      alert('Error al cargar los datos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePago = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pagos`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...newPago,
    id_pedido: parseInt(newPago.id_pedido),
    monto: parseFloat(newPago.monto)
  })
})
      
      if (response.ok) {
        alert('Pago registrado exitosamente')
        setShowModal(false)
        setNewPago({ id_pedido: '', monto: '', metodo: '', comprobante_url: '' })
        fetchData()
      } else {
        alert('Error al registrar el pago')
      }
    } catch (error) {
      console.error('Error al crear pago:', error)
      alert('Error al registrar el pago')
    }
  }

  const getPedidoInfo = (id_pedido) => {
    const pedido = pedidos.find(p => p.id_pedido === id_pedido)
    return pedido ? `Pedido #${pedido.id_pedido}` : 'Desconocido'
  }

  const getMetodoBadge = (metodo) => {
    const metodos = {
      'Efectivo': 'bg-green-100 text-green-800',
      'Tarjeta': 'bg-blue-100 text-blue-800',
      'Transferencia': 'bg-purple-100 text-purple-800',
      'QR': 'bg-indigo-100 text-indigo-800',
      'Otro': 'bg-gray-100 text-gray-800'
    }
    return metodos[metodo] || 'bg-gray-100 text-gray-800'
  }

  const getMetodoIcon = (metodo) => {
    switch(metodo) {
      case 'Efectivo':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      case 'Tarjeta':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
      case 'Transferencia':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        )
      case 'QR':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const filteredPagos = pagos.filter(pago => {
    const searchLower = searchTerm.toLowerCase()
    const pedidoInfo = getPedidoInfo(pago.id_pedido).toLowerCase()
    return (
      pago.id_pago.toString().includes(searchLower) ||
      pedidoInfo.includes(searchLower) ||
      pago.metodo?.toLowerCase().includes(searchLower) ||
      pago.monto.toString().includes(searchLower)
    )
  })

  const totalMonto = filteredPagos.reduce((sum, pago) => sum + parseFloat(pago.monto || 0), 0)

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
                  Gestión de Pagos
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Administra todos los pagos recibidos</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Registrar Pago</span>
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
                placeholder="Buscar por ID, pedido, método o monto..."
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
            ) : filteredPagos.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500 text-lg">No se encontraron pagos</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Pedido</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Monto</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Método</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Comprobante</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPagos.map((pago) => (
                      <tr key={pago.id_pago} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">#{pago.id_pago}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-indigo-600">{getPedidoInfo(pago.id_pedido)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-green-600">Bs. {parseFloat(pago.monto).toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex items-center space-x-1 text-xs leading-5 font-semibold rounded-full ${getMetodoBadge(pago.metodo)}`}>
                            {getMetodoIcon(pago.metodo)}
                            <span>{pago.metodo}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {new Date(pago.fecha).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {pago.comprobante_url ? (
                            <a 
                              href={pago.comprobante_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-sm">Ver</span>
                            </a>
                          ) : (
                            <span className="text-sm text-gray-400">Sin comprobante</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="text-red-600 hover:text-red-900 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
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
            ) : filteredPagos.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500 text-lg">No se encontraron pagos</p>
              </div>
            ) : (
              filteredPagos.map((pago) => (
                <div key={pago.id_pago} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{getPedidoInfo(pago.id_pedido)}</h3>
                      <p className="text-xs text-gray-500">Pago #{pago.id_pago}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">Bs. {parseFloat(pago.monto).toFixed(2)}</p>
                      <span className={`px-3 py-1 inline-flex items-center space-x-1 text-xs font-semibold rounded-full ${getMetodoBadge(pago.metodo)} mt-1`}>
                        {getMetodoIcon(pago.metodo)}
                        <span>{pago.metodo}</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-gray-100 pt-3">
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">
                        {new Date(pago.fecha).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    {pago.comprobante_url && (
                      <a 
                        href={pago.comprobante_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Ver comprobante</span>
                      </a>
                    )}
                  </div>

                  <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-100">
                    <button className="flex-1 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Información adicional */}
          <div className="mt-4 sm:mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 border-2 border-indigo-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Total de Pagos</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800">{pagos.length}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Monto Total</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">Bs. {totalMonto.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Filtrados</p>
                  <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{filteredPagos.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para registrar pago */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
              <h3 className="text-xl sm:text-2xl font-bold">Registrar Pago</h3>
              <p className="text-indigo-100 mt-1 text-sm sm:text-base">Completa los datos del pago</p>
            </div>
            
            <form onSubmit={handleCreatePago} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pedido *
                </label>
                <select
                  required
                  value={newPago.id_pedido}
                  onChange={(e) => setNewPago({...newPago, id_pedido: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">Selecciona un pedido</option>
                  {pedidos.map(pedido => (
                    <option key={pedido.id_pedido} value={pedido.id_pedido}>
                      Pedido #{pedido.id_pedido} - {pedido.estado}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto (Bs.) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newPago.monto}
                  onChange={(e) => setNewPago({...newPago, monto: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm sm:text-base"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago *
                </label>
                <select
                  required
                  value={newPago.metodo}
                  onChange={(e) => setNewPago({...newPago, metodo: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">Selecciona un método</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="QR">QR</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL del Comprobante
                </label>
                <input
                  type="url"
                  value={newPago.comprobante_url}
                  onChange={(e) => setNewPago({...newPago, comprobante_url: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm sm:text-base"
                  placeholder="https://example.com/comprobante.pdf"
                />
                <p className="text-xs text-gray-500 mt-1">Opcional: Link al comprobante digital</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setNewPago({ id_pedido: '', monto: '', metodo: '', comprobante_url: '' })
                  }}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition duration-200 text-sm sm:text-base"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-200 text-sm sm:text-base"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pagos