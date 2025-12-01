// components/pedidos/PedidoCard.jsx - CON MÁS INFORMACIÓN
function PedidoCard({ pedido, clientes, productos, onViewDetail, onDelete, onUpdateEstado, onEntregar }) {
  const getClienteNombre = (id) => {
    const cliente = clientes.find(c => c.id_cliente === id)
    return cliente?.nombre || 'Cliente desconocido'
  }

  const getClienteInfo = (id) => {
    return clientes.find(c => c.id_cliente === id)
  }

  const getEstadoInfo = (estado) => {
    const estados = {
      'pendiente': {
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        text: 'Pendiente'
      },
      'pagado': {
        badge: 'bg-green-100 text-green-800 border-green-300',
        icon: <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        text: 'Pagado'
      },
      'entregado': {
        badge: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
        text: 'Entregado'
      },
      'cancelado': {
        badge: 'bg-red-100 text-red-800 border-red-300',
        icon: <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
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
  const cliente = getClienteInfo(pedido.id_cliente)

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-cyan1-300 group">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-1.5 sm:p-2 lg:p-3 border-b">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-cyan1-500 to-ocean1-500 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs lg:text-sm shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
              {getClienteNombre(pedido.id_cliente).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900 text-[10px] sm:text-xs lg:text-sm truncate group-hover:text-cyan1-600 transition-colors">
                {getClienteNombre(pedido.id_cliente)}
              </h3>
              <p className="text-[8px] sm:text-[9px] lg:text-[10px] text-gray-500">#{pedido.id_pedido}</p>
            </div>
          </div>
          <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[8px] sm:text-[10px] lg:text-xs font-bold rounded-full border flex items-center gap-0.5 sm:gap-1 flex-shrink-0 ${estadoInfo.badge}`}>
            {estadoInfo.icon}
            <span className="hidden sm:inline">{estadoInfo.text}</span>
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-1.5 sm:p-2 lg:p-3 space-y-1.5 sm:space-y-2">
        {/* Info del Cliente */}
        {cliente && (cliente.telefono || cliente.email) && (
          <div className="bg-blue-50 rounded-lg p-1.5 border border-blue-100">
            {cliente.telefono && (
              <div className="flex items-center gap-1 text-[8px] sm:text-[10px] text-blue-900">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="truncate">{cliente.telefono}</span>
              </div>
            )}
            {cliente.email && (
              <div className="flex items-center gap-1 text-[8px] sm:text-[10px] text-blue-900 mt-0.5">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{cliente.email}</span>
              </div>
            )}
          </div>
        )}

        {/* Productos con más detalles */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-1.5 border border-indigo-100">
          <p className="text-[9px] sm:text-[10px] font-semibold text-gray-700 mb-1 flex items-center">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>{pedido.detalles?.length || 0} producto(s)</span>
          </p>
          {pedido.detalles && pedido.detalles.length > 0 ? (
            <div className="space-y-0.5 sm:space-y-1">
              {pedido.detalles.slice(0, 3).map((detalle, idx) => {
                const producto = productos.find(p => p.id_producto === detalle.id_producto)
                return (
                  <div key={idx} className="flex items-center justify-between text-[9px] sm:text-[10px]">
                    <span className="text-gray-700 truncate flex-1">
                      {producto?.nombre || 'Producto'}
                    </span>
                    <span className="text-gray-900 font-semibold ml-1 text-[9px] sm:text-[10px] whitespace-nowrap">
                      Bs. {(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                    </span>
                  </div>
                )
              })}
              {pedido.detalles.length > 3 && (
                <p className="text-[8px] sm:text-[9px] text-indigo-600 font-medium">
                  +{pedido.detalles.length - 3} más
                </p>
              )}
            </div>
          ) : (
            <p className="text-[9px] sm:text-[10px] text-gray-500">Sin detalles</p>
          )}
        </div>

        {/* Total destacado */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-1.5 border border-green-200">
          <div className="flex justify-between items-center">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-700">Total:</span>
            <span className="text-sm sm:text-base lg:text-lg font-bold text-green-600">
              Bs. {calcularTotal().toFixed(2)}
            </span>
          </div>
        </div>

        {/* Fecha */}
        <div className="flex items-center text-[9px] sm:text-[10px] text-gray-600">
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="truncate">
            {new Date(pedido.fecha).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>

        {/* Observaciones */}
        {pedido.observaciones && (
          <div className="flex items-start text-[9px] sm:text-[10px] bg-yellow-50 border border-yellow-200 rounded-lg p-1 sm:p-1.5">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span className="text-gray-700 line-clamp-2 flex-1">
              {pedido.observaciones}
            </span>
          </div>
        )}

        {/* Info de pago */}
        {pedido.pagos && pedido.pagos.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-1 sm:p-1.5">
            <p className="text-[9px] sm:text-[10px] font-semibold text-blue-900 mb-0.5 flex items-center">
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Pagado
            </p>
            <p className="text-[9px] sm:text-[10px] text-blue-900">
              <span className="font-bold">Bs. {pedido.pagos[0].monto.toFixed(2)}</span>
              <span className="text-[8px] sm:text-[9px] ml-1">• {pedido.pagos[0].metodo}</span>
            </p>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="p-1.5 sm:p-2 bg-gray-50 border-t grid grid-cols-3 gap-1">
        <button
          onClick={() => onViewDetail(pedido)}
          className="flex items-center justify-center gap-0.5 px-1 py-1 sm:py-1.5 text-cyan1-600 hover:bg-cyan1-50 rounded-lg transition-colors font-medium text-[9px] sm:text-[10px]"
        >
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="hidden sm:inline">Ver</span>
        </button>

        {pedido.estado === 'pendiente' && (
          <button
            onClick={() => onEntregar(pedido)}
            className="flex items-center justify-center gap-0.5 px-1 py-1 sm:py-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium text-[9px] sm:text-[10px]"
          >
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="hidden sm:inline">Entregar</span>
          </button>
        )}

        <button
          onClick={() => onDelete(pedido)}
          disabled={pedido.estado === 'pagado' || pedido.estado === 'entregado'}
          className="flex items-center justify-center gap-0.5 px-1 py-1 sm:py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-[9px] sm:text-[10px] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="hidden sm:inline">Eliminar</span>
        </button>
      </div>
    </div>
  )
}

export default PedidoCard