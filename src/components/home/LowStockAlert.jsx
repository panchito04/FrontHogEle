// src/components/home/LowStockAlert.jsx
import { useNavigate } from 'react-router-dom'

function LowStockAlert({ productosBajoStock }) {
  const navigate = useNavigate()

  const handleProductClick = (productoId) => {
    navigate(`/productos`)
  }

  return (
    <div className="bg-white/95 rounded-2xl shadow-sm p-5 sm:p-6 border border-stone-200/80 animate-slide-up">
      <div className="flex items-center justify-between mb-5 border-b border-stone-200/60 pb-4">
        <h3 className="font-serif-editorial text-base sm:text-lg font-normal text-stone-900 flex items-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#402422]/5 rounded-xl border border-[#d97c75]/10 flex items-center justify-center mr-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#d97c75]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          Alertas de Stock
        </h3>
        
        <span className="text-[10px] font-semibold text-[#d97c75] bg-[#402422]/5 border border-[#d97c75]/15 px-3 py-1 rounded-full uppercase tracking-wider font-sans-premium flex items-center">
          <span className="w-1.5 h-1.5 bg-[#d97c75] rounded-full mr-2 animate-pulse"></span>
          Bajo Stock
        </span>
      </div>

      {productosBajoStock && productosBajoStock.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {productosBajoStock.map((producto, index) => (
            <div
              key={index}
              onClick={() => handleProductClick(producto.id_producto)}
              className="flex items-center justify-between p-3 sm:p-4 bg-[#FAF8F5] hover:bg-[#FAF8F5]/40 border border-stone-200/50 hover:border-cyan1-600/20 rounded-xl transition-all duration-300 transform active:scale-[0.99] cursor-pointer group"
            >
              <div className="flex items-center flex-1 min-w-0 pr-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white border border-stone-200/80 rounded-xl flex items-center justify-center mr-3 shadow-sm group-hover:border-cyan1-600/30 transition-colors">
                  {producto.stock === 0 ? (
                    <svg className="w-4 h-4 text-[#d97c75]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-[#cca64c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm font-semibold text-stone-900 block truncate group-hover:text-cyan1-600 transition-colors font-sans-premium">
                    {producto.nombre}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-stone-500 font-sans-premium font-light tracking-wide">
                    {producto.stock === 0 ? 'Sin existencias' : `Quedan ${producto.stock} unidades`}
                  </span>
                </div>
              </div>
              
              <span className={`ml-2 px-2.5 py-1 text-[9px] sm:text-[10px] font-bold rounded-lg uppercase tracking-wider font-sans-premium flex-shrink-0 ${
                producto.stock === 0 
                  ? 'bg-[#402422] text-[#d97c75] border border-[#d97c75]/20' 
                  : 'bg-[#423a23] text-[#cca64c] border border-[#cca64c]/20'
              }`}>
                {producto.stock === 0 ? 'VENDIDO' : 'BAJO'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-[#FAF8F5]/80 rounded-2xl border border-dashed border-stone-200/80">
          <div className="bg-[#234c48]/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#35c3a8]/10 shadow-sm">
            <svg className="w-8 h-8 text-[#35c3a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-stone-900 font-serif-editorial text-lg tracking-wide">Inventario Solido</p>
          <p className="text-stone-500 text-xs mt-1 font-sans-premium font-light">Todos los productos cuentan con stock disponible</p>
        </div>
      )}
    </div>
  )
}

export default LowStockAlert