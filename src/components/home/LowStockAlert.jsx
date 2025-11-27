// src/components/home/LowStockAlert.jsx
import { useNavigate } from 'react-router-dom'

function LowStockAlert({ productosBajoStock }) {
  const navigate = useNavigate()

  const handleProductClick = (productoId) => {
    navigate(`/productos/${productoId}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          Productos Vendidos
        </h3>
        <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full font-medium flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
          Únicos
        </span>
      </div>
      {productosBajoStock && productosBajoStock.length > 0 ? (
        <div className="space-y-3">
          {productosBajoStock.map((producto, index) => (
            <div
              key={index}
              onClick={() => handleProductClick(producto.id_producto)}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-l-4 border-red-500 hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center flex-1 min-w-0">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white text-xl mr-3 shadow-md">
                  {producto.stock === 0 ? '⚠️' : '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-800 block truncate">{producto.nombre}</span>
                  <span className="text-xs text-gray-600">
                    {producto.stock === 0 ? 'Ya vendido' : 'Producto único disponible'}
                  </span>
                </div>
              </div>
              <span className={`ml-3 px-4 py-2 text-xs font-bold rounded-lg shadow-md ${
                producto.stock === 0 
                  ? 'bg-red-600 text-white' 
                  : 'bg-yellow-500 text-white'
              }`}>
                {producto.stock === 0 ? 'VENDIDO' : '1 DISPONIBLE'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-green-600 font-semibold text-lg">¡Todo perfecto!</p>
          <p className="text-gray-500 text-sm mt-2">Todos los productos están disponibles</p>
        </div>
      )}
    </div>
  )
}

export default LowStockAlert