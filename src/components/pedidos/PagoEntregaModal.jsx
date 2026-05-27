// components/pedidos/PagoEntregaModal.jsx - OPTIMIZADO MÓVIL
import { useState } from 'react'
import Modal from '../common/Modal'
import FormField from '../common/FormField'

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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar Pago"
      subtitle={`Pedido #${pedido?.id_pedido}`}
      maxWidth="max-w-md"
      theme="success"
    >
      <div className="p-5 space-y-5">
        {/* Detalles del pedido */}
        <div className="bg-cyan1-600/5 rounded-xl p-4 border border-cyan1-600/10 shadow-inner">
          <h3 className="font-semibold text-stone-700 mb-3 flex items-center gap-1.5 text-xs uppercase tracking-wider font-sans-premium">
            <svg className="w-4 h-4 text-cyan1-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Productos en el pedido
          </h3>
          <div className="space-y-2">
            {pedido?.detalles?.map((detalle, idx) => {
              const producto = productos?.find(p => p.id_producto === detalle.id_producto)
              return (
                <div key={idx} className="flex justify-between items-center bg-white border border-stone-200/40 rounded-lg p-2 text-xs sm:text-sm">
                  <span className="text-stone-700 font-medium truncate flex-1 mr-2 font-sans-premium">
                    {producto?.nombre || 'Producto'}
                  </span>
                  <span className="text-stone-900 font-bold whitespace-nowrap">
                    Bs. {(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                  </span>
                </div>
              )
            })}
          </div>
          
          {/* Total sugerido */}
          <div className="mt-3 pt-3 border-t border-stone-200/80">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-stone-600 text-xs uppercase tracking-wider font-sans-premium">Total sugerido:</span>
              <span className="text-xl font-bold text-cyan1-700 font-serif-editorial">
                Bs. {totalSugerido.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Monto a pagar */}
        <div>
          <FormField
            label="Monto a pagar"
            id="monto"
            type="number"
            required
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="0.00"
          />
          <button
            type="button"
            onClick={usarMontoSugerido}
            className="mt-1.5 text-xs text-cyan1-600 hover:text-cyan1-700 font-semibold flex items-center gap-1 hover:underline font-sans-premium"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>Usar monto sugerido</span>
          </button>
        </div>

        {/* Método de pago */}
        <FormField
          label="Método de pago"
          id="metodo"
          type="select"
          required
          value={metodo}
          onChange={(e) => setMetodo(e.target.value)}
          placeholder="Selecciona método..."
          options={[
            { value: 'efectivo', label: 'Efectivo' },
            { value: 'transferencia', label: 'Transferencia' },
            { value: 'qr', label: 'QR' },
            { value: 'tarjeta', label: 'Tarjeta' }
          ]}
        />

        {/* Botones */}
        <div className="flex gap-3 pt-3 border-t border-stone-200/50">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl font-medium transition-all text-sm transform active:scale-95 disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-cyan1-600 hover:bg-cyan1-700 text-white rounded-xl font-medium transition-all shadow-md text-sm transform active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <span>Confirmar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default PagoEntregaModal