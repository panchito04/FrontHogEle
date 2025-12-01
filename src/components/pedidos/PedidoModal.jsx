// components/pedidos/PedidoModal.jsx - VERIFICAR handleProductSelect
import { useState, useEffect } from 'react'
import { saveFormData, loadFormData, clearFormData } from '../../utils/formPersistence'
import ProductSearchModal from './ProductSearchModal'
import ClientSearchModal from './ClientSearchModal'

function PedidoModal({ isOpen, onClose, onSubmit, clientes, productos }) {
  const FORM_KEY = 'pedido_form_data'
  
  const [formData, setFormData] = useState({
    id_cliente: '',
    observaciones: '',
    detalles: []
  })
  
  const [showProductSearch, setShowProductSearch] = useState(false)
  const [showClientSearch, setShowClientSearch] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const savedData = loadFormData(FORM_KEY)
      const hasData = savedData && (savedData.id_cliente || savedData.detalles?.length > 0 || savedData.observaciones)

      if (hasData) {
        const userWantsToRecover = window.confirm(
          '💾 Tienes un pedido sin terminar guardado automáticamente.\n\n¿Deseas recuperar los datos del pedido anterior?'
        )

        if (userWantsToRecover) {
          setFormData(savedData)
        } else {
          clearFormData(FORM_KEY)
          setFormData({ id_cliente: '', observaciones: '', detalles: [] })
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

  const handleClientSelect = (cliente) => {
    setFormData({ ...formData, id_cliente: cliente.id_cliente })
    setShowClientSearch(false)
  }

  const handleProductSelect = (producto, precioPersonalizado) => {
    // ✅ VERIFICAR QUE PRODUCTO TENGA id_producto
    if (!producto.id_producto) {
      console.error('❌ ERROR: Producto sin id_producto', producto)
      alert('❌ Error: El producto no tiene un ID válido')
      return
    }

    if (formData.detalles.some(d => d.id_producto === producto.id_producto)) {
      alert('⚠️ Este producto ya está en la reserva')
      return
    }

    // ✅ CREAR DETALLE CON TODA LA INFO NECESARIA
    const nuevoDetalle = {
      id_producto: producto.id_producto, // ✅ CRÍTICO
      nombre_producto: producto.nombre,
      cantidad: 1,
      precio_unitario: precioPersonalizado || producto.precio,
      cantidad_piezas: producto.cantidad
    }

    console.log('✅ Detalle creado:', nuevoDetalle)

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
    
    if (!formData.id_cliente) {
      alert('⚠️ El campo "Cliente" es obligatorio.\nPor favor selecciona uno.')
      return
    }

    if (formData.detalles.length === 0) {
      alert('⚠️ El pedido debe tener al menos un "Producto".\nPor favor agrega productos a la reserva.')
      return
    }

    // ✅ VERIFICAR QUE TODOS LOS DETALLES TENGAN id_producto
    const detallesSinId = formData.detalles.filter(d => !d.id_producto)
    if (detallesSinId.length > 0) {
      console.error('❌ Detalles sin id_producto:', detallesSinId)
      alert('❌ Error: Algunos productos no tienen ID. Por favor vuelve a agregarlos.')
      return
    }

    console.log('📤 Enviando pedido:', formData)
    onSubmit(formData)
    
    clearFormData(FORM_KEY)
    setFormData({ id_cliente: '', observaciones: '', detalles: [] })
  }

  const handleClose = () => {
    if (formData.id_cliente || formData.detalles.length > 0) {
      if (!window.confirm('¿Deseas mantener este borrador guardado para más tarde?')) {
        clearFormData(FORM_KEY)
        setFormData({ id_cliente: '', observaciones: '', detalles: [] })
      }
    }
    onClose()
  }

  const getClienteNombre = (id) => {
    const cliente = clientes.find(c => c.id_cliente === id)
    return cliente?.nombre || 'Seleccionar cliente'
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan1-600 to-ocean1-600 p-6 text-white sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">📋 Nueva Reserva</h3>
                <p className="text-cyan1-100 mt-1">Crea un pedido pendiente de pago</p>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Selector de Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente <span className="text-red-500 font-bold">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowClientSearch(true)}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors flex items-center justify-between bg-white ${
                    !formData.id_cliente ? 'border-red-300 hover:border-red-400' : 'border-gray-300 hover:border-cyan1-500'
                }`}
              >
                <span className={formData.id_cliente ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                  {getClienteNombre(formData.id_cliente)}
                </span>
                <svg className="w-5 h-5 text-cyan1-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {!formData.id_cliente && (
                  <p className="text-xs text-red-400 mt-1">Campo obligatorio</p>
              )}
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                rows="2"
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan1-600 focus:border-transparent"
                placeholder="Ej: Cliente prefiere entrega por la tarde"
              />
            </div>

            {/* Productos */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">
                  Productos de la Reserva <span className="text-red-500">*</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setShowProductSearch(true)}
                  className="bg-gradient-to-r from-cyan1-600 to-ocean1-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-cyan1-700 hover:to-ocean1-700 transition-all flex items-center space-x-2 shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Buscar Producto</span>
                </button>
              </div>

              {formData.detalles.length === 0 ? (
                <div className="text-center py-8 bg-red-50 rounded-lg border-2 border-dashed border-red-200">
                  <svg className="w-12 h-12 text-red-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-red-500 font-medium">No hay productos agregados</p>
                  <p className="text-sm text-red-400 mt-1">Es obligatorio agregar al menos un producto</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.detalles.map((detalle, index) => (
                    <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{detalle.nombre_producto}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            1 pack ({detalle.cantidad_piezas} piezas) × Bs. {detalle.precio_unitario.toFixed(2)}
                          </p>
                          {/* ✅ DEBUG: Mostrar ID */}
                          <p className="text-xs text-gray-400 mt-1">ID: {detalle.id_producto}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xl font-bold text-cyan1-600">
                            Bs. {detalle.precio_unitario.toFixed(2)}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeDetalle(index)}
                            className="text-red-600 hover:text-red-800 mt-2 text-sm font-medium flex items-center justify-end gap-1 ml-auto"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-green-600">
                        Bs. {calcularTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan1-600 to-ocean1-600 text-white rounded-lg font-semibold hover:from-cyan1-700 hover:to-ocean1-700 transition-all shadow-lg flex justify-center items-center gap-2"
              >
                <span>Crear Reserva</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {showClientSearch && (
        <ClientSearchModal
          isOpen={showClientSearch}
          onClose={() => setShowClientSearch(false)}
          onSelect={handleClientSelect}
          clientes={clientes}
        />
      )}

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