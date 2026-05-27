// src/components/home/OrdersStatus.jsx
import { useNavigate } from 'react-router-dom'

function OrdersStatus({ pedidosPorEstado }) {
  const navigate = useNavigate()

  const statusConfig = [
    {
      key: 'pendiente',
      label: 'Pendientes',
      description: 'En espera de pago',
      bgClass: 'bg-[#423a23]/5 text-[#cca64c] border-[#cca64c]/20 hover:border-[#cca64c]/40',
      badgeClass: 'bg-[#423a23] text-[#cca64c] border-[#cca64c]/20',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#cca64c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      key: 'pagado',
      label: 'Pagados',
      description: 'Listos para entregar',
      bgClass: 'bg-[#234c48]/5 text-[#35c3a8] border-[#35c3a8]/20 hover:border-[#35c3a8]/40',
      badgeClass: 'bg-[#234c48] text-[#35c3a8] border-[#35c3a8]/20',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#35c3a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      key: 'entregado',
      label: 'Entregados',
      description: 'Completados',
      bgClass: 'bg-[#1b2b3a]/5 text-[#6ba4e8] border-[#6ba4e8]/20 hover:border-[#6ba4e8]/40',
      badgeClass: 'bg-[#1b2b3a] text-[#6ba4e8] border-[#6ba4e8]/20',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#6ba4e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    {
      key: 'cancelado',
      label: 'Cancelados',
      description: 'No procesados',
      bgClass: 'bg-[#402422]/5 text-[#d97c75] border-[#d97c75]/20 hover:border-[#d97c75]/40',
      badgeClass: 'bg-[#402422] text-[#d97c75] border-[#d97c75]/20',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#d97c75]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }
  ]

  const handleStatusClick = () => {
    navigate(`/pedidos`)
  }

  return (
    <div className="bg-white/95 rounded-2xl shadow-sm p-5 sm:p-6 border border-stone-200/80 animate-slide-up">
      <div className="flex items-center justify-between mb-5 border-b border-stone-200/60 pb-4">
        <h3 className="font-serif-editorial text-base sm:text-lg font-normal text-stone-900 flex items-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-cyan1-600/5 rounded-xl border border-cyan1-600/10 flex items-center justify-center mr-3 text-cyan1-600">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          Estado de Pedidos
        </h3>
      </div>
      <div className="space-y-2.5">
        {statusConfig.map((status) => (
          <div
            key={status.key}
            onClick={handleStatusClick}
            className={`flex items-center justify-between p-3 sm:p-3.5 border rounded-xl transition-all duration-300 transform active:scale-[0.99] cursor-pointer group ${status.bgClass}`}
          >
            <div className="flex items-center min-w-0">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 border rounded-xl flex items-center justify-center font-bold text-sm sm:text-base mr-3 shadow-inner flex-shrink-0 ${status.badgeClass}`}>
                {pedidosPorEstado[status.key] || 0}
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-stone-900 block text-xs sm:text-sm font-sans-premium">{status.label}</span>
                <span className="text-[10px] sm:text-[11px] text-stone-500 font-sans-premium font-light tracking-wide">{status.description}</span>
              </div>
            </div>
            {status.icon}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrdersStatus