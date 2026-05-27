// src/components/home/TopProducts.jsx
import { useNavigate } from 'react-router-dom'

function TopProducts({ topProductos }) {
  const navigate = useNavigate()

  const rankThemes = [
    { bg: 'bg-[#423a23] text-[#cca64c] border-[#cca64c]/20', label: '1' },
    { bg: 'bg-stone-200 text-stone-700 border-stone-300', label: '2' },
    { bg: 'bg-[#402422]/10 text-[#d97c75] border-[#d97c75]/20', label: '3' },
    { bg: 'bg-stone-100 text-stone-600 border-stone-200', label: '4' },
    { bg: 'bg-stone-100 text-stone-600 border-stone-200', label: '5' }
  ]

  const handleProductClick = () => {
    navigate(`/productos`)
  }

  return (
    <div className="bg-white/95 rounded-2xl shadow-sm p-5 sm:p-6 border border-stone-200/80 animate-slide-up">
      <div className="flex items-center justify-between mb-5 border-b border-stone-200/60 pb-4">
        <h3 className="font-serif-editorial text-base sm:text-lg font-normal text-stone-900 flex items-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-cyan1-600/5 rounded-xl border border-cyan1-600/10 flex items-center justify-center mr-3 text-cyan1-600">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          Mas Vendidos
        </h3>
        
        <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 border border-stone-200 px-3 py-1 rounded-full uppercase tracking-wider font-sans-premium">
          Top 5
        </span>
      </div>

      {topProductos && topProductos.length > 0 ? (
        <div className="space-y-2.5">
          {topProductos.map((producto, index) => {
            const currentRank = rankThemes[index] || rankThemes[4];
            return (
              <div
                key={index}
                onClick={handleProductClick}
                className="flex items-center justify-between p-3 sm:p-4 bg-[#FAF8F5] hover:bg-[#FAF8F5]/40 border border-stone-200/50 hover:border-cyan1-600/20 rounded-xl transition-all duration-300 transform active:scale-[0.99] cursor-pointer group"
              >
                <div className="flex items-center flex-1 min-w-0 pr-2">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 border rounded-xl flex items-center justify-center font-bold text-sm mr-3 shadow-sm transition-colors ${currentRank.bg}`}>
                    {currentRank.label}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-stone-900 block truncate group-hover:text-cyan1-600 transition-colors font-sans-premium">
                      {producto.nombre}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-stone-500 font-sans-premium font-light">Piezas vendidas</span>
                  </div>
                </div>

                <div className="text-right ml-3 flex-shrink-0">
                  <span className="text-sm sm:text-base font-bold text-stone-900 block font-sans-premium leading-none">
                    {producto.cantidad}
                  </span>
                  <span className="text-[9px] text-stone-400 font-sans-premium font-light uppercase tracking-wider">Unidades</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-10 bg-[#FAF8F5]/80 rounded-2xl border border-dashed border-stone-200/80">
          <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-200">
            <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          
          <p className="text-stone-900 font-serif-editorial text-lg tracking-wide">Sin Ventas</p>
          <p className="text-stone-400 text-xs mt-1 font-sans-premium font-light">Los productos con mayor rotacion se listaran aqui</p>
        </div>
      )}
    </div>
  )
}

export default TopProducts