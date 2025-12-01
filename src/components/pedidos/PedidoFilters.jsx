// components/pedidos/PedidoFilters.jsx - OPTIMIZADO MÓVIL
export default function PedidoFilters({ 
  searchTerm, setSearchTerm, 
  filterEstado, setFilterEstado,
  filterCliente, setFilterCliente,
  clientes, activeTab 
}) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
      <div className="grid grid-cols-1 gap-2 sm:gap-3 lg:gap-4">
        {/* Buscador */}
        <div className="lg:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por ID, cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan1-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Grid de filtros */}
        <div className={`grid gap-2 sm:gap-3 ${activeTab === 'vendidos' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {/* Filtro Estado (solo en vendidos) */}
          {activeTab === 'vendidos' && (
            <div>
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan1-600"
              >
                <option value="todos">Todos estados</option>
                <option value="pagado">Pagado</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>
          )}

          {/* Filtro Cliente */}
          <div>
            <select
              value={filterCliente}
              onChange={(e) => setFilterCliente(e.target.value)}
              className="w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan1-600"
            >
              <option value="todos">Todos clientes</option>
              {clientes.map(cliente => (
                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}