// components/pedidos/PedidoCard.jsx
function PedidoCard({ pedido, clientes, productos, onViewDetail, onDelete, onUpdateEstado }) {
  const getClienteNombre = (id) => {
    const cliente = clientes.find(c => c.id_cliente === id)
    return cliente?.nombre || 'Cliente desconocido'
  }

  const getEstadoInfo = (estado) => {
    const estados = {
      'pendiente': {
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        text: 'Pendiente'
      },
      'pagado': {
        badge: 'bg-green-100 text-green-800 border-green-300',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        text: 'Pagado'
      },
      'entregado': {
        badge: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ),
        text: 'Entregado'
      },
      'cancelado': {
        badge: 'bg-red-100 text-red-800 border-red-300',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
        text: 'Cancelado'
      }
    }
    return estados[estado] || estados['pendiente']
  }

  const calcularTotal = () => {
    return pedido.detalles?.reduce((sum, det) => 
      sum + (det.cantidad * det.precio_unitario), 0
    ) || 0
  }

  const estadoInfo = getEstadoInfo(pedido.estado)

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-cyan1-300 group">
      {/* Header con estado */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan1-500 to-ocean1-500 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
              {getClienteNombre(pedido.id_cliente).charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-cyan1-600 transition-colors">
                {getClienteNombre(pedido.id_cliente)}
              </h3>
              <p className="text-xs text-gray-500">Pedido #{pedido.id_pedido}</p>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border-2 flex items-center gap-1 ${estadoInfo.badge}`}>
            {estadoInfo.icon}
            {estadoInfo.text}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-3">
        {/* Productos */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-100">
          <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Productos:
          </p>
          {pedido.detalles && pedido.detalles.length > 0 ? (
            <div className="space-y-1">
              {pedido.detalles.slice(0, 2).map((detalle, idx) => {
                const producto = productos.find(p => p.id_producto === detalle.id_producto)
                return (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 truncate flex-1">
                      {producto?.nombre || 'Producto'}
                    </span>
                    <span className="text-gray-900 font-semibold ml-2">
                      Bs. {(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                    </span>
                  </div>
                )
              })}
              {pedido.detalles.length > 2 && (
                <p className="text-xs text-indigo-600 font-medium mt-1">
                  +{pedido.detalles.length - 2} más...
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Sin detalles</p>
          )}
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border-2 border-green-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-700">Total:</span>
            <span className="text-2xl font-bold text-green-600">
              Bs. {calcularTotal().toFixed(2)}
            </span>
          </div>
        </div>

        {/* Fecha */}
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(pedido.fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </div>

        {/* Observaciones */}
        {pedido.observaciones && (
          <div className="flex items-start text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-2">
            <svg className="w-4 h-4 mr-2 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span className="text-gray-700 line-clamp-2 flex-1">
              {pedido.observaciones}
            </span>
          </div>
        )}

        {/* Información de pago si existe */}
        {pedido.pagos && pedido.pagos.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
            <p className="text-xs font-semibold text-blue-900 mb-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Pagado:
            </p>
            <p className="text-sm text-blue-900">
              <span className="font-bold">Bs. {pedido.pagos[0].monto.toFixed(2)}</span>
              <span className="text-xs ml-2">• {pedido.pagos[0].metodo}</span>
            </p>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="p-4 bg-gray-50 border-t grid grid-cols-3 gap-2">
        <button
          onClick={() => onViewDetail(pedido)}
          className="flex items-center justify-center gap-1 px-3 py-2 text-cyan1-600 hover:bg-cyan1-50 rounded-lg transition-colors font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Ver
        </button>

        {pedido.estado === 'pendiente' && (
          <button
            onClick={() => onUpdateEstado(pedido.id_pedido, 'entregado')}
            className="flex items-center justify-center gap-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Entregar
          </button>
        )}

        <button
          onClick={() => onDelete(pedido)}
          disabled={pedido.estado === 'pagado' || pedido.estado === 'entregado'}
          className="flex items-center justify-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Eliminar
        </button>
      </div>
    </div>
  )
}

export default PedidoCard