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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-br from-cyan1-500 to-cyan1-600 rounded-2xl p-5 text-white shadow-xl transform hover:scale-105 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-xs font-medium uppercase tracking-wide mb-1">Total Productos</p>
            <h3 className="text-3xl font-bold">{stats.total}</h3>
            <p className="text-indigo-200 text-xs mt-1">
              {filterCaja !== 'todas' || filterCategoria !== 'todas' ? 'Filtrados' : 'Piezas únicas'}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-xl transform hover:scale-105 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-xs font-medium uppercase tracking-wide mb-1">Disponibles</p>
            <h3 className="text-3xl font-bold">{stats.disponibles}</h3>
            <p className="text-green-200 text-xs mt-1">Para venta</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-5 text-white shadow-xl transform hover:scale-105 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-xs font-medium uppercase tracking-wide mb-1">Vendidos</p>
            <h3 className="text-3xl font-bold">{stats.vendidos}</h3>
            <p className="text-orange-200 text-xs mt-1">Completados</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ProductStats)