// src/components/productos/ProductModal.jsx - OPTIMIZADO PARA MÓVILES
import React, { useState, useEffect } from 'react'

const ProductModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingProduct, 
  categorias, 
  cajas,
  isUploading,
  onOpenCamera,
  onOpenCameraWithFile,
  onFormChange
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    id_categoria: '',
    id_caja: '',
    imagen_url: '',
    imagen_file: null,
    cantidad: 1
  })
  
  const [filePreview, setFilePreview] = useState(null)
  
  const isRealEdit = editingProduct && editingProduct.id_producto

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        ...editingProduct,
        imagen_file: editingProduct.imagen_file || null
      })
      setFilePreview(editingProduct.preview_url || editingProduct.imagen_url || null)
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        id_categoria: '',
        id_caja: '',
        imagen_url: '',
        imagen_file: null,
        cantidad: 1
      })
      setFilePreview(null)
    }
  }, [editingProduct, isOpen])
  
  useEffect(() => {
    if (isOpen && !isRealEdit && onFormChange) {
      const timeoutId = setTimeout(() => {
        onFormChange(formData)
      }, 500)
      
      return () => clearTimeout(timeoutId)
    }
  }, [formData, isOpen, isRealEdit, onFormChange])

  if (!isOpen) return null

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (file.size > 5 * 1024 * 1024) {
      alert('⚠️ La imagen no puede pesar más de 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('⚠️ Solo se permiten archivos de imagen')
      return
    }

    onOpenCameraWithFile(file, formData)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(e, formData)
  }

  const handleClose = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      id_categoria: '',
      id_caja: '',
      imagen_url: '',
      imagen_file: null,
      cantidad: 1
    })
    setFilePreview(null)
    onClose()
  }

  const removeImage = () => {
    setFilePreview(null)
    setFormData({ ...formData, imagen_file: null, imagen_url: '' })
  }

  const handleImageUrlChange = (url) => {
    if (url) setFilePreview(url)
    setFormData({ ...formData, imagen_url: url, imagen_file: null })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[96vh] sm:max-h-[92vh] flex flex-col my-2 sm:my-4">
        {/* HEADER - Fijo */}
        <div className="bg-gradient-to-r from-cyan1-600 via-ocean1-600 to-pink-600 p-3 sm:p-5 text-white rounded-t-2xl sm:rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-2xl font-bold truncate">
                {isRealEdit ? '✏️ Editar' : '✨ Nuevo'}
              </h3>
              <p className="text-indigo-100 text-xs sm:text-sm mt-0.5 sm:mt-1 hidden sm:block">
                {isRealEdit ? 'Modifica los datos del producto' : 'Cada producto es una pieza exclusiva'}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-1.5 sm:p-2 rounded-lg transition-all disabled:opacity-50 flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* CONTENIDO - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
              📝 Nombre *
            </label>
            <input
              type="text"
              required
              disabled={isUploading}
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan1-600 focus:border-transparent transition-all disabled:opacity-50"
              placeholder="Ej: Collar de Plata"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
              📄 Descripción
            </label>
            <textarea
              rows="2"
              disabled={isUploading}
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan1-600 focus:border-transparent transition-all resize-none disabled:opacity-50"
              placeholder="Características..."
            ></textarea>
          </div>

          {/* Precio, Cantidad, Categoría */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                💰 Precio (Bs.) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                disabled={isUploading}
                value={formData.precio}
                onChange={(e) => setFormData({...formData, precio: e.target.value})}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan1-600 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="0.00"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                📦 Cantidad *
              </label>
              <input
                type="number"
                min="1"
                required
                disabled={isUploading}
                value={formData.cantidad}
                onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan1-600 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="1"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                🏷️ Categoría *
              </label>
              <select
                required
                disabled={isUploading}
                value={formData.id_categoria}
                onChange={(e) => setFormData({...formData, id_categoria: e.target.value})}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan1-600 focus:border-transparent transition-all disabled:opacity-50"
              >
                <option value="">Selecciona...</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Caja - MÁS DESTACADO */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-xl p-3 sm:p-4">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-900 mb-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              📦 Ubicación (Caja)
            </label>
            <select
              disabled={isUploading}
              value={formData.id_caja || ''}
              onChange={(e) => setFormData({...formData, id_caja: e.target.value})}
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm border-2 border-cyan-300 rounded-xl focus:ring-2 focus:ring-cyan1-600 focus:border-transparent transition-all disabled:opacity-50 bg-white font-semibold"
            >
              <option value="">🔓 Sin caja asignada</option>
              {cajas.map((caja) => (
                <option key={caja.id_caja} value={caja.id_caja}>
                  📦 {caja.codigo} {caja.descripcion ? `- ${caja.descripcion}` : ''}
                </option>
              ))}
            </select>
            <p className="text-[10px] sm:text-xs text-cyan-700 mt-1.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Organiza tu inventario por ubicación
            </p>
          </div>

          {/* Imagen */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 sm:p-4 rounded-xl border-2 border-indigo-200">
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
              📸 Imagen del Producto
            </label>
            
            {filePreview && (
              <div className="relative mb-3">
                <img 
                  src={filePreview} 
                  alt="Preview" 
                  className="w-full h-40 sm:h-56 object-cover rounded-xl shadow-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={isUploading}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 sm:p-2 rounded-lg hover:bg-red-600 transition-all shadow-lg disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onOpenCamera && onOpenCamera(formData)}
                disabled={isUploading}
                className="px-2.5 py-2 sm:px-3 sm:py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 text-xs sm:text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden xs:inline">Cámara</span>
              </button>

              <label className="px-2.5 py-2 sm:px-3 sm:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs sm:text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="hidden xs:inline">Archivo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gradient-to-br from-indigo-50 to-purple-50 text-gray-600 font-semibold">O</span>
              </div>
            </div>

            <input
              type="url"
              disabled={isUploading}
              value={formData.imagen_url || ''}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-cyan1-600 focus:border-transparent transition-all disabled:opacity-50"
              placeholder="🔗 URL de imagen"
            />
          </div>

          {isUploading && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-2.5 sm:p-3 flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-xs font-semibold text-yellow-800">Procesando...</p>
            </div>
          )}
        </form>

        {/* FOOTER - Fijo */}
        <div className="p-3 sm:p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50 rounded-b-2xl sm:rounded-b-3xl">
          <div className="flex gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 text-sm border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isUploading}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 text-sm bg-gradient-to-r from-cyan1-600 to-ocean1-600 text-white rounded-xl font-bold hover:from-cyan1-700 hover:to-ocean1-700 transition-all shadow-lg disabled:opacity-50"
            >
              {isUploading ? '⏳' : (isRealEdit ? '💾 Actualizar' : '✨ Crear')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal