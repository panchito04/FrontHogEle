// components/pedidos/ProductSearchModal.jsx - CORREGIDO
import { useState, useEffect, useRef } from 'react'

function ProductSearchModal({ isOpen, onClose, onSelect, productos, productosExcluidos = [] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('todas')
  const [precioPersonalizado, setPrecioPersonalizado] = useState({})
  const searchInputRef = useRef(null)

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100)
    }
  }, [isOpen])

  // Filtrar solo productos disponibles
  const productosDisponibles = productos.filter(producto => {
    // Excluir ya seleccionados
    if (productosExcluidos.includes(producto.id_producto)) return false
    
    // Solo productos completamente disponibles
    if (producto.cantidad_disponible !== producto.cantidad) return false
    
    return producto.disponible
  })

  // Aplicar filtros de búsqueda
  const productosFiltrados = productosDisponibles.filter(producto => {
    const matchesSearch = 
      producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.categoria?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.caja?.codigo?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategoria = filterCategoria === 'todas' || 
      producto.id_categoria?.toString() === filterCategoria

    return matchesSearch && matchesCategoria
  })

  // Obtener categorías únicas
  const categoriasUnicas = [...new Set(
    productosDisponibles
      .filter(p => p.categoria?.nombre)
      .map(p => ({ id: p.id_categoria, nombre: p.categoria.nombre }))
  )].filter((cat, index, self) => 
    index === self.findIndex(c => c.id === cat.id)
  )

  const handleSelect = (producto) => {
    const precio = precioPersonalizado[producto.id_producto] 
      ? parseFloat(precioPersonalizado[producto.id_producto])
      : producto.precio

    // LOG PARA DEBUGGING
    console.log('Producto a enviar:', {
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      precio: precio,
      cantidad_piezas: producto.cantidad
    })

    onSelect(producto, precio)
    setPrecioPersonalizado({})
    setSearchTerm('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">Buscar Producto</h3>
              <p className="text-indigo-100 mt-1 text-sm">
                {productosFiltrados.length} productos disponibles
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="p-4 sm:p-6 border-b space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar por nombre, categoría, caja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-base"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 text-sm"
            >
              <option value="todas">Todas las categorías</option>
              {categoriasUnicas.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {productosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500 text-lg font-semibold">No se encontraron productos</p>
              <p className="text-gray-400 text-sm mt-2">
                {productosExcluidos.length > 0 
                  ? 'Todos los productos disponibles ya están agregados'
                  : 'Intenta con otros filtros de búsqueda'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {productosFiltrados.map((producto) => (
                <div 
                  key={producto.id_producto}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-3 sm:p-4 border-2 border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex gap-3 sm:gap-4 h-full">
                    
                    {/* Imagen */}
                    <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 self-start border border-gray-200">
                      {producto.imagen_url ? (
                        <img 
                          src={producto.imagen_url} 
                          alt={producto.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 leading-tight">
                            {producto.nombre}
                          </h4>
                          {producto.descripcion && (
                            <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                              {producto.descripcion}
                            </p>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {producto.categoria?.nombre && (
                            <span className="bg-purple-100 text-purple-700 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium">
                              {producto.categoria.nombre}
                            </span>
                          )}
                          {producto.caja?.codigo && (
                            <span className="bg-blue-100 text-blue-700 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium">
                              {producto.caja.codigo}
                            </span>
                          )}
                          <span className="bg-green-100 text-green-700 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium">
                            {producto.cantidad} pzs
                          </span>
                        </div>
                      </div>

                      {/* Precio y Botón */}
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-xs font-medium">Bs.</span>
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            placeholder={producto.precio.toFixed(2)}
                            value={precioPersonalizado[producto.id_producto] || ''}
                            onChange={(e) => setPrecioPersonalizado({
                              ...precioPersonalizado,
                              [producto.id_producto]: e.target.value
                            })}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-9"
                          />
                        </div>

                        <button
                          onClick={() => handleSelect(producto)}
                          className="w-full px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 h-9"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Agregar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t bg-gray-50 rounded-b-2xl">
          <p className="text-xs sm:text-sm text-gray-600 text-center">
            Puedes modificar el precio antes de agregar el producto
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductSearchModal