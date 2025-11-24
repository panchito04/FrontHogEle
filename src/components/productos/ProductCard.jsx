// src/components/productos/ProductCard.jsx
import React from 'react'

const ProductCard = ({ producto, onEdit, onDelete }) => {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
        producto.vendido ? 'border-red-200' : 'border-green-200'
      }`}
    >
      <div className="relative h-52 bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden">
        {producto.imagen_url ? (
          <img 
            src={producto.imagen_url} 
            alt={producto.nombre} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-20 h-20 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          {producto.vendido ? (
            <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center">
              🔴 VENDIDO
            </span>
          ) : (
            <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center animate-pulse">
              ✅ DISPONIBLE
            </span>
          )}
        </div>

        <div className="absolute top-3 left-3">
          <span className="bg-black bg-opacity-50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-semibold">
            ID: {producto.id_producto}
          </span>
        </div>
        
        {producto.caja && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-cyan-500 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-lg">
              📦 {producto.caja.codigo}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 min-h-[3.5rem]">
            {producto.nombre}
          </h3>
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
            {producto.categoria?.nombre || 'Sin categoría'}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
          {producto.descripcion || 'Sin descripción disponible'}
        </p>

        <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-100">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-2xl font-bold text-green-600">
              Bs. {producto.precio?.toFixed(2)}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Stock</p>
            <p className="text-lg font-bold text-indigo-600">
              {producto.cantidad_disponible || 0}/{producto.cantidad || 0}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(producto)}
            disabled={producto.vendido}
            className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
              producto.vendido 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="text-sm">Editar</span>
          </button>
          <button 
            onClick={() => onDelete(producto.id_producto)}
            disabled={producto.vendido}
            className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
              producto.vendido 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {producto.vendido && (
          <p className="text-center text-xs text-gray-500 mt-3 italic">
            🔒 Este producto ya fue vendido
          </p>
        )}
      </div>
    </div>
  )
}

export default ProductCard