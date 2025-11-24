// src/components/cajas/BoxDetailModal.jsx
import React from 'react'

const BoxDetailModal = ({ isOpen, onClose, selectedBox }) => {
  if (!isOpen || !selectedBox) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-2">{selectedBox.codigo}</h3>
              <p className="text-cyan-100">{selectedBox.descripcion || 'Sin descripción'}</p>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-cyan-200 text-xs">Total Productos</p>
                  <p className="text-2xl font-bold">{selectedBox.total_productos}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-cyan-200 text-xs">Disponibles</p>
                  <p className="text-2xl font-bold text-green-300">{selectedBox.productos_disponibles}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-cyan-200 text-xs">Vendidos</p>
                  <p className="text-2xl font-bold text-red-300">{selectedBox.productos_vendidos}</p>
                </div>
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
        </div>
        
        <div className="p-6">
          <div className="bg-gray-50 rounded-xl p-4 mb-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 font-semibold mb-1">📅 Fecha de Llegada</p>
              <p className="text-gray-800">{new Date(selectedBox.fecha_llegada).toLocaleDateString()}</p>
            </div>
            {selectedBox.proveedor && (
              <div>
                <p className="text-gray-600 font-semibold mb-1">👤 Proveedor</p>
                <p className="text-gray-800">{selectedBox.proveedor}</p>
              </div>
            )}
            {selectedBox.costo_total && (
              <div>
                <p className="text-gray-600 font-semibold mb-1">💰 Inversión Total</p>
                <p className="text-gray-800">Bs. {parseFloat(selectedBox.costo_total).toFixed(2)}</p>
              </div>
            )}
            <div>
              <p className="text-gray-600 font-semibold mb-1">📊 Estado</p>
              <p className="text-gray-800">
                {selectedBox.estado === 'completada' ? '✓ Completada' :
                 selectedBox.estado === 'archivada' ? '📁 Archivada' :
                 '⏳ En Proceso'}
              </p>
            </div>
          </div>

          {selectedBox.observaciones && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-bold text-gray-700 mb-2">📝 Observaciones</p>
              <p className="text-sm text-gray-600">{selectedBox.observaciones}</p>
            </div>
          )}

          <h4 className="text-xl font-bold text-gray-800 mb-4">
            📦 Productos en esta Caja ({selectedBox.productos?.length || 0})
          </h4>

          {selectedBox.productos && selectedBox.productos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {selectedBox.productos.map((producto) => (
                <div 
                  key={producto.id_producto}
                  className={`bg-white border-2 rounded-xl p-3 hover:shadow-lg transition-all ${
                    producto.vendido ? 'border-red-200' : 'border-green-200'
                  }`}
                >
                  {producto.imagen_url && (
                    <img 
                      src={producto.imagen_url} 
                      alt={producto.nombre}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  <h5 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2">
                    {producto.nombre}
                  </h5>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-bold text-lg">
                      Bs. {parseFloat(producto.precio).toFixed(2)}
                    </span>
                    {producto.vendido ? (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">
                        VENDIDO
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-bold">
                        DISPONIBLE
                      </span>
                    )}
                  </div>
                  {producto.categoria && (
                    <p className="text-xs text-gray-500 mt-2">
                      🏷️ {producto.categoria.nombre}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Stock: {producto.cantidad_disponible || 0}/{producto.cantidad || 0}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500 font-semibold">Esta caja aún no tiene productos</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full mt-6 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default BoxDetailModal