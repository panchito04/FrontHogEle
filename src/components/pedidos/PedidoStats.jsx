// components/pedidos/PedidoStats.jsx
function PedidoStats({ pedidos, pedidosFiltrados, activeTab }) {
  const calcularTotalMonto = (pedidosArray) => {
    return pedidosArray.reduce((sum, pedido) => {
      const total = pedido.detalles?.reduce((s, d) => 
        s + (d.cantidad * d.precio_unitario), 0
      ) || 0
      return sum + total
    }, 0)
  }

  const reservados = pedidos.filter(p => p.estado === 'pendiente')
  const vendidos = pedidos.filter(p => p.estado === 'pagado' || p.estado === 'entregado')
  
  const montoReservado = calcularTotalMonto(reservados)
  const montoVendido = calcularTotalMonto(vendidos)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Reservados */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-yellow-700">Reservados</p>
            <p className="text-3xl font-bold text-yellow-900 mt-1">{reservados.length}</p>
            <p className="text-xs text-yellow-600 mt-1">
              Bs. {montoReservado.toFixed(2)}
            </p>
          </div>
          <div className="w-14 h-14 bg-yellow-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Total Vendidos */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-700">Vendidos</p>
            <p className="text-3xl font-bold text-green-900 mt-1">{vendidos.length}</p>
            <p className="text-xs text-green-600 mt-1">
              Bs. {montoVendido.toFixed(2)}
            </p>
          </div>
          <div className="w-14 h-14 bg-green-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Monto Total */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">Monto Total</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              Bs. {(montoReservado + montoVendido).toFixed(2)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {pedidos.length} pedidos
            </p>
          </div>
          <div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Resultados Filtrados */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-700">
              {activeTab === 'reservados' ? 'Reservas' : 'Ventas'} Mostradas
            </p>
            <p className="text-3xl font-bold text-purple-900 mt-1">
              {pedidosFiltrados.length}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              De {activeTab === 'reservados' ? reservados.length : vendidos.length} totales
            </p>
          </div>
          <div className="w-14 h-14 bg-purple-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PedidoStats