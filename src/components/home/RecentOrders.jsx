// src/components/home/RecentOrders.jsx
import { useNavigate } from 'react-router-dom'
import { formatCurrency, getTimeAgo, getEstadoBadgeColor } from '../../utils/formatters'

function RecentOrders({ pedidosRecientes }) {
  const navigate = useNavigate()

  const handleOrderClick = (pedidoId) => {
    navigate(`/pedidos/${pedidoId}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan1-500 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          Pedidos Recientes
        </h3>

        <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
          Últimos 5
        </span>
      </div>

      {pedidosRecientes && pedidosRecientes.length > 0 ? (
        <div className="space-y-3">
          {pedidosRecientes.map((pedido) => (
            <div
              key={pedido.id_pedido}
              onClick={() => handleOrderClick(pedido.id_pedido)}
              className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 border border-gray-200 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan1-500 rounded-lg flex items-center justify-center text-white font-bold mr-3 shadow-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-gray-800 block truncate">
                      {pedido.cliente?.nombre || 'Cliente no disponible'}
                    </span>
                    <span className="text-xs text-gray-500">Pedido #{pedido.id_pedido}</span>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${getEstadoBadgeColor(
                    pedido.estado
                  )}`}
                >
                  {pedido.estado.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div className="flex items-center text-xs text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {getTimeAgo(pedido.fecha)}
                </div>

                <span className="text-base font-bold text-cyan1-600">
                  {formatCurrency(pedido.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>

          <p className="text-gray-500 font-medium">No hay pedidos recientes</p>
          <p className="text-gray-400 text-sm mt-1">Los pedidos aparecerán aquí</p>
        </div>
      )}
    </div>
  )
}

export default RecentOrders
