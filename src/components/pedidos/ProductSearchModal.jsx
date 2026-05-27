// components/pedidos/ProductSearchModal.jsx - CORREGIDO A DISEÑO PREMIUM
import { useState, useEffect, useRef } from 'react'
import { formatCurrency } from '../../utils/formatters'

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

    console.log('Producto seleccionado para agregar:', {
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
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-3 sm:p-4 transition-opacity duration-300">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-stone-200/80 animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan1-600 to-cyan1-700 p-5 text-white shadow-sm flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-serif-editorial text-xl sm:text-2xl font-normal leading-tight tracking-wide">Buscar Producto</h3>
            <p className="text-stone-200 mt-1 text-xs font-light tracking-wider">
              {productosFiltrados.length} productos disponibles
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl p-2 transition-all duration-200 flex-shrink-0 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filtros */}
        <div className="p-4 sm:p-5 bg-cream-luxury border-b border-stone-200/50 space-y-3 sm:space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar por nombre, categoría, caja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-cyan1-600/20 focus:border-cyan1-600 transition-all duration-300 text-sm font-sans-premium"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-1 focus:ring-cyan1-600/20 focus:border-cyan1-600 transition-all duration-300 text-sm font-sans-premium"
            >
              <option value="todas">Todas las categorías</option>
              {categoriasUnicas.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-cream-luxury">
          {productosFiltrados.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3 shadow-inner">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="font-serif-editorial text-stone-750 text-base">No se encontraron productos</p>
              <p className="text-stone-400 text-xs mt-1 max-w-xs font-light">
                {productosExcluidos.length > 0 
                  ? 'Todos los productos disponibles ya están agregados al formulario'
                  : 'Prueba redefiniendo tus parámetros de búsqueda'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productosFiltrados.map((producto) => (
                <div 
                  key={producto.id_producto}
                  className="bg-white rounded-2xl p-4 border border-stone-200/50 hover:border-cyan1-600/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    {/* Imagen del Producto */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#FAF8F5] border border-stone-200/50 flex-shrink-0 flex items-center justify-center">
                      {producto.imagen_url ? (
                        <img 
                          src={producto.imagen_url} 
                          alt={producto.nombre}
                          className="w-full h-full object-cover p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Información */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="space-y-1.5">
                        <h4 className="font-serif-editorial text-stone-900 text-sm sm:text-base leading-tight truncate">
                          {producto.nombre}
                        </h4>
                        {producto.descripcion && (
                          <p className="text-[10px] text-stone-400 font-sans-premium font-light truncate">
                            {producto.descripcion}
                          </p>
                        )}

                        {/* Tags / Pills */}
                        <div className="flex flex-wrap gap-1 items-center">
                          {producto.categoria?.nombre && (
                            <span className="bg-cyan1-600/5 text-cyan1-700 border border-cyan1-600/10 text-[9px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider font-sans-premium">
                              {producto.categoria.nombre}
                            </span>
                          )}
                          {producto.caja?.codigo && (
                            <span className="bg-stone-100 text-stone-600 border border-stone-200/40 text-[9px] px-2 py-0.5 rounded-full font-medium font-sans-premium">
                              {producto.caja.codigo}
                            </span>
                          )}
                          <span className="bg-stone-100 text-stone-600 border border-stone-200/40 text-[9px] px-2 py-0.5 rounded-full font-medium font-sans-premium">
                            {producto.cantidad} pzs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Campo de precio y botón de agregar */}
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-stone-100">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <span className="text-stone-400 text-xs">Bs.</span>
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
                        className="w-full pl-8 pr-2 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-cyan1-600/20 focus:border-cyan1-600 transition-all duration-300 h-9 font-sans-premium"
                      />
                    </div>

                    <button
                      onClick={() => handleSelect(producto)}
                      className="w-full px-3 py-1.5 bg-cyan1-600 hover:bg-cyan1-700 text-white rounded-xl font-semibold transition-all text-xs flex items-center justify-center gap-1.5 h-9 shadow-sm active:scale-[0.98]"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Agregar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200/50 bg-[#FAF8F5] rounded-b-2xl">
          <p className="text-xs text-stone-500 text-center font-sans-premium font-light tracking-wide">
            Puedes modificar el precio sugerido en la casilla antes de añadir la pieza
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductSearchModal