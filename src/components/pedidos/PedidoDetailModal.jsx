// ========================================
// components/pedidos/PedidoDetailModal.jsx
// ========================================
export default function PedidoDetailModal({ isOpen, onClose, pedido, clientes, productos, onUpdateEstado }) {

  if (!isOpen || !pedido) return null

  const cliente = clientes.find(c => c.id_cliente === pedido.id_cliente)
  const calcularTotal = () => {
    return pedido.detalles?.reduce((sum, d) => 
      sum + (d.cantidad * d.precio_unitario), 0
    ) || 0
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan1-600 to-ocean1-600 p-6 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Pedido #{pedido.id_pedido}</h3>
              <p className="text-cyan1-100 mt-1">Detalles completos</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Info Cliente */}
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
              <svg className="w-6 h-6 mr-2 text-cyan1-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Información del Cliente
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-bold text-gray-900">{cliente?.nombre || 'Desconocido'}</p>
              </div>
              {cliente?.email && (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{cliente.email}</p>
                </div>
              )}
              {cliente?.telefono && (
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-medium text-gray-900">{cliente.telefono}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Fecha del Pedido</p>
                <p className="font-medium text-gray-900">
                  {new Date(pedido.fecha).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
              <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Productos
            </h4>
            <div className="space-y-3">
              {pedido.detalles?.map((detalle, idx) => {
                const producto = productos.find(p => p.id_producto === detalle.id_producto)
                return (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-indigo-300 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{producto?.nombre || 'Producto'}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {detalle.cantidad} pack × Bs. {detalle.precio_unitario.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-indigo-600">
                      Bs. {(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t-2 border-indigo-300 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-3xl font-bold text-green-600">
                Bs. {calcularTotal().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Información de Pago */}
          {pedido.pagos && pedido.pagos.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Información de Pago
              </h4>
              {pedido.pagos.map((pago, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-green-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Monto</p>
                      <p className="text-2xl font-bold text-green-600">Bs. {pago.monto.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Método</p>
                      <p className="font-bold text-gray-900 capitalize">{pago.metodo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fecha</p>
                      <p className="font-medium text-gray-900">
                        {new Date(pago.fecha).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    {pago.comprobante_url && (
                      <div>
                        <p className="text-sm text-gray-600">Comprobante</p>
                        <a 
                          href={pago.comprobante_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan1-600 hover:text-cyan1-800 font-medium text-sm"
                        >
                          Ver comprobante →
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
            <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Observaciones
              </h4>
              <p className="text-gray-700">{pedido.observaciones}</p>
            </div>
          )}

          {/* Acciones */}
          {pedido.estado === 'pendiente' && (
            <div className="flex gap-3">
              <button
                onClick={() => onUpdateEstado(pedido.id_pedido, 'entregado')}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
              >
                ✅ Marcar como Entregado
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}