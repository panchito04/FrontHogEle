// src/components/home/SalesChart.jsx
import { formatCurrency, formatMes } from '../../utils/formatters'

function SalesChart({ ventasPorMes }) {
  const getMaxVenta = () => Math.max(...ventasPorMes.map(v => v.total), 1)

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan1-500 to-ocean1-500 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          Ventas Mensuales
        </h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Últimos 6 meses</span>
      </div>
      {ventasPorMes.length > 0 ? (
        <div className="space-y-4">
          {ventasPorMes.map((venta, index) => (
            <div key={venta.mes} className="transform hover:scale-102 transition-transform">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-br from-cyan1-500 to-ocean1-500 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-3">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">{formatMes(venta.mes)}</span>
                </div>
                <span className="text-sm font-bold text-cyan1-600 bg-indigo-50 px-3 py-1 rounded-lg">
                  {formatCurrency(venta.total)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan1-500 via-ocean1-500 to-pink-500 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${(venta.total / getMaxVenta()) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No hay datos de ventas</p>
          <p className="text-gray-400 text-sm mt-1">Las ventas aparecerán aquí</p>
        </div>
      )}
    </div>
  )
}

export default SalesChart