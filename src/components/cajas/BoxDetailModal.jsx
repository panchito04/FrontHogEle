// src/components/cajas/BoxDetailModal.jsx
import React from 'react'
import Modal from '../common/Modal'
import { formatCurrency } from '../../utils/formatters'

const BoxDetailModal = ({ isOpen, onClose, selectedBox }) => {
  if (!isOpen || !selectedBox) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Caja ${selectedBox.codigo}`}
      subtitle={selectedBox.descripcion || 'Lote de importación registrado'}
      maxWidth="max-w-4xl"
      theme="default"
    >
      <div className="p-5 sm:p-6 space-y-6">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#FAF8F5] border border-stone-200/60 rounded-2xl p-3.5 text-center">
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider font-sans-premium mb-1">Total</p>
            <p className="text-xl sm:text-2xl font-bold text-stone-900 font-sans-premium">{selectedBox.total_productos}</p>
          </div>
          <div className="bg-[#FAF8F5] border border-stone-200/60 rounded-2xl p-3.5 text-center">
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider font-sans-premium mb-1">Disponibles</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 font-sans-premium">{selectedBox.productos_disponibles}</p>
          </div>
          <div className="bg-[#FAF8F5] border border-stone-200/60 rounded-2xl p-3.5 text-center">
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider font-sans-premium mb-1">Vendidos</p>
            <p className="text-xl sm:text-2xl font-bold text-[#d97c75] font-sans-premium">{selectedBox.productos_vendidos}</p>
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-[#FAF8F5]/80 border border-stone-200/50 rounded-2xl p-4.5 grid grid-cols-2 gap-4 text-xs sm:text-sm font-sans-premium">
          <div>
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-0.5">Fecha de Llegada</p>
            <p className="font-semibold text-stone-950">{new Date(selectedBox.fecha_llegada).toLocaleDateString('es-ES')}</p>
          </div>
          {selectedBox.proveedor && (
            <div>
              <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-0.5">Proveedor</p>
              <p className="font-semibold text-stone-950 truncate">{selectedBox.proveedor}</p>
            </div>
          )}
          {selectedBox.costo_total && (
            <div>
              <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-0.5">Inversión Total</p>
              <p className="font-semibold text-stone-955">{formatCurrency(parseFloat(selectedBox.costo_total))}</p>
            </div>
          )}
          <div>
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-0.5">Estado del Lote</p>
            <p className="font-semibold text-stone-950 capitalize">
              {selectedBox.estado === 'completada' ? 'Completada' :
               selectedBox.estado === 'archivada' ? 'Archivada' :
               'En Proceso'}
            </p>
          </div>
        </div>

        {/* Observations */}
        {selectedBox.observaciones && (
          <div className="bg-[#423a23]/5 border border-[#cca64c]/20 rounded-2xl p-4.5">
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5 font-sans-premium">Observaciones de Aduana / Notas</p>
            <p className="text-xs sm:text-sm text-stone-700 font-sans-premium font-light leading-relaxed">{selectedBox.observaciones}</p>
          </div>
        )}

        {/* Products list */}
        <div>
          <h4 className="font-serif-editorial text-lg text-stone-900 mb-4 tracking-wide border-b border-stone-200/50 pb-2">
            Productos en esta Caja ({selectedBox.productos?.length || 0})
          </h4>

          {selectedBox.productos && selectedBox.productos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-80 overflow-y-auto pr-1">
              {selectedBox.productos.map((producto) => (
                <div 
                  key={producto.id_producto}
                  className="bg-white border border-stone-200/60 rounded-xl p-3 shadow-inner flex flex-col justify-between"
                >
                  <div>
                    {producto.imagen_url && (
                      <img 
                        src={producto.imagen_url} 
                        alt={producto.nombre}
                        className="w-full h-24 object-cover rounded-lg mb-2.5 border border-stone-100"
                      />
                    )}
                    <h5 className="font-semibold text-stone-900 text-xs mb-1 line-clamp-2 font-sans-premium">
                      {producto.nombre}
                    </h5>
                  </div>
                  
                  <div className="pt-2 border-t border-stone-100/60 flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-stone-900 font-sans-premium">
                      {formatCurrency(producto.precio)}
                    </span>
                    {producto.vendido ? (
                      <span className="text-[9px] bg-[#402422] text-[#d97c75] border border-[#d97c75]/15 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                        Vendido
                      </span>
                    ) : (
                      <span className="text-[9px] bg-[#234c48] text-[#35c3a8] border border-[#35c3a8]/15 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider animate-pulse">
                        Disponible
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-[#FAF8F5] border border-dashed border-stone-200/80 rounded-2xl">
              <svg className="w-12 h-12 text-stone-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414" />
              </svg>
              <p className="text-stone-900 font-medium text-sm font-sans-premium">Esta caja no tiene productos asignados</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-stone-200/50 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl font-medium transition-all text-sm transform active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>Cerrar</span>
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default BoxDetailModal