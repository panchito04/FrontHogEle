// src/components/home/OrdersStatus.jsx
import { useNavigate } from 'react-router-dom'

function OrdersStatus({ pedidosPorEstado }) {
  const navigate = useNavigate()

  const statusConfig = [
    {
      key: 'pendiente',
      label: 'Pendientes',
      description: 'En espera de pago',
      gradient: 'from-yellow-50 to-yellow-100',
      bgColor: 'bg-yellow-500',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-600',
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      key: 'pagado',
      label: 'Pagados',
      description: 'Listos para entregar',
      gradient: 'from-blue-50 to-blue-100',
      bgColor: 'bg-blue-500',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-600',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      key: 'entregado',
      label: 'Entregados',
      description: 'Completados',
      gradient: 'from-green-50 to-green-100',
      bgColor: 'bg-green-500',
      borderColor: 'border-green-500',
      textColor: 'text-green-600',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      key: 'cancelado',
      label: 'Cancelados',
      description: 'No procesados',
      gradient: 'from-red-50 to-red-100',
      bgColor: 'bg-red-500',
      borderColor: 'border-red-500',
      textColor: 'text-red-600',
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    }
  ]

  const handleStatusClick = (status) => {
    navigate(`/pedidos?estado=${status}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-ocean1-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          Estado de Pedidos
        </h3>
      </div>
      <div className="space-y-4">
        {statusConfig.map((status) => (
          <div
            key={status.key}
            onClick={() => handleStatusClick(status.key)}
            className={`flex items-center justify-between p-4 bg-gradient-to-r ${status.gradient} rounded-xl border-l-4 ${status.borderColor} hover:shadow-md transition-all cursor-pointer transform hover:scale-102`}
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 ${status.bgColor} rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-md`}>
                {pedidosPorEstado[status.key]}
              </div>
              <div>
                <span className="font-semibold text-gray-800 block">{status.label}</span>
                <span className="text-xs text-gray-600">{status.description}</span>
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