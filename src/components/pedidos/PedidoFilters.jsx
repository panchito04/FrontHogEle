// components/pedidos/PedidoFilters.jsx - CON FILTROS AVANZADOS
export default function PedidoFilters({ 
  searchTerm, setSearchTerm, 
  filterEstado, setFilterEstado,
  filterCategoria, setFilterCategoria,
  filterCaja, setFilterCaja,
  filterFechaInicio, setFilterFechaInicio,
  filterFechaFin, setFilterFechaFin,
  categorias, cajas, activeTab 
}) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-2 sm:p-3 lg:p-6 mb-3 sm:mb-4 lg:mb-6">
      <div className="space-y-2 sm:space-y-3">
        {/* Buscador */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
              <svg className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por ID, observaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-7 sm:pl-9 lg:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 lg:py-2.5 text-[10px] sm:text-xs lg:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan1-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Grid de filtros */}
        <div className={`grid gap-1.5 sm:gap-2 lg:gap-3 ${activeTab === 'vendidos' ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {/* Filtro Estado (solo en vendidos) */}
          {activeTab === 'vendidos' && (
            <div>
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="w-full px-1.5 sm:px-2 lg:px-3 py-1.5 sm:py-2 lg:py-2.5 text-[10px] sm:text-xs lg:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan1-600"
              >
                <option value="todos">Todos estados</option>
                <option value="pagado">Pagado</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>
          )}

          {/* Filtro Categoría */}
          <div>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="w-full px-1.5 sm:px-2 lg:px-3 py-1.5 sm:py-2 lg:py-2.5 text-[10px] sm:text-xs lg:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan1-600 truncate"
            >
              <option value="todas">Todas categorías</option>
              {categorias.map(cat => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Caja */}
          <div>
            <select
              value={filterCaja}
              onChange={(e) => setFilterCaja(e.target.value)}
              className="w-full px-1.5 sm:px-2 lg:px-3 py-1.5 sm:py-2 lg:py-2.5 text-[10px] sm:text-xs lg:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan1-600 truncate"
            >
              <option value="todas">Todas cajas</option>
              {cajas.map(caja => (
                <option key={caja.id_caja} value={caja.id_caja}>
                  {caja.codigo}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtros de fecha - 2 columnas */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-3">
          <div>
            <label className="block text-[9px] sm:text-[10px] lg:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">
              Desde
            </label>
            <input
              type="date"
              value={filterFechaInicio}
              onChange={(e) => setFilterFechaInicio(e.target.value)}
              className="w-full px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2 text-[10px] sm:text-xs lg:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan1-600"
            />
          </div>
          <div>
            <label className="block text-[9px] sm:text-[10px] lg:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">
              Hasta
            </label>
            <input
              type="date"
              value={filterFechaFin}
              onChange={(e) => setFilterFechaFin(e.target.value)}
              className="w-full px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2 text-[10px] sm:text-xs lg:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan1-600"
            />
          </div>
        </div>

        {/* Botón limpiar filtros */}
        {(searchTerm || filterEstado !== 'todos' || 
          filterCategoria !== 'todas' || filterCaja !== 'todas' || 
          filterFechaInicio || filterFechaFin) && (
          <button
            onClick={() => {
              setSearchTerm('')
              setFilterEstado('todos')
              setFilterCategoria('todas')
              setFilterCaja('todas')
              setFilterFechaInicio('')
              setFilterFechaFin('')
            }}
            className="w-full px-3 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-[10px] sm:text-xs lg:text-sm font-medium flex items-center justify-center gap-1.5"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  )
}