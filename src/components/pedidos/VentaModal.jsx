// components/pedidos/VentaModal.jsx
import { useState, useEffect } from 'react'
import { saveFormData, loadFormData, clearFormData } from '../../utils/formPersistence'
import ProductSearchModal from './ProductSearchModal'
import Modal from '../common/Modal'
import FormField from '../common/FormField'

function VentaModal({ isOpen, onClose, onSubmit, productos, user }) {
  const FORM_KEY = 'venta_form_data'
  
  const [formData, setFormData] = useState({
    observaciones: '',
    detalles: [],
    pago: {
      monto: '',
      metodo: '',
      comprobante_url: ''
    }
  })
  
  const [showProductSearch, setShowProductSearch] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false) // Control de carga inicial
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. Cargar datos guardados al montar
  useEffect(() => {
    if (isOpen) {
      const savedData = loadFormData(FORM_KEY)
      
      const hasData = savedData && (
        savedData.detalles?.length > 0 || 
        savedData.pago?.monto ||
        savedData.observaciones
      )

      if (hasData) {
        const userWantsToRecover = window.confirm(
          'Tienes una venta sin terminar guardada automáticamente.\n\n¿Deseas recuperar los datos de la venta anterior?'
        )

        if (userWantsToRecover) {
          setFormData(savedData)
        } else {
          clearFormData(FORM_KEY)
          setFormData({ 
            observaciones: '', 
            detalles: [],
            pago: { monto: '', metodo: '', comprobante_url: '' }
          })
        }
      }
      setIsLoaded(true)
    }
  }, [isOpen])

  // 2. Guardar datos automáticamente
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
      alert('Este producto ya está en la venta')
      return
    }

    const nuevoDetalle = {
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre,
      cantidad: 1,
      precio_unitario: precioPersonalizado || producto.precio,
      cantidad_piezas: producto.cantidad
    }

    console.log('Detalle de venta creado:', nuevoDetalle)

    const nuevosDetalles = [...formData.detalles, nuevoDetalle]
    const nuevoTotal = nuevosDetalles.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0)

    setFormData({
      ...formData,
      detalles: nuevosDetalles,
      pago: {
        ...formData.pago,
        monto: nuevoTotal.toFixed(2)
      }
    })
    setShowProductSearch(false)
  }

  const removeDetalle = (index) => {
    const nuevosDetalles = formData.detalles.filter((_, i) => i !== index)
    const nuevoTotal = nuevosDetalles.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0)

    setFormData({
      ...formData,
      detalles: nuevosDetalles,
      pago: {
        ...formData.pago,
        monto: nuevoTotal.toFixed(2)
      }
    })
  }

  const calcularTotal = () => {
    return formData.detalles.reduce((sum, det) => 
      sum + (det.cantidad * det.precio_unitario), 0
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    
    if (formData.detalles.length === 0) {
      alert('Debes agregar al menos un "Producto" a la venta.')
      return
    }

    if (!formData.pago.metodo) {
      alert('Debes seleccionar un "Método de Pago".')
      return
    }
    
    if (!formData.pago.monto || parseFloat(formData.pago.monto) < 0) {
        alert('El "Monto" es obligatorio y debe ser válido.')
        return
    }

    const total = calcularTotal()
    const montoPago = parseFloat(formData.pago.monto)

    if (Math.abs(montoPago - total) > 0.01) {
      if (!window.confirm(`El monto de pago (Bs. ${montoPago.toFixed(2)}) no coincide con el total calculado (Bs. ${total.toFixed(2)}).\n\n¿Estás seguro de continuar con esta diferencia?`)) {
        return
      }
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        ...formData,
        id_usuario: user?.id_usuario || null,
        es_venta_directa: true,
        pago: {
          monto: parseFloat(formData.pago.monto),
          metodo: formData.pago.metodo,
          comprobante_url: formData.pago.comprobante_url || null
        }
      })
      
      clearFormData(FORM_KEY)
      setFormData({ 
        observaciones: '', 
        detalles: [],
        pago: { monto: '', metodo: '', comprobante_url: '' }
      })
    } catch (error) {
      console.error('Error al registrar venta:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    const hasData = formData.detalles.length > 0 || formData.pago.monto
    
    if (hasData) {
      if (!window.confirm('¿Deseas mantener este borrador guardado para más tarde?')) {
        clearFormData(FORM_KEY)
        setFormData({ 
            observaciones: '', 
            detalles: [],
            pago: { monto: '', metodo: '', comprobante_url: '' }
        })
      } else {
        saveFormData(FORM_KEY, formData)
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
        title="Venta Directa"
        subtitle="Registra una venta con pago inmediato"
        maxWidth="max-w-3xl"
        theme="success"
      >
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Registro de Venta - Sin campos de cliente */}

          {/* Observaciones */}
          <FormField
            label="Observaciones"
            id="observaciones"
            type="textarea"
            rows={2}
            value={formData.observaciones}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            placeholder="Ej: Entregar envuelto para regalo..."
          />

          {/* Productos */}
          <div className="border-t border-stone-200/50 pt-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-stone-700 tracking-wider uppercase font-sans-premium">
                Productos de la Venta <span className="text-red-500 font-bold">*</span>
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

          {/* Información de Pago */}
          {formData.detalles.length > 0 && (
            <div className="border-t border-stone-200/50 pt-5 space-y-4">
              <h4 className="text-sm font-semibold text-stone-700 tracking-wider uppercase font-sans-premium flex items-center gap-1.5">
                <svg className="w-5 h-5 text-cyan1-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Información de Pago
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FormField
                    label="Monto a Cobrar (Bs.)"
                    id="monto"
                    type="number"
                    required
                    value={formData.pago.monto}
                    onChange={(e) => setFormData({
                      ...formData,
                      pago: { ...formData.pago, monto: e.target.value }
                    })}
                    placeholder="0.00"
                  />
                  <p className="text-[10px] text-stone-400 mt-1 font-light tracking-wide">
                    Sugerido: Bs. {calcularTotal().toFixed(2)}
                  </p>
                </div>

                <FormField
                  label="Método de Pago"
                  id="metodo"
                  type="select"
                  required
                  value={formData.pago.metodo}
                  onChange={(e) => setFormData({
                    ...formData,
                    pago: { ...formData.pago, metodo: e.target.value }
                  })}
                  placeholder="Selecciona método..."
                  options={[
                    { value: 'efectivo', label: 'Efectivo' },
                    { value: 'transferencia', label: 'Transferencia' },
                    { value: 'qr', label: 'QR' },
                    { value: 'tarjeta', label: 'Tarjeta' }
                  ]}
                />
              </div>

              <FormField
                label="URL del Comprobante (Opcional)"
                id="comprobante_url"
                type="url"
                value={formData.pago.comprobante_url}
                onChange={(e) => setFormData({
                  ...formData,
                  pago: { ...formData.pago, comprobante_url: e.target.value }
                })}
                placeholder="https://ejemplo.com/comprobante.jpg"
              />
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-stone-200/50">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl font-medium transition-all text-sm transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-cyan1-600 hover:bg-cyan1-700 text-white rounded-xl font-semibold transition-all shadow-md text-sm transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <span>Registrar Venta</span>
              )}
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

export default VentaModal