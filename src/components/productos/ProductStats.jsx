// src/components/productos/ProductStats.jsx
import React, { useMemo } from 'react'

const ProductStats = ({ filteredProductos, filterCaja, filterCategoria }) => {
  const stats = useMemo(() => {
    const disponibles = filteredProductos.filter(p => p.disponible && !p.vendido).length
    const vendidos = filteredProductos.filter(p => p.vendido).length
    const total = filteredProductos.length

    return { disponibles, vendidos, total }
  }, [filteredProductos])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 transform active:scale-[0.98] flex items-center justify-between group">
        <div>
          <span className="text-[10px] font-semibold text-stone-500 tracking-wider uppercase font-sans-premium">
            Total Productos
          </span>
          <h3 className="font-serif-editorial text-3xl sm:text-3.5xl font-normal text-stone-900 tracking-wide mt-1.5 mb-0.5">
            {stats.total}
          </h3>
          <p className="text-[11px] text-stone-400 font-sans-premium font-light tracking-wide">
            {filterCaja !== 'todas' || filterCategoria !== 'todas' ? 'Filtrados' : 'Piezas únicas'}
          </p>
        </div>
        <div className="p-3.5 rounded-xl border bg-cyan1-600/5 text-cyan1-600 border-cyan1-600/10 flex items-center justify-center transition-transform group-hover:scale-105">
          <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      </div>

      <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 transform active:scale-[0.98] flex items-center justify-between group">
        <div>
          <span className="text-[10px] font-semibold text-stone-500 tracking-wider uppercase font-sans-premium">
            Disponibles
          </span>
          <h3 className="font-serif-editorial text-3xl sm:text-3.5xl font-normal text-stone-900 tracking-wide mt-1.5 mb-0.5">
            {stats.disponibles}
          </h3>
          <p className="text-[11px] text-stone-400 font-sans-premium font-light tracking-wide">
            En catálogo activo
          </p>
        </div>
        <div className="p-3.5 rounded-xl border bg-emerald-600/5 text-emerald-700 border-emerald-600/10 flex items-center justify-center transition-transform group-hover:scale-105">
          <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 transform active:scale-[0.98] flex items-center justify-between col-span-2 lg:col-span-1 group">
        <div>
          <span className="text-[10px] font-semibold text-stone-500 tracking-wider uppercase font-sans-premium">
            Vendidos
          </span>
          <h3 className="font-serif-editorial text-3xl sm:text-3.5xl font-normal text-stone-900 tracking-wide mt-1.5 mb-0.5">
            {stats.vendidos}
          </h3>
          <p className="text-[11px] text-stone-400 font-sans-premium font-light tracking-wide">
            Operaciones cerradas
          </p>
        </div>
        <div className="p-3.5 rounded-xl border bg-[#402422]/5 text-[#d97c75] border-[#d97c75]/10 flex items-center justify-center transition-transform group-hover:scale-105">
          <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ProductStats)