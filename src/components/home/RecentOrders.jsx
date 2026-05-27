// src/components/home/RecentOrders.jsx
import { useNavigate } from 'react-router-dom'
import { formatCurrency, getTimeAgo } from '../../utils/formatters'

function RecentOrders({ pedidosRecientes }) {
  const navigate = useNavigate()

  const handleOrderClick = () => {
    navigate(`/pedidos`)
  }

  const getEstadoBadge = (estado) => {
    const states = {
      'pendiente': 'bg-[#423a23] text-[#cca64c] border-[#cca64c]/20',
      'pagado': 'bg-[#234c48] text-[#35c3a8] border-[#35c3a8]/20',
      'entregado': 'bg-[#1b2b3a] text-[#6ba4e8] border-[#6ba4e8]/20',
      'cancelado': 'bg-[#402422] text-[#d97c75] border-[#d97c75]/20'
    }
    return states[estado] || states['pendiente']
  }

  return (
    <div className="bg-white/95 rounded-2xl shadow-sm p-5 sm:p-6 border border-stone-200/80 animate-slide-up">
      <div className="flex items-center justify-between mb-5 border-b border-stone-200/60 pb-4">
        <h3 className="font-serif-editorial text-base sm:text-lg font-normal text-stone-900 flex items-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-cyan1-600/5 rounded-xl border border-cyan1-600/10 flex items-center justify-center mr-3 text-cyan1-600">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          Pedidos Recientes
        </h3>

        <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 border border-stone-200 px-3 py-1 rounded-full uppercase tracking-wider font-sans-premium">
          Ultimos 5
        </span>
      </div>

      {pedidosRecientes && pedidosRecientes.length > 0 ? (
        <div className="space-y-2.5">
          {pedidosRecientes.map((pedido) => {
            const isVenta = pedido.estado === 'pagado' || pedido.estado === 'entregado';
            const displayTitle = pedido.cliente?.nombre || (isVenta ? 'Venta Directa' : 'Reserva');
            const displayInitial = pedido.cliente?.nombre ? pedido.cliente.nombre.charAt(0).toUpperCase() : (isVenta ? 'V' : 'R');

            return (
              <div
                key={pedido.id_pedido}
                onClick={handleOrderClick}
                className="p-3 sm:p-4 bg-[#FAF8F5] hover:bg-[#FAF8F5]/40 border border-stone-200/50 hover:border-cyan1-600/20 rounded-xl transition-all duration-300 transform active:scale-[0.99] cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex items-center flex-1 min-w-0 pr-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-cyan1-600 to-cyan1-700 rounded-xl flex items-center justify-center text-white font-serif-editorial text-xs sm:text-sm font-bold mr-3 shadow-inner flex-shrink-0">
                      {displayInitial}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-stone-900 block truncate group-hover:text-cyan1-600 transition-colors font-sans-premium">
                        {displayTitle}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-stone-400 font-sans-premium font-light">Codigo #{pedido.id_pedido}</span>
                    </div>
                  </div>

                  <span className={`text-[8px] sm:text-[9px] font-bold px-2 py-1 rounded-lg border uppercase tracking-wider font-sans-premium flex-shrink-0 ${getEstadoBadge(pedido.estado)}`}>
                    {pedido.estado}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200/50">
                  <div className="flex items-center text-[10px] sm:text-[11px] text-stone-500 font-sans-premium font-light">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-cyan1-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {getTimeAgo(pedido.fecha)}
                  </div>

                  <span className="text-sm sm:text-[15px] font-bold text-stone-900 font-sans-premium">
                    {formatCurrency(pedido.total)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-10 bg-[#FAF8F5]/80 rounded-2xl border border-dashed border-stone-200/80">
          <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-200">
            <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>

          <p className="text-stone-900 font-serif-editorial text-lg tracking-wide">Sin Ventas Recientes</p>
          <p className="text-stone-400 text-xs mt-1 font-sans-premium font-light">Las operaciones del dia apareceran aqui</p>
        </div>
      )}
    </div>
  )
}

export default RecentOrders
