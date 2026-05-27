// components/pedidos/PedidoModal.jsx
import { useState, useEffect } from 'react'
import { saveFormData, loadFormData, clearFormData } from '../../utils/formPersistence'
import ProductSearchModal from './ProductSearchModal'
import Modal from '../common/Modal'
import FormField from '../common/FormField'

function PedidoModal({ isOpen, onClose, onSubmit, productos, user }) {
  const FORM_KEY = 'pedido_form_data'
  
  const [formData, setFormData] = useState({
    observaciones: '',
    detalles: []
  })
  
  const [showProductSearch, setShowProductSearch] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const savedData = loadFormData(FORM_KEY)
      const hasData = savedData && (savedData.detalles?.length > 0 || savedData.observaciones)

      if (hasData) {
        const userWantsToRecover = window.confirm(
          'Tienes un pedido sin terminar guardado automáticamente.\n\n¿Deseas recuperar los datos del pedido anterior?'
        )

        if (userWantsToRecover) {
          setFormData(savedData)
        } else {
          clearFormData(FORM_KEY)
          setFormData({ observaciones: '', detalles: [] })
        }
      }
      setIsLoaded(true)
    }
  }, [isOpen])

  useEffect(() => {
    if (isLoaded && isOpen) {
      saveFormData(FORM_KEY, formData)
    }
  }, [formData, isLoaded, isOpen])

  const handleProductSelect = (producto, precioPersonalizado) => {
    if (!producto.id_producto) {
      console.error('ERROR: Producto sin id_producto', producto)
      alert('Error: El producto no tiene un ID válido')
      return
    }

    if (formData.detalles.some(d => d.id_producto === producto.id_producto)) {
      alert('Este producto ya está en la reserva')
      return
    }

    const nuevoDetalle = {
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre,
      highlight: true,
      cantidad: 1,
      precio_unitario: precioPersonalizado || producto.precio,
      cantidad_piezas: producto.cantidad
    }

    console.log('Detalle creado:', nuevoDetalle)

    setFormData({
      ...formData,
      detalles: [...formData.detalles, nuevoDetalle]
    })
    setShowProductSearch(false)
  }

  const removeDetalle = (index) => {
    setFormData({
      ...formData,
      detalles: formData.detalles.filter((_, i) => i !== index)
    })
  }

  const calcularTotal = () => {
    return formData.detalles.reduce((sum, det) => 
      sum + (det.cantidad * det.precio_unitario), 0
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (formData.detalles.length === 0) {
      alert('El pedido debe tener al menos un "Producto".\nPor favor agrega productos a la reserva.')
      return
    }

    const detallesSinId = formData.detalles.filter(d => !d.id_producto)
    if (detallesSinId.length > 0) {
      console.error('Detalles sin id_producto:', detallesSinId)
      alert('Error: Algunos productos no tienen ID. Por favor vuelve a agregarlos.')
      return
    }

    console.log('Enviando pedido:', formData)
    onSubmit({
      ...formData,
      id_usuario: user?.id_usuario || null
    })
    
    clearFormData(FORM_KEY)
    setFormData({ observaciones: '', detalles: [] })
  }

  const handleClose = () => {
    if (formData.detalles.length > 0) {
      if (!window.confirm('¿Deseas mantener este borrador guardado para más tarde?')) {
        clearFormData(FORM_KEY)
        setFormData({ observaciones: '', detalles: [] })
      }
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Nueva Reserva"
        subtitle="Registra un pedido pendiente de pago"
        maxWidth="max-w-3xl"
        theme="info"
      >
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Registro de Reserva - Sin campos de cliente */}

          {/* Observaciones */}
          <FormField
            label="Observaciones"
            id="observaciones"
            type="textarea"
            rows={2}
            value={formData.observaciones}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            placeholder="Ej: Cliente retira el fin de semana..."
          />

          {/* Productos */}
          <div className="border-t border-stone-200/50 pt-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-stone-700 tracking-wider uppercase font-sans-premium">
                Productos de la Reserva <span className="text-red-500 font-bold">*</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowProductSearch(true)}
                className="bg-cyan1-600 text-white px-3 py-2 rounded-xl text-xs font-medium hover:bg-cyan1-700 transition-all flex items-center gap-1.5 shadow-sm transform active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Buscar Producto</span>
              </button>
            </div>

            {formData.detalles.length === 0 ? (
              <div className="text-center py-8 bg-[#402422]/5 rounded-xl border border-dashed border-[#d97c75]/20">
                <svg className="w-10 h-10 text-[#d97c75] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-stone-900 font-medium text-sm">No hay productos agregados</p>
                <p className="text-xs text-stone-500 mt-0.5">Es obligatorio agregar al menos un producto</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.detalles.map((detalle, index) => (
                  <div key={index} className="bg-white border border-stone-200/80 p-4 rounded-xl shadow-sm transition-all duration-300">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-900 text-[15px] truncate font-sans-premium">{detalle.nombre_producto}</p>
                        <p className="text-xs text-stone-500 mt-1 font-light tracking-wide">
                          1 pack ({detalle.cantidad_piezas} piezas) × Bs. {detalle.precio_unitario.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-base font-bold text-stone-900 font-sans-premium">
                          Bs. {detalle.precio_unitario.toFixed(2)}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeDetalle(index)}
                          className="text-red-600 hover:text-red-700 mt-2 text-xs font-medium flex items-center justify-end gap-1 ml-auto transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Quitar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-cyan1-600/5 p-4 rounded-xl border border-cyan1-600/10 shadow-inner mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-stone-700 tracking-wider uppercase font-sans-premium">Total de Venta:</span>
                    <span className="text-xl font-bold text-cyan1-700 font-serif-editorial">
                      Bs. {calcularTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-stone-200/50">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl font-medium transition-all text-sm transform active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-cyan1-600 hover:bg-cyan1-700 text-white rounded-xl font-medium transition-all shadow-md text-sm transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>Crear Reserva</span>
            </button>
          </div>
        </form>
      </Modal>

      {showProductSearch && (
        <ProductSearchModal
          isOpen={showProductSearch}
          onClose={() => setShowProductSearch(false)}
          onSelect={handleProductSelect}
          productos={productos}
          productosExcluidos={formData.detalles.map(d => d.id_producto)}
        />
      )}
    </>
  )
}

export default PedidoModal