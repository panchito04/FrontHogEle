// src/components/productos/ProductFilters.jsx
import React from 'react'

const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  filterEstado,
  setFilterEstado,
  filterCategoria,
  setFilterCategoria,
  filterCaja,
  setFilterCaja,
  categorias,
  cajas
}) => {
  return (
    <div className="bg-white/95 rounded-2xl shadow-sm p-4 sm:p-5 mb-6 space-y-4 border border-stone-200/80">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-cyan1-600/20 focus:border-cyan1-600 transition-all duration-300 text-sm sm:text-[15px] font-sans-premium"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-cyan1-600/20 focus:border-cyan1-600 transition-all duration-300 text-sm font-sans-premium"
        >
          <option value="todos">Todos los estados</option>
          <option value="disponibles">Disponibles</option>
          <option value="vendidos">Vendidos</option>
        </select>

        <select
          value={filterCategoria}
          onChange={(e) => setFilterCategoria(e.target.value)}
          className="px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-cyan1-600/20 focus:border-cyan1-600 transition-all duration-300 text-sm font-sans-premium"
        >
          <option value="todas">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <select
          value={filterCaja}
          onChange={(e) => setFilterCaja(e.target.value)}
          className="px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-cyan1-600/20 focus:border-cyan1-600 transition-all duration-300 text-sm font-sans-premium"
        >
          <option value="todas">Todas las cajas</option>
          {cajas.map((caja) => (
            <option key={caja.id_caja} value={caja.id_caja}>
              {caja.codigo}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default ProductFilters