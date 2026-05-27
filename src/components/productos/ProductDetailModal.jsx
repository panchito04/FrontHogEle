// src/components/productos/ProductDetailModal.jsx
import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import { formatCurrency } from '../../utils/formatters'

export default function ProductDetailModal({ isOpen, onClose, producto }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setImageError(false)
      setImageLoading(true)
    }
  }, [isOpen])

  if (!isOpen || !producto) return null

  const isVendido = producto.vendido

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={producto.nombre}
      subtitle={`Código de Registro: #${producto.id_producto}`}
      maxWidth="max-w-4xl"
      theme={isVendido ? 'danger' : 'success'}
    >
      <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Image visual panel */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-[#FAF8F5] rounded-2xl overflow-hidden border border-stone-200/60 shadow-sm flex items-center justify-center">
              {producto.imagen_url && !imageError ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-50">
                      <div className="w-8 h-8 border-2 border-cyan1-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img 
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className={`w-full h-full object-contain p-2 transition-opacity duration-300 ${
                      imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageError(true)
                      setImageLoading(false)
                    }}
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-4">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 mb-2 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-sans-premium font-light tracking-wide text-center">Sin imagen disponible</span>
                </div>
              )}
              
              {/* Matte badge overlay */}
              <div className="absolute top-4 right-4">
                {isVendido ? (
                  <span className="bg-[#402422] text-[#d97c75] border border-[#d97c75]/25 px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold tracking-wider uppercase font-sans-premium shadow-sm">
                    Vendido
                  </span>
                ) : (
                  <span className="bg-[#234c48] text-[#35c3a8] border border-[#35c3a8]/25 px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold tracking-wider uppercase font-sans-premium shadow-sm">
                    Disponible
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Product metadata specs */}
          <div className="space-y-4 sm:space-y-5">
            {/* Category Label */}
            <div>
              <span className="inline-block px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-cyan1-600/5 text-cyan1-700 border border-cyan1-600/10 font-sans-premium uppercase tracking-wider">
                {producto.categoria?.nombre || 'General'}
              </span>
            </div>

            {/* Description */}
            <div className="bg-[#FAF8F5] border border-stone-200/50 rounded-2xl p-4 shadow-sm">
              <h4 className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5 font-sans-premium">
                Descripción del Lote
              </h4>
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-sans-premium font-light">
                {producto.descripcion || 'Este lote de piezas exclusivas no posee una descripción asignada.'}
              </p>
            </div>

            {/* Location / Box */}
            {producto.caja && (
              <div className="bg-[#FAF8F5] border border-stone-200/50 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-0.5 font-sans-premium">Ubicación física</p>
                  <p className="text-base sm:text-lg font-black text-stone-900 font-sans-premium">Caja {producto.caja.codigo}</p>
                </div>
                <div className="w-9 h-9 bg-cyan1-600/5 border border-cyan1-600/10 text-cyan1-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            )}

            {/* Price & Stock info boxes */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-[#FAF8F5] border border-stone-200/60 rounded-2xl p-3 sm:p-4 shadow-sm">
                <p className="text-[9px] sm:text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1 font-sans-premium">Precio unitario</p>
                <p className="text-xl sm:text-2xl font-bold text-stone-900 font-sans-premium">
                  {formatCurrency(producto.precio)}
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-stone-200/60 rounded-2xl p-3 sm:p-4 shadow-sm">
                <p className="text-[9px] sm:text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1 font-sans-premium">Disponibles</p>
                <p className="text-xl sm:text-2xl font-bold text-stone-900 font-sans-premium">
                  {producto.cantidad_disponible || 0} <span className="text-xs sm:text-sm font-normal text-stone-400">/ {producto.cantidad || 0}</span>
                </p>
              </div>
            </div>

            {/* Metadata and Log audit */}
            <div className="grid grid-cols-2 gap-4 border-t border-stone-200/50 pt-4 mt-1 text-xs">
              <div className="flex flex-col">
                <span className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider font-sans-premium">Fecha ingreso</span>
                <span className="font-semibold text-stone-700 font-sans-premium mt-0.5">
                  {new Date(producto.fecha_creacion).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>

              {producto.usuario && (
                <div className="flex flex-col">
                  <span className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider font-sans-premium">Registrado por</span>
                  <span className="font-bold text-cyan1-700 font-sans-premium mt-0.5 truncate">
                    {producto.usuario.nombre}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-stone-200/50 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl font-medium transition-all text-sm transform active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Cerrar Detalles</span>
          </button>
        </div>
      </div>
    </Modal>
  )
}