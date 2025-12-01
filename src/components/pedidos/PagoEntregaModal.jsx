import { useState } from 'react'

function PagoEntregaModal({ isOpen, onClose, onConfirm, pedido, productos }) {
  const [monto, setMonto] = useState('')
  const [metodo, setMetodo] = useState('efectivo')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calcular el total sugerido del pedido
  const calcularTotalSugerido = () => {
    return pedido?.detalles?.reduce((sum, det) => 
      sum + (det.cantidad * det.precio_unitario), 0
    ) || 0
  }

  const totalSugerido = calcularTotalSugerido()

  const handleSubmit = async () => {
    if (!monto || parseFloat(monto) <= 0) {
      alert('Por favor ingresa un monto válido')
      return
    }

    setIsSubmitting(true)
    
    await onConfirm({
      monto: parseFloat(monto),
      metodo
    })
    
    setIsSubmitting(false)
    handleClose()
  }

  const handleClose = () => {
    setMonto('')
    setMetodo('efectivo')
    onClose()
  }

  const usarMontoSugerido = () => {
    setMonto(totalSugerido.toFixed(2))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Registrar Pago
              </h2>
              <p className="text-green-100 text-sm mt-1">
                Pedido #{pedido?.id_pedido}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Detalles del pedido */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Productos en el pedido:
            </h3>
            <div className="space-y-2">
              {pedido?.detalles?.map((detalle, idx) => {
                const producto = productos?.find(p => p.id_producto === detalle.id_producto)
                return (
                  <div key={idx} className="flex justify-between items-center bg-white rounded-lg p-2 text-sm">
                    <span className="text-gray-700 font-medium truncate flex-1">
                      {producto?.nombre || 'Producto'}
                    </span>
                    <span className="text-gray-900 font-bold ml-2">
                      Bs. {(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                    </span>
                  </div>
                )
              })}
            </div>
            
            {/* Total sugerido */}
            <div className="mt-3 pt-3 border-t-2 border-blue-300">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">Total sugerido:</span>
                <span className="text-2xl font-bold text-blue-600">
                  Bs. {totalSugerido.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Monto a pagar */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Monto a pagar *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
                Bs.
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full pl-14 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold"
                placeholder="0.00"
              />
            </div>
            <button
              type="button"
              onClick={usarMontoSugerido}
              className="mt-2 text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Usar monto sugerido
            </button>
          </div>

          {/* Método de pago */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Método de pago *
            </label>
            <select
              value={metodo}
              onChange={(e) => setMetodo(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium"
            >
              <option value="efectivo">💵 Efectivo</option>
              <option value="transferencia">🏦 Transferencia</option>
              <option value="qr">📱 QR</option>
              <option value="tarjeta">💳 Tarjeta</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Confirmar Pago
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PagoEntregaModal