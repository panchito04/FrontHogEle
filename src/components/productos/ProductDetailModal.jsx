// src/components/productos/ProductDetailModal.jsx
import { useState, useEffect } from 'react'

export default function ProductDetailModal({ isOpen, onClose, producto }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setImageError(false)
      setImageLoading(true)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !producto) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-cyan1-600 to-ocean1-600 text-white px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Detalles del Producto</h2>
              <p className="text-sm text-white text-opacity-90">ID: #{producto.id_producto}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Imagen */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg">
                {producto.imagen_url && !imageError ? (
                  <>
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-cyan1-200 border-t-cyan1-600 rounded-full animate-spin"></div>
                      </div>
                    )}
                    <img 
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      className={`w-full h-full object-contain transition-opacity duration-300 ${
                        imageLoading ? 'opacity-0' : 'opacity-100'
                      }`}
                      onLoad={() => setImageLoading(false)}
                      onError={() => {
                        setImageError(true)
                        setImageLoading(false)
                      }}
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-24 h-24 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium">Sin imagen</p>
                  </div>
                )}
                
                {/* Badge de estado en la imagen */}
                <div className="absolute top-4 right-4">
                  {producto.vendido ? (
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      🔴 VENDIDO
                    </span>
                  ) : (
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 animate-pulse">
                      ✅ DISPONIBLE
                    </span>
                  )}
                </div>
              </div>

              {/* Zoom hint */}
              {producto.imagen_url && !imageError && (
                <p className="text-xs text-gray-500 text-center italic flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  Click derecho → Abrir en nueva pestaña para ver en tamaño completo
                </p>
              )}
            </div>

            {/* Información */}
            <div className="space-y-6">
              {/* Nombre y Categoría */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  {producto.nombre}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-full bg-purple-100 text-purple-800">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {producto.categoria?.nombre || 'Sin categoría'}
                  </span>
                </div>
              </div>

              {/* Descripción */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan1-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Descripción
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {producto.descripcion || 'Sin descripción disponible'}
                </p>
              </div>

              {/* Caja */}
              {producto.caja && (
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <div className="bg-white bg-opacity-25 p-2.5 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium opacity-90">Ubicación - Caja</p>
                        <p className="text-xl font-black">{producto.caja.codigo}</p>
                      </div>
                    </div>
                    <svg className="w-8 h-8 opacity-75" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Precio y Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-green-700">Precio</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    Bs. {producto.precio?.toFixed(2)}
                  </p>
                </div>

                <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-sm font-semibold text-cyan-700">Stock</span>
                  </div>
                  <p className="text-3xl font-bold text-cyan-600">
                    {producto.cantidad_disponible || 0}<span className="text-xl text-cyan-400">/{producto.cantidad || 0}</span>
                  </p>
                  <p className="text-xs text-cyan-600 mt-1">
                    {producto.cantidad_disponible > 0 ? 'Disponible' : 'Agotado'}
                  </p>
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">Creado</p>
                    <p className="font-semibold">
                      {new Date(producto.fecha_creacion).toLocaleDateString('es-BO', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {producto.fecha_actualizacion && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Actualizado</p>
                      <p className="font-semibold">
                        {new Date(producto.fecha_actualizacion).toLocaleDateString('es-BO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer con botón de cerrar */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-cyan1-600 to-ocean1-600 text-white rounded-xl font-semibold hover:from-cyan1-700 hover:to-ocean1-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cerrar
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}