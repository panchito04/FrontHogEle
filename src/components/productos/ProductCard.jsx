// src/components/productos/ProductCard.jsx
import React, { useState, useEffect, useRef } from 'react'
import { formatCurrency } from '../../utils/formatters'

const ProductCard = ({ producto, onEdit, onDelete, onViewDetail }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '50px' }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleCardClick = (e) => {
    if (e.target.closest('button')) {
      return
    }
    onViewDetail?.(producto)
  }

  const isVendido = producto.vendido

  return (
    <div 
      ref={cardRef}
      onClick={handleCardClick}
      className={`bg-white rounded-2xl shadow-sm hover:shadow-md border border-stone-200/70 overflow-hidden transition-all duration-300 transform active:scale-[0.98] cursor-pointer group flex flex-col justify-between`}
    >
      <div>
        {/* Lazy Loaded Image Container */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-cyan1-600/5 to-cyan1-700/10 overflow-hidden border-b border-stone-200/50">
          {isVisible && producto.imagen_url ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-50">
                  <div className="w-6 h-6 border-2 border-cyan1-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img 
                src={producto.imagen_url} 
                alt={producto.nombre}
                loading="lazy"
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-cyan1-600/5">
              <svg className="w-10 h-10 text-cyan1-600/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
          
          {/* Status badge */}
          <div className="absolute top-2.5 right-2.5">
            {isVendido ? (
              <span className="bg-[#402422] text-[#d97c75] border border-[#d97c75]/20 px-2 py-1 rounded-lg text-[9px] font-bold tracking-wider uppercase font-sans-premium">
                Vendido
              </span>
            ) : (
              <span className="bg-[#234c48] text-[#35c3a8] border border-[#35c3a8]/20 px-2 py-1 rounded-lg text-[9px] font-bold tracking-wider uppercase font-sans-premium animate-pulse">
                Disponible
              </span>
            )}
          </div>

          {/* ID Badge */}
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-stone-900/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[9px] font-semibold tracking-wider">
              #{producto.id_producto}
            </span>
          </div>
        </div>

        {/* Content - Added more horizontal padding */}
        <div className="px-3.5 sm:px-4 py-3 space-y-2.5">
          
          {/* Category & Box Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="inline-block px-2 py-0.5 text-[9px] font-semibold rounded-full bg-cyan1-600/5 text-cyan1-700 border border-cyan1-600/10 font-sans-premium uppercase tracking-wider">
              {producto.categoria?.nombre || 'General'}
            </span>
            
            {producto.caja && (
              <span className="text-[10px] text-stone-500 font-sans-premium font-light tracking-wide flex items-center gap-1">
                <svg className="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="font-semibold text-stone-700">{producto.caja.codigo}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <h3 className="font-serif-editorial text-sm sm:text-base font-normal text-stone-900 line-clamp-2 leading-snug group-hover:text-cyan1-600 transition-colors">
              {producto.nombre}
            </h3>
          </div>

          {/* Price & Stocks */}
          <div className="flex items-end justify-between pt-2 border-t border-stone-200/50">
            <div>
              <p className="text-[9px] text-stone-400 font-sans-premium uppercase tracking-wider mb-0.5">Precio</p>
              <span className="text-sm sm:text-base font-bold text-stone-900 font-sans-premium">
                {formatCurrency(producto.precio)}
              </span>
            </div>
            
            <div className="text-right">
              <p className="text-[9px] text-stone-400 font-sans-premium uppercase tracking-wider mb-0.5">Stock</p>
              <p className="text-xs sm:text-sm font-semibold text-stone-700 font-sans-premium">
                {producto.cantidad_disponible || 0} / {producto.cantidad || 0}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Action panel at bottom */}
      <div className="px-3.5 sm:px-4 pb-3">
        <div className="flex gap-2 border-t border-stone-200/40 pt-2.5">
          <button 
            onClick={(e) => {
              e.stopPropagation()
              onEdit(producto)
            }}
            disabled={isVendido}
            className="flex-1 px-3 py-2 bg-white hover:bg-stone-50 text-cyan1-600 border border-stone-200 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 text-xs active:scale-95 disabled:opacity-40"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>Editar</span>
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation()
              onDelete(producto.id_producto)
            }}
            disabled={isVendido}
            className="px-3 py-2 bg-white hover:bg-red-50 text-red-600 border border-stone-200 hover:border-red-200 rounded-xl font-medium transition-all flex items-center justify-center text-xs active:scale-95 disabled:opacity-40"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        {isVendido ? (
          <p className="text-center text-[9px] text-[#d97c75] mt-2 italic font-sans-premium">
            Producto vendido
          </p>
        ) : (
          <p className="text-center text-[9px] text-stone-400 mt-1.5 font-light tracking-wide font-sans-premium flex items-center justify-center gap-0.5">
            Toca para ver detalles
          </p>
        )}
      </div>
    </div>
  )
}

export default React.memo(ProductCard)