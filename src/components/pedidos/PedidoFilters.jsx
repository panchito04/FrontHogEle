// ========================================
// components/pedidos/PedidoFilters.jsx
// ========================================
export default function PedidoFilters({ 
  searchTerm, setSearchTerm, 
  filterEstado, setFilterEstado,
  filterCliente, setFilterCliente,
  clientes, activeTab 
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Buscador */}
        <div className="md:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por ID, cliente u observaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan1-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtro Estado (solo en vendidos) */}
        {activeTab === 'vendidos' && (
          <div>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan1-600"
            >
              <option value="todos">Todos los estados</option>
              <option value="pagado">Pagado</option>
              <option value="entregado">Entregado</option>
            </select>
          </div>
        )}

        {/* Filtro Cliente */}
        <div className={activeTab === 'reservados' ? 'md:col-span-1' : ''}>
          <select
            value={filterCliente}
            onChange={(e) => setFilterCliente(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan1-600"
          >
            <option value="todos">Todos los clientes</option>
            {clientes.map(cliente => (
              <option key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
