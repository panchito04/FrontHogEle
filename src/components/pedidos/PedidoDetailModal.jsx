// components/pedidos/PedidoDetailModal.jsx - OPTIMIZADO MÓVIL
export default function PedidoDetailModal({ isOpen, onClose, pedido, clientes, productos, onUpdateEstado }) {

  if (!isOpen || !pedido) return null

  const cliente = clientes.find(c => c.id_cliente === pedido.id_cliente)
  const calcularTotal = () => {
    return pedido.detalles?.reduce((sum, d) => 
      sum + (d.cantidad * d.precio_unitario), 0
    ) || 0
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan1-600 to-ocean1-600 p-3 sm:p-4 lg:p-6 text-white sticky top-0 z-10 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">Pedido #{pedido.id_pedido}</h3>
              <p className="text-cyan1-100 mt-0.5 sm:mt-1 text-xs sm:text-sm truncate">Detalles completos</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-1.5 sm:p-2 transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Info Cliente o Registro */}
          {pedido.id_cliente && cliente ? (
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 sm:border-2">
              <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center text-sm sm:text-base lg:text-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-1.5 sm:mr-2 text-cyan1-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="truncate">Información del Cliente</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                <div>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-0.5">Nombre</p>
                  <p className="font-bold text-gray-900 text-xs sm:text-sm lg:text-base truncate">{cliente.nombre}</p>
                </div>
                {cliente.email && (
                  <div>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-0.5">Email</p>
                    <p className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base truncate">{cliente.email}</p>
                  </div>
                )}
                {cliente.telefono && (
                  <div>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-0.5">Teléfono</p>
                    <p className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base">{cliente.telefono}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-0.5">Fecha del Pedido</p>
                  <p className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base">
                    {new Date(pedido.fecha).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                {pedido.usuario && (
                  <div>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-0.5">Registrado por</p>
                    <p className="font-bold text-cyan1-600 text-xs sm:text-sm lg:text-base truncate">
                      {pedido.usuario.nombre}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 sm:border-2">
              <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center text-sm sm:text-base lg:text-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-1.5 sm:mr-2 text-cyan1-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="truncate">Información de Operación</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                <div>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-0.5">Tipo</p>
                  <p className="font-bold text-gray-900 text-xs sm:text-sm lg:text-base">
                    {pedido.estado === 'pendiente' ? 'Reserva' : 'Venta Directa'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-0.5">Fecha y Hora</p>
                  <p className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base">
                    {new Date(pedido.fecha).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {pedido.usuario && (
                  <div>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-0.5">Operador</p>
                    <p className="font-bold text-cyan1-600 text-xs sm:text-sm lg:text-base truncate">
                      {pedido.usuario.nombre}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-0.5">Estado</p>
                  <span className="inline-block font-semibold text-gray-900 text-xs sm:text-sm lg:text-base capitalize">
                    {pedido.estado}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Productos */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-indigo-200 sm:border-2">
            <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center text-sm sm:text-base lg:text-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-1.5 sm:mr-2 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Productos
            </h4>
            <div className="space-y-2 sm:space-y-3">
              {pedido.detalles?.map((detalle, idx) => {
                const producto = productos.find(p => p.id_producto === detalle.id_producto)
                return (
                  <div key={idx} className="bg-white p-2 sm:p-3 lg:p-4 rounded-lg border border-indigo-300 flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-xs sm:text-sm lg:text-base truncate">{producto?.nombre || 'Producto'}</p>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mt-0.5 sm:mt-1">
                        {detalle.cantidad} pack × Bs. {detalle.precio_unitario.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-base sm:text-lg lg:text-xl font-bold text-indigo-600 whitespace-nowrap">
                      Bs. {(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="mt-2 sm:mt-3 lg:mt-4 pt-2 sm:pt-3 lg:pt-4 border-t border-indigo-300 sm:border-t-2 flex justify-between items-center">
              <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">Total:</span>
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                Bs. {calcularTotal().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Información de Pago */}
          {pedido.pagos && pedido.pagos.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-green-200 sm:border-2">
              <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center text-sm sm:text-base lg:text-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-1.5 sm:mr-2 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Información de Pago
              </h4>
              {pedido.pagos.map((pago, idx) => (
                <div key={idx} className="bg-white p-2 sm:p-3 lg:p-4 rounded-lg border border-green-300">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                    <div>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-0.5">Monto</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">Bs. {pago.monto.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-0.5">Método</p>
                      <p className="font-bold text-gray-900 capitalize text-xs sm:text-sm lg:text-base">{pago.metodo}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-0.5">Fecha</p>
                      <p className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base">
                        {new Date(pago.fecha).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    {pago.comprobante_url && (
                      <div>
                        <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-0.5">Comprobante</p>
                        <a 
                          href={pago.comprobante_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan1-600 hover:text-cyan1-800 font-medium text-xs sm:text-sm inline-flex items-center gap-1"
                        >
                          Ver comprobante
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Observaciones */}
          {pedido.observaciones && (
            <div className="bg-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-yellow-200 sm:border-2">
              <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 flex items-center text-xs sm:text-sm lg:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Observaciones
              </h4>
              <p className="text-gray-700 text-xs sm:text-sm lg:text-base leading-relaxed">{pedido.observaciones}</p>
            </div>
          )}

          {/* Acciones */}
          {pedido.estado === 'pendiente' && (
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => onUpdateEstado(pedido.id_pedido, 'entregado')}
                className="flex-1 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg text-xs sm:text-sm lg:text-base flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden xs:inline">Marcar como </span>Entregado
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 border border-gray-300 sm:border-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all text-xs sm:text-sm lg:text-base"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}