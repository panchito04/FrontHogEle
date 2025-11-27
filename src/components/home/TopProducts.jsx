// src/components/home/TopProducts.jsx
import { useNavigate } from 'react-router-dom'

function TopProducts({ topProductos }) {
  const navigate = useNavigate()

  const colors = [
    'from-yellow-400 to-yellow-500',
    'from-gray-400 to-gray-500',
    'from-orange-400 to-orange-500',
    'from-green-400 to-green-500',
    'from-blue-400 to-blue-500'
  ]
  
  const textColors = [
    'text-yellow-600',
    'text-gray-600',
    'text-orange-600',
    'text-green-600',
    'text-blue-600'
  ]

  const handleProductClick = (productoId) => {
    navigate(`/productos/${productoId}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          Productos Más Vendidos
        </h3>
        <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">Top 5</span>
      </div>
      {topProductos && topProductos.length > 0 ? (
        <div className="space-y-3">
          {topProductos.map((producto, index) => (
            <div
              key={index}
              onClick={() => handleProductClick(producto.id_producto)}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 border border-green-100 cursor-pointer"
            >
              <div className="flex items-center flex-1">
                <div className={`w-10 h-10 bg-gradient-to-br ${colors[index]} rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-md`}>
                  {index === 0 ? '🏆' : index + 1}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-800 block truncate">{producto.nombre}</span>
                  <span className="text-xs text-gray-600">Producto único vendido</span>
                </div>
              </div>
              <div className="text-right ml-3">
                <span className={`text-lg font-bold ${textColors[index]}`}>{producto.cantidad}</span>
                <span className="block text-xs text-gray-500">ventas</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No hay productos vendidos</p>
          <p className="text-gray-400 text-sm mt-1">Las ventas aparecerán aquí</p>
        </div>
      )}
    </div>
  )
}

export default TopProducts