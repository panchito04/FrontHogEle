// src/components/pedidos/PedidoCard.jsx
import React from 'react'

function PedidoCard({ pedido, clientes, productos, onViewDetail, onDelete, onUpdateEstado, onEntregar }) {
  const getClienteNombre = (id) => {
    const cliente = clientes.find(c => c.id_cliente === id)
    return cliente?.nombre || 'Operador / Cliente General'
  }

  const getClienteInfo = (id) => {
    return clientes.find(c => c.id_cliente === id)
  }

  const getEstadoInfo = (estado) => {
    const estados = {
      'pendiente': {
        borderLeft: 'border-l-4 border-l-yellow-500',
        badge: 'bg-yellow-50 text-yellow-800 border-yellow-200/60',
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        text: 'Reservado'
      },
      'pagado': {
        borderLeft: 'border-l-4 border-l-emerald-500',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        text: 'Pagado'
      },
      'entregado': {
        borderLeft: 'border-l-4 border-l-cyan1-600',
        badge: 'bg-cyan1-50 text-cyan1-700 border-cyan1-200/60',
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ),
        text: 'Entregado'
      },
      'cancelado': {
        borderLeft: 'border-l-4 border-l-stone-400',
        badge: 'bg-stone-50 text-stone-600 border-stone-200/60',
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  const cliente = getClienteInfo(pedido.id_cliente)
  const isVenta = pedido.estado === 'pagado' || pedido.estado === 'entregado'
  
  const displayTitle = pedido.id_cliente ? getClienteNombre(pedido.id_cliente) : (isVenta ? 'Venta Directa' : 'Reserva Interna')
  const displayIcon = isVenta ? 'V' : 'R'

  return (
    <div className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-stone-200/60 hover:border-cyan1-500/30 flex flex-col justify-between group transform hover:-translate-y-0.5 ${estadoInfo.borderLeft}`}>
      
      {/* Encabezado del ticket */}
      <div className="p-4 border-b border-stone-100 bg-stone-50/40">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-base">{displayIcon}</span>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-stone-400 font-sans-premium">
                Pedido #{pedido.id_pedido}
              </span>
            </div>
            <h3 className="font-serif-editorial text-base text-stone-900 truncate mt-1 leading-tight group-hover:text-cyan1-600 transition-colors" title={displayTitle}>
              {displayTitle}
            </h3>
          </div>
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full border flex items-center gap-1.5 flex-shrink-0 ${estadoInfo.badge}`}>
            {estadoInfo.icon}
            <span>{estadoInfo.text}</span>
          </span>
        </div>
      </div>

      {/* Contenido principal del ticket */}
      <div className="p-4 space-y-4 flex-1">
        
        {/* Información heredada de cliente (si existiese) */}
        {cliente && (cliente.telefono || cliente.email) && (
          <div className="bg-stone-50/80 rounded-xl p-2.5 border border-stone-200/30 text-xs text-stone-600 space-y-1">
            {cliente.telefono && (
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{cliente.telefono}</span>
              </div>
            )}
            {cliente.email && (
              <div className="flex items-center gap-1.5 truncate">
                <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{cliente.email}</span>
              </div>
            )}
          </div>
        )}

        {/* Listado de Productos */}
        <div className="bg-stone-50/50 rounded-xl p-3 border border-stone-200/20">
          <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center">
            <svg className="w-3.5 h-3.5 mr-1 text-cyan1-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>{pedido.detalles?.length || 0} Artículos</span>
          </p>
          
          {pedido.detalles && pedido.detalles.length > 0 ? (
            <div className="space-y-1.5 divide-y divide-stone-100">
              {pedido.detalles.slice(0, 3).map((detalle, idx) => {
                const producto = productos.find(p => p.id_producto === detalle.id_producto)
                return (
                  <div key={idx} className="flex items-center justify-between text-xs pt-1.5 first:pt-0">
                    <span className="text-stone-600 truncate flex-1 pr-2">
                      {producto?.nombre || 'Artículo'}
                    </span>
                    <span className="text-stone-900 font-medium whitespace-nowrap">
                      Bs. {(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                    </span>
                  </div>
                )
              })}
              {pedido.detalles.length > 3 && (
                <p className="text-[10px] text-cyan1-600 font-medium mt-1">
                  +{pedido.detalles.length - 3} más artículos
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-stone-400 italic">Sin detalles de compra</p>
          )}
        </div>

        {/* Separador tipo Ticket */}
        <div className="border-t border-dashed border-stone-200 my-2"></div>

        {/* Fila de Total */}
        <div className="flex justify-between items-center bg-stone-50/20 px-2 py-1 rounded-lg">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total</span>
          <span className="text-lg font-serif-editorial font-bold text-cyan1-600">
            Bs. {calcularTotal().toFixed(2)}
          </span>
        </div>

        {/* Footer del Ticket: Fecha & Operador */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] text-stone-400 pt-2 border-t border-stone-100 gap-1">
          <div className="flex items-center">
            <svg className="w-3.5 h-3.5 mr-1 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {new Date(pedido.fecha).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
          {pedido.usuario && (
            <span className="font-light italic truncate max-w-[120px]">
              Vendedor: {pedido.usuario.nombre}
            </span>
          )}
        </div>

        {/* Observaciones */}
        {pedido.observaciones && (
          <div className="text-[11px] bg-yellow-50/50 border border-yellow-200/50 rounded-xl p-2 text-stone-600 italic">
            <span className="font-semibold not-italic block text-[10px] text-yellow-800 uppercase tracking-wider mb-0.5">Nota</span>
            "{pedido.observaciones}"
          </div>
        )}

        {/* Historial de Pagos vinculados */}
        {pedido.pagos && pedido.pagos.length > 0 && (
          <div className="bg-emerald-50/40 border border-emerald-200/40 rounded-xl p-2.5 space-y-1">
            <p className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider flex items-center">
              <svg className="w-3.5 h-3.5 mr-1 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Transacción Registrada
            </p>
            <div className="flex justify-between text-xs text-stone-700">
              <span className="font-medium text-emerald-700">Bs. {pedido.pagos[0].monto.toFixed(2)}</span>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider">{pedido.pagos[0].metodo}</span>
            </div>
          </div>
        )}
      </div>

      {/* Botones de Acción */}
      <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2.5">
        <button
          onClick={() => onViewDetail(pedido)}
          className="flex-1 py-2 text-stone-600 hover:text-cyan1-600 bg-white hover:bg-cyan1-50/30 border border-stone-200 hover:border-cyan1-500/20 rounded-xl transition-all duration-300 font-medium text-xs flex items-center justify-center space-x-1.5 active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>Ver Recibo</span>
        </button>

        {pedido.estado === 'pendiente' && (
          <button
            onClick={() => onEntregar(pedido)}
            className="flex-1 py-2 text-white bg-cyan1-600 hover:bg-cyan1-700 rounded-xl transition-all duration-300 font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-sm shadow-cyan1-600/10 active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Entregar</span>
          </button>
        )}

        <button
          onClick={() => onDelete(pedido)}
          disabled={pedido.estado === 'pagado' || pedido.estado === 'entregado'}
          className="p-2 text-stone-400 hover:text-red-600 bg-white hover:bg-red-50 border border-stone-200 hover:border-red-200/50 rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.95]"
          title="Eliminar registro"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default PedidoCard