import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'

function Home({ user }) {
  const [stats, setStats] = useState({
    totales: { clientes: 0, productos: 0, pedidos: 0, ingresos: 0 },
    pedidosPorEstado: { pendiente: 0, pagado: 0, entregado: 0, cancelado: 0 },
    actividadReciente: [],
    productosBajoStock: [],
    ventasPorMes: [],
    topProductos: [],
    pedidosRecientes: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

// const API_BASE_URL =
//   import.meta.env.MODE === 'development'
//     ? import.meta.env.VITE_API_URL_LOCAL
//     : import.meta.env.VITE_API_URL_PROD

// const fetchStats = async () => {
//   try {
//     setIsLoading(true)
//     setError(null)
//     const response = await axios.get(`${API_BASE_URL}/api/home`)
//     setStats(response.data)
//   } catch (error) {
//     console.error('Error al cargar estadísticas:', error)
//     setError('No se pudieron cargar las estadísticas. Por favor, intenta de nuevo.')
//   } finally {
//     setIsLoading(false)
//   }
// }

const fetchStats = async () => {
  try {
    setIsLoading(true)
    setError(null)
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/home`)
    setStats(response.data)
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
    setError('No se pudieron cargar las estadísticas. Por favor, intenta de nuevo.')
  } finally {
    setIsLoading(false)
  }
}



  const formatCurrency = (value) => `Bs. ${parseFloat(value).toFixed(2)}`

  const getMaxVenta = () => Math.max(...stats.ventasPorMes.map(v => v.total), 1)

  const formatMes = (mes) => {
    const [year, month] = mes.split('-')
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    return `${meses[parseInt(month) - 1]} ${year}`
  }

  const getTimeAgo = (fecha) => {
    const diff = Date.now() - new Date(fecha).getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`
    if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
    return 'Hace unos minutos'
  }

  const getEstadoBadgeColor = (estado) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      pagado: 'bg-blue-100 text-blue-800 border-blue-300',
      entregado: 'bg-green-100 text-green-800 border-green-300',
      cancelado: 'bg-red-100 text-red-800 border-red-300'
    }
    return colors[estado] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar user={user} />
      
      <div className="flex-1 overflow-auto lg:ml-0 pt-16 lg:pt-0">
        {/* Header mejorado */}
        <div className="bg-white shadow-md border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Bienvenido, <span className="font-semibold ml-1">{user?.nombre}</span>
                </p>
              </div>
              <button
                onClick={fetchStats}
                disabled={isLoading}
                className="mt-4 sm:mt-0 inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isLoading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-10 h-10 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 mt-6 text-lg font-medium">Cargando estadísticas...</p>
              <p className="text-gray-400 text-sm mt-2">Obteniendo datos en tiempo real</p>
            </div>
          ) : error ? (
            <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-8 text-center shadow-lg">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-800 mb-2">Error al cargar datos</h3>
              <p className="text-red-700 mb-6">{error}</p>
              <button
                onClick={fetchStats}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg font-medium"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reintentar
              </button>
            </div>
          ) : (
            <>
              {/* Cards de estadísticas principales con animación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 animate-fade-in">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                        <p className="text-indigo-100 text-sm font-medium uppercase tracking-wide">Clientes</p>
                      </div>
                      <h3 className="text-4xl font-bold mb-1">{stats.totales.clientes}</h3>
                      <p className="text-indigo-200 text-xs">Clientes registrados</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                        <p className="text-purple-100 text-sm font-medium uppercase tracking-wide">Productos Únicos</p>
                      </div>
                      <h3 className="text-4xl font-bold mb-1">{stats.totales.productos}</h3>
                      <p className="text-purple-200 text-xs">Piezas exclusivas</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                        <p className="text-pink-100 text-sm font-medium uppercase tracking-wide">Pedidos</p>
                      </div>
                      <h3 className="text-4xl font-bold mb-1">{stats.totales.pedidos}</h3>
                      <p className="text-pink-200 text-xs">Órdenes procesadas</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                        <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Ingresos</p>
                      </div>
                      <h3 className="text-3xl font-bold mb-1">{formatCurrency(stats.totales.ingresos)}</h3>
                      <p className="text-green-200 text-xs">Ventas totales</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfica de ventas y estado de pedidos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Ventas por mes */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      Ventas Mensuales
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Últimos 6 meses</span>
                  </div>
                  {stats.ventasPorMes.length > 0 ? (
                    <div className="space-y-4">
                      {stats.ventasPorMes.map((venta, index) => (
                        <div key={venta.mes} className="transform hover:scale-102 transition-transform">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-3">
                                {index + 1}
                              </span>
                              <span className="text-sm font-semibold text-gray-700">{formatMes(venta.mes)}</span>
                            </div>
                            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                              {formatCurrency(venta.total)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
                              style={{ width: `${(venta.total / getMaxVenta()) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">No hay datos de ventas</p>
                      <p className="text-gray-400 text-sm mt-1">Las ventas aparecerán aquí</p>
                    </div>
                  )}
                </div>

                {/* Estado de pedidos */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      Estado de Pedidos
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-md">
                          {stats.pedidosPorEstado.pendiente}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 block">Pendientes</span>
                          <span className="text-xs text-gray-600">En espera de pago</span>
                        </div>
                      </div>
                      <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-md">
                          {stats.pedidosPorEstado.pagado}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 block">Pagados</span>
                          <span className="text-xs text-gray-600">Listos para entregar</span>
                        </div>
                      </div>
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500 hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-md">
                          {stats.pedidosPorEstado.entregado}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 block">Entregados</span>
                          <span className="text-xs text-gray-600">Completados</span>
                        </div>
                      </div>
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border-l-4 border-red-500 hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-md">
                          {stats.pedidosPorEstado.cancelado}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 block">Cancelados</span>
                          <span className="text-xs text-gray-600">No procesados</span>
                        </div>
                      </div>
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top productos y pedidos recientes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Top productos únicos vendidos */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      Productos Más Vendidos
                    </h3>
                    <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">Top 5</span>
                  </div>
                  {stats.topProductos && stats.topProductos.length > 0 ? (
                    <div className="space-y-3">
                      {stats.topProductos.map((producto, index) => {
                        const colors = [
                          'from-yellow-400 to-yellow-500',
                          'from-gray-400 to-gray-500',
                          'from-orange-400 to-orange-500',
                          'from-green-400 to-green-500',
                          'from-blue-400 to-blue-500'
                        ];
                        const textColors = [
                          'text-yellow-600',
                          'text-gray-600',
                          'text-orange-600',
                          'text-green-600',
                          'text-blue-600'
                        ];
                        return (
                          <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 border border-green-100">
                            <div className="flex items-center flex-1">
                              <div className={`w-10 h-10 bg-gradient-to-br ${colors[index]} rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-md`}>
                                {index === 0 ? '🏆' : index + 1}
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-semibold text-gray-800 block truncate">{producto.nombre}</span>
                                <span className="text-xs text-gray-600">Producto único vendido</span>
                              </div>
                            </div>
                            <div className="text-right ml-3">
                              <span className={`text-lg font-bold ${textColors[index]}`}>{producto.cantidad}</span>
                              <span className="block text-xs text-gray-500">ventas</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">No hay productos vendidos</p>
                      <p className="text-gray-400 text-sm mt-1">Las ventas aparecerán aquí</p>
                    </div>
                  )}
                </div>

                {/* Pedidos recientes */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      Pedidos Recientes
                    </h3>
                    <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">Últimos 5</span>
                  </div>
                  {stats.pedidosRecientes && stats.pedidosRecientes.length > 0 ? (
                    <div className="space-y-3">
                      {stats.pedidosRecientes.map((pedido) => (
                        <div key={pedido.id_pedido} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 border border-gray-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center flex-1">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold mr-3 shadow-md">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-bold text-gray-800 block truncate">
                                  {pedido.cliente?.nombre || 'Cliente no disponible'}
                                </span>
                                <span className="text-xs text-gray-500">Pedido #{pedido.id_pedido}</span>
                              </div>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${getEstadoBadgeColor(pedido.estado)}`}>
                              {pedido.estado.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <div className="flex items-center text-xs text-gray-600">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {getTimeAgo(pedido.fecha)}
                            </div>
                            <span className="text-base font-bold text-indigo-600">{formatCurrency(pedido.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">No hay pedidos recientes</p>
                      <p className="text-gray-400 text-sm mt-1">Los pedidos aparecerán aquí</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Clientes recientes y productos con bajo stock */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Clientes recientes */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      Nuevos Clientes
                    </h3>
                    <span className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-medium">Recientes</span>
                  </div>
                  {stats.actividadReciente && stats.actividadReciente.length > 0 ? (
                    <div className="space-y-3">
                      {stats.actividadReciente.slice(0, 5).map((cliente, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:shadow-md transition-all border border-indigo-100">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                            {cliente.nombre?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-800 font-semibold text-sm truncate">{cliente.nombre}</p>
                            <div className="flex items-center text-xs text-gray-600 mt-1">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {getTimeAgo(cliente.fecha_registro)}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">NUEVO</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">No hay clientes recientes</p>
                      <p className="text-gray-400 text-sm mt-1">Los registros aparecerán aquí</p>
                    </div>
                  )}
                </div>

                {/* Alerta de productos únicos vendidos */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      Productos Vendidos
                    </h3>
                    <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full font-medium flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                      Únicos
                    </span>
                  </div>
                  {stats.productosBajoStock && stats.productosBajoStock.length > 0 ? (
                    <div className="space-y-3">
                      {stats.productosBajoStock.map((producto, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-l-4 border-red-500 hover:shadow-lg transition-all transform hover:-translate-y-1">
                          <div className="flex items-center flex-1 min-w-0">
                            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white text-xl mr-3 shadow-md">
                              {producto.stock === 0 ? '⚠️' : '📦'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-semibold text-gray-800 block truncate">{producto.nombre}</span>
                              <span className="text-xs text-gray-600">
                                {producto.stock === 0 ? 'Ya vendido' : 'Producto único disponible'}
                              </span>
                            </div>
                          </div>
                          <span className={`ml-3 px-4 py-2 text-xs font-bold rounded-lg shadow-md ${
                            producto.stock === 0 
                              ? 'bg-red-600 text-white' 
                              : 'bg-yellow-500 text-white'
                          }`}>
                            {producto.stock === 0 ? 'VENDIDO' : '1 DISPONIBLE'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-green-600 font-semibold text-lg">¡Todo perfecto!</p>
                      <p className="text-gray-500 text-sm mt-2">Todos los productos están disponibles</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home