// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import HomeHeader from '../components/home/HomeHeader'
import LoadingState from '../components/home/LoadingState'
import StatsGrid from '../components/home/StatsGrid'
import SalesChart from '../components/home/SalesChart'
import OrdersStatus from '../components/home/OrdersStatus'
import TopProducts from '../components/home/TopProducts'
import RecentOrders from '../components/home/RecentOrders'
import RecentClients from '../components/home/RecentClients'
import LowStockAlert from '../components/home/LowStockAlert'

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

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar user={user} />
      
      <div className="flex-1 overflow-auto lg:ml-0 pt-16 lg:pt-0">
        <HomeHeader user={user} onRefresh={fetchStats} isLoading={isLoading} />

        <div className="p-4 sm:p-6 lg:p-8">
          {isLoading ? (
            <LoadingState />
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
              {/* Cards de estadísticas principales */}
              <StatsGrid stats={stats} />

              {/* Gráfica de ventas y estado de pedidos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <SalesChart ventasPorMes={stats.ventasPorMes} />
                <OrdersStatus pedidosPorEstado={stats.pedidosPorEstado} />
              </div>

              {/* Top productos y pedidos recientes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <TopProducts topProductos={stats.topProductos} />
                <RecentOrders pedidosRecientes={stats.pedidosRecientes} />
              </div>

              {/* Clientes recientes y productos con bajo stock */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentClients actividadReciente={stats.actividadReciente} />
                <LowStockAlert productosBajoStock={stats.productosBajoStock} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home