// src/components/productos/ProductCard.jsx

import React, { useState, useEffect, useRef } from 'react'

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
    // No abrir el modal si se clickeó un botón
    if (e.target.closest('button')) {
      return
    }
    onViewDetail?.(producto)
  }

  return (
    <div 
      ref={cardRef}
      onClick={handleCardClick}
      className={`bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 sm:transform sm:hover:-translate-y-2 border-2 cursor-pointer ${
        producto.vendido ? 'border-red-200' : 'border-green-200'
      }`}
    >
      {/* Imagen del producto con lazy loading */}
      <div className="relative aspect-[3/2] sm:aspect-square bg-gradient-to-br from-cyan1-500 to-ocean1-500 overflow-hidden">
        {isVisible && producto.imagen_url ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img 
              src={producto.imagen_url} 
              alt={producto.nombre}
              loading="lazy"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : !producto.imagen_url ? (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        ) : null}
        
        {/* Badge de estado */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
          {producto.vendido ? (
            <span className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-xs font-bold shadow-lg flex items-center gap-0.5 sm:gap-1">
              <span className="hidden sm:inline">🔴</span>
              <span>VENDIDO</span>
            </span>
          ) : (
            <span className="bg-green-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-xs font-bold shadow-lg flex items-center gap-0.5 sm:gap-1 animate-pulse">
              <span className="hidden sm:inline">✅</span>
              <span>DISPONIBLE</span>
            </span>
          )}
        </div>

        {/* ID del producto */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
          <span className="bg-black bg-opacity-50 backdrop-blur-sm text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[9px] sm:text-xs font-semibold">
            #{producto.id_producto}
          </span>
        </div>

        {/* Indicador de click para ver más */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 backdrop-blur-sm text-white px-2 py-1 rounded text-[9px] sm:text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="hidden sm:inline">Ver más</span>
        </div>
      </div>

      {/* Contenido del producto */}
      <div className="p-2.5 sm:p-4">
        {/* Caja */}
        {producto.caja && (
          <div className="mb-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg p-2 sm:p-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                <div className="bg-white bg-opacity-25 p-1 sm:p-1.5 rounded flex-shrink-0">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] sm:text-[10px] text-white opacity-90 font-semibold leading-tight">Caja</p>
                  <p className="text-xs sm:text-sm font-black text-white truncate leading-tight">{producto.caja.codigo}</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-25 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded flex-shrink-0">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Título */}
        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
          {producto.nombre}
        </h3>

        {/* Categoría */}
        <span className="inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-xs font-semibold rounded-full bg-purple-100 text-ocean1-800 mb-2 sm:mb-3">
          {producto.categoria?.nombre || 'Sin categoría'}
        </span>

        {/* Descripción - Solo visible en tablet+ */}
        <p className="hidden sm:block text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
          {producto.descripcion || 'Sin descripción disponible'}
        </p>

        {/* Precio y Stock */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-gray-200">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-[8px] sm:text-[9px] text-gray-500 leading-tight">Precio</p>
              <span className="text-sm sm:text-lg font-bold text-green-600 leading-tight">
                Bs. {producto.precio?.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-[8px] sm:text-[9px] text-gray-500 leading-tight">Stock</p>
            <p className="text-sm sm:text-base font-bold text-cyan1-600 leading-tight">
              {producto.cantidad_disponible || 0}/{producto.cantidad || 0}
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-1.5 sm:gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation()
              onEdit(producto)
            }}
            disabled={producto.vendido}
            className={`flex-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-1 ${
              producto.vendido 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan1-600 to-ocean1-600 text-white hover:from-cyan1-700 hover:to-ocean1-700 shadow-md hover:shadow-lg active:scale-95'
            }`}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="text-[10px] sm:text-xs">Editar</span>
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation()
              onDelete(producto.id_producto)
            }}
            disabled={producto.vendido}
            className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
              producto.vendido 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg active:scale-95'
            }`}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Mensaje de vendido */}
        {producto.vendido && (
          <p className="text-center text-[9px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2 italic">
            🔒 Producto vendido
          </p>
        )}

        {/* Hint para ver detalles */}
        <p className="text-center text-[9px] sm:text-xs text-cyan1-600 mt-2 font-medium flex items-center justify-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Toca para ver detalles
        </p>
      </div>
    </div>
  )
}

export default React.memo(ProductCard)