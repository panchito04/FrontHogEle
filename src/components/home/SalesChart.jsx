// src/components/home/SalesChart.jsx
import { formatCurrency, formatMes } from '../../utils/formatters'

function SalesChart({ ventasPorMes }) {
  const getMaxVenta = () => Math.max(...ventasPorMes.map(v => v.total), 1)

  return (
    <div className="bg-white/95 rounded-2xl shadow-sm p-5 sm:p-6 border border-stone-200/80 animate-slide-up">
      <div className="flex items-center justify-between mb-5 border-b border-stone-200/60 pb-4">
        <h3 className="font-serif-editorial text-base sm:text-lg font-normal text-stone-900 flex items-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-cyan1-600/5 rounded-xl border border-cyan1-600/10 flex items-center justify-center mr-3 text-cyan1-600">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          Ventas Mensuales
        </h3>
        
        <span className="text-[9px] sm:text-[10px] font-semibold text-stone-500 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-full uppercase tracking-wider font-sans-premium">
          Historico
        </span>
      </div>
      
      {ventasPorMes.length > 0 ? (
        <div className="space-y-3.5 sm:space-y-4.5">
          {ventasPorMes.map((venta, index) => (
            <div key={venta.mes} className="transition-all duration-300">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center min-w-0">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 bg-cyan1-600/5 border border-cyan1-600/15 rounded-lg flex items-center justify-center text-cyan1-600 text-[10px] sm:text-xs font-semibold mr-2.5 font-sans-premium flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-800 font-sans-premium truncate">{formatMes(venta.mes)}</span>
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-stone-900 font-sans-premium ml-2 flex-shrink-0">
                  {formatCurrency(venta.total)}
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5 sm:h-2 overflow-hidden border border-stone-200/40">
                <div
                  className="bg-gradient-to-r from-cyan1-600 to-ocean1-600 h-1.5 sm:h-2 rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${(venta.total / getMaxVenta()) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-[#FAF8F5]/80 rounded-2xl border border-dashed border-stone-200/80">
          <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-200">
            <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2" />
            </svg>
          </div>
          <p className="text-stone-900 font-serif-editorial text-lg tracking-wide">Sin Ventas Registradas</p>
          <p className="text-stone-400 text-xs mt-1 font-sans-premium font-light">El volumen de ingresos mensual aparecera aqui</p>
        </div>
      )}
    </div>
  )
}

export default SalesChart