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
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition duration-200 text-sm sm:text-base"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition duration-200 text-sm"
        >
          <option value="todos">📦 Todos los estados</option>
          <option value="disponibles">✅ Disponibles</option>
          <option value="vendidos">🔴 Vendidos</option>
        </select>

        <select
          value={filterCategoria}
          onChange={(e) => setFilterCategoria(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition duration-200 text-sm"
        >
          <option value="todas">🏷️ Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <select
          value={filterCaja}
          onChange={(e) => setFilterCaja(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition duration-200 text-sm"
        >
          <option value="todas">📦 Todas las cajas</option>
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