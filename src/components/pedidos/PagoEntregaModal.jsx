// components/pedidos/PagoEntregaModal.jsx - OPTIMIZADO MÓVIL
import { useState } from 'react'

function PagoEntregaModal({ isOpen, onClose, onConfirm, pedido, productos }) {
  const [monto, setMonto] = useState('')
  const [metodo, setMetodo] = useState('efectivo')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 sm:p-4 lg:p-6 rounded-t-xl sm:rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-1.5 sm:gap-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="truncate">Registrar Pago</span>
              </h2>
              <p className="text-green-100 text-xs sm:text-sm mt-0.5 sm:mt-1">
                Pedido #{pedido?.id_pedido}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 sm:p-2 transition-colors flex-shrink-0 ml-2"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-5">
          {/* Detalles del pedido */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 border border-blue-200 sm:border-2">
            <h3 className="font-bold text-gray-800 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Productos en el pedido
            </h3>
            <div className="space-y-1.5 sm:space-y-2">
              {pedido?.detalles?.map((detalle, idx) => {
                const producto = productos?.find(p => p.id_producto === detalle.id_producto)
                return (
                  <div key={idx} className="flex justify-between items-center bg-white rounded-lg p-1.5 sm:p-2 text-xs sm:text-sm">
                    <span className="text-gray-700 font-medium truncate flex-1 mr-2">
                      {producto?.nombre || 'Producto'}
                    </span>
                    <span className="text-gray-900 font-bold whitespace-nowrap text-xs sm:text-sm">
                      Bs. {(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                    </span>
                  </div>
                )
              })}
            </div>
            
            {/* Total sugerido */}
            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-blue-300 sm:border-t-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700 text-xs sm:text-sm">Total sugerido:</span>
                <span className="text-xl sm:text-2xl font-bold text-blue-600">
                  Bs. {totalSugerido.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Monto a pagar */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
              Monto a pagar *
            </label>
            <div className="relative">
              <span className="absolute left-2 sm:left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm sm:text-base lg:text-lg">
                Bs.
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full pl-10 sm:pl-12 lg:pl-14 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 border border-gray-300 sm:border-2 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base sm:text-lg font-semibold"
                placeholder="0.00"
              />
            </div>
            <button
              type="button"
              onClick={usarMontoSugerido}
              className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 hover:underline"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Usar monto sugerido
            </button>
          </div>

          {/* Método de pago */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
              Método de pago *
            </label>
            <select
              value={metodo}
              onChange={(e) => setMetodo(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border border-gray-300 sm:border-2 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-sm sm:text-base"
            >
              <option value="efectivo">💵 Efectivo</option>
              <option value="transferencia">🏦 Transferencia</option>
              <option value="qr">📱 QR</option>
              <option value="tarjeta">💳 Tarjeta</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-2.5 lg:py-3 border border-gray-300 sm:border-2 text-gray-700 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 transition-colors text-xs sm:text-sm lg:text-base"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="hidden xs:inline">Procesando...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Confirmar</span>
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