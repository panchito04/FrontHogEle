// src/components/cajas/BoxCard.jsx
import React from 'react'
import { formatCurrency } from '../../utils/formatters'

const BoxCard = ({ caja, onViewDetail, onEdit, onDelete }) => {
  const getEstadoBadge = (estado) => {
    const states = {
      'en_proceso': 'bg-[#423a23] text-[#cca64c] border-[#cca64c]/20',
      'completada': 'bg-[#234c48] text-[#35c3a8] border-[#35c3a8]/20',
      'archivada': 'bg-stone-800 text-stone-400 border-stone-700'
    }
    return states[estado] || states['en_proceso']
  }

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-stone-200/70 overflow-hidden transition-all duration-300 transform active:scale-[0.98] group flex flex-col justify-between"
    >
      <div className="p-5 sm:p-6 space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-serif-editorial text-xl font-normal text-stone-900 group-hover:text-cyan1-600 transition-colors leading-tight">
              {caja.codigo?.toLowerCase().startsWith('caja') ? caja.codigo : `Caja ${caja.codigo}`}
            </h3>
            <p className="text-[11px] text-stone-400 font-sans-premium font-light tracking-wide mt-1 truncate">
              {caja.descripcion || 'Sin descripción asignada'}
            </p>
          </div>
          
          <span className={`text-[9px] font-bold px-2 py-1 rounded-lg border uppercase tracking-wider font-sans-premium ${getEstadoBadge(caja.estado)}`}>
            {caja.estado === 'completada' ? 'Completada' :
             caja.estado === 'archivada' ? 'Archivada' :
             'En Proceso'}
          </span>
        </div>

        {/* Small stats segment */}
        <div className="grid grid-cols-2 gap-3 pt-2.5">
          <div className="bg-[#FAF8F5] border border-stone-200/50 rounded-xl p-2.5">
            <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider font-sans-premium">Productos</p>
            <p className="text-base font-bold text-stone-900 font-sans-premium mt-0.5">{caja.total_productos || 0}</p>
          </div>
          
          <div className="bg-[#FAF8F5] border border-stone-200/50 rounded-xl p-2.5">
            <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider font-sans-premium">Costo Total</p>
            <p className="text-base font-bold text-stone-900 font-sans-premium mt-0.5">
              {caja.costo_total ? formatCurrency(parseFloat(caja.costo_total)) : 'Bs. 0.00'}
            </p>
          </div>
        </div>

        {/* Metadata info */}
        <div className="space-y-2 pt-2 text-xs font-sans-premium text-stone-500 font-light border-t border-stone-100">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Ingreso: <span className="font-medium text-stone-700">{new Date(caja.fecha_llegada).toLocaleDateString('es-ES')}</span></span>
          </div>

          {caja.proveedor && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="truncate">Proveedor: <span className="font-semibold text-stone-700">{caja.proveedor}</span></span>
            </div>
          )}
        </div>
      </div>

      {/* Actions footer */}
      <div className="px-5 sm:px-6 pb-5 pt-0">
        <div className="flex gap-2 border-t border-stone-200/40 pt-4">
          <button
            onClick={() => onViewDetail(caja)}
            className="flex-1 px-3 py-2 bg-white hover:bg-stone-50 text-cyan1-600 border border-stone-200 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 text-xs active:scale-95"
          >
            <span>Ver Lote</span>
          </button>
          
          <button
            onClick={() => onEdit(caja)}
            className="px-3 py-2 bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 rounded-xl font-medium transition-all flex items-center justify-center text-xs active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(caja.id_caja)}
            className="px-3 py-2 bg-white hover:bg-red-50 text-red-600 border border-stone-200 hover:border-red-200 rounded-xl font-medium transition-all flex items-center justify-center text-xs active:scale-95"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default BoxCard