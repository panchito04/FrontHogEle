// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import PageHeader from '../components/common/PageHeader'
import LoadingState from '../components/home/LoadingState'
import StatsGrid from '../components/home/StatsGrid'
import SalesChart from '../components/home/SalesChart'
import OrdersStatus from '../components/home/OrdersStatus'
import TopProducts from '../components/home/TopProducts'
import RecentOrders from '../components/home/RecentOrders'
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

  const actions = [
    {
      label: isLoading ? 'Actualizando...' : 'Actualizar',
      variant: 'primary',
      onClick: fetchStats,
      icon: (
        <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
  ]

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-cream-luxury">
      <Sidebar user={user} />
      
      {/* Scrollable Container - pt-16 for mobile top bar, pb-20 for bottom navigation bar */}
      <div className="flex-1 overflow-auto pt-16 pb-20 lg:pt-0 lg:pb-8">
        <PageHeader 
          title="Dashboard" 
          description={`Bienvenido de nuevo, ${user?.nombre || 'Administrador'}`} 
          actions={actions}
        />

        <div className="p-4 sm:p-6 lg:p-8">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <div className="bg-[#402422]/5 border border-[#d97c75]/25 rounded-2xl p-8 text-center shadow-sm max-w-xl mx-auto">
              <div className="bg-[#402422]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#d97c75]/10">
                <svg className="w-8 h-8 text-[#d97c75]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2 font-serif-editorial">Error de Conexión</h3>
              <p className="text-stone-600 text-sm mb-6 font-light tracking-wide">{error}</p>
              <button
                onClick={fetchStats}
                className="px-6 py-2.5 bg-cyan1-600 text-white rounded-xl hover:bg-cyan1-700 transition-all shadow-md font-medium text-sm transform active:scale-95"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {/* Cards de estadísticas principales */}
              <StatsGrid stats={stats} />

              {/* Gráfica de ventas y estado de pedidos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                <SalesChart ventasPorMes={stats.ventasPorMes} />
                <OrdersStatus pedidosPorEstado={stats.pedidosPorEstado} />
              </div>

              {/* Top productos y pedidos recientes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                <TopProducts topProductos={stats.topProductos} />
                <RecentOrders pedidosRecientes={stats.pedidosRecientes} />
              </div>

              {/* Alerta de bajo stock - Ancho completo para el Administrador */}
              <div className="w-full">
                <LowStockAlert productosBajoStock={stats.productosBajoStock} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home