// src/components/productos/ProductCardSkeleton.jsx

import React from 'react'

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 animate-pulse">
      {/* Imagen skeleton */}
      <div className="relative aspect-[3/2] sm:aspect-square bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
          <div className="bg-gray-300 h-6 w-20 rounded-full"></div>
        </div>
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
          <div className="bg-gray-300 h-5 w-10 rounded"></div>
        </div>
      </div>

      {/* Contenido skeleton */}
      <div className="p-2.5 sm:p-4">
        {/* Caja skeleton */}
        <div className="mb-2.5 bg-gray-200 rounded-lg h-12 sm:h-14"></div>

        {/* Título skeleton */}
        <div className="space-y-2 mb-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Categoría skeleton */}
        <div className="h-6 bg-gray-200 rounded-full w-24 mb-3"></div>

        {/* Precio y stock skeleton */}
        <div className="flex justify-between mb-3 pb-3 border-b border-gray-200">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Botones skeleton */}
        <div className="flex gap-1.5 sm:gap-2">
          <div className="flex-1 h-9 bg-gray-200 rounded-lg"></div>
          <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}

export default ProductCardSkeleton
