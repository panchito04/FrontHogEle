// src/components/productos/ProductModal.jsx
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
  onOpenCameraWithFile // NUEVA PROP
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

  if (!isOpen) return null

  // MODIFICAR ESTA FUNCIÓN
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

    // EN VEZ DE MOSTRAR DIRECTAMENTE, ABRIR LA CÁMARA CON EL ARCHIVO
    onOpenCameraWithFile(file)
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8">
        <div className="bg-gradient-to-r from-cyan1-600 via-ocean1-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {editingProduct ? '✏️ Editar Producto' : '✨ Nuevo Producto'}
              </h3>
              <p className="text-indigo-100 mt-1">
                {editingProduct ? 'Modifica los datos del producto' : 'Cada producto es una pieza exclusiva'}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📝 Nombre del Producto *
            </label>
            <input
              type="text"
              required
              disabled={isUploading}
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan1-600 focus:border-transparent transition-all disabled:opacity-50"
              placeholder="Ej: Collar de Plata Artesanal"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📄 Descripción
            </label>
            <textarea
              rows="3"
              disabled={isUploading}
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan1-600 focus:border-transparent transition-all resize-none disabled:opacity-50"
              placeholder="Describe las características únicas..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                💰 Precio (Bs.) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                disabled={isUploading}
                value={formData.precio}
                onChange={(e) => setFormData({...formData, precio: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan1-600 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📦 Cantidad *
              </label>
              <input
                type="number"
                min="1"
                required
                disabled={isUploading}
                value={formData.cantidad}
                onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan1-600 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🏷️ Categoría *
              </label>
              <select
                required
                disabled={isUploading}
                value={formData.id_categoria}
                onChange={(e) => setFormData({...formData, id_categoria: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan1-600 focus:border-transparent transition-all disabled:opacity-50"
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

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📦 Caja
            </label>
            <select
              disabled={isUploading}
              value={formData.id_caja || ''}
              onChange={(e) => setFormData({...formData, id_caja: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan1-600 focus:border-transparent transition-all disabled:opacity-50"
            >
              <option value="">Sin caja</option>
              {cajas.map((caja) => (
                <option key={caja.id_caja} value={caja.id_caja}>
                  {caja.codigo}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4 bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border-2 border-indigo-100">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📸 Imagen del Producto
            </label>
            
            {filePreview && (
              <div className="relative mb-4">
                <img 
                  src={filePreview} 
                  alt="Preview" 
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={isUploading}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all shadow-lg disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-cyan1-700 mb-2">
                  📷 Tomar foto
                </label>
                <button
                  type="button"
                  onClick={onOpenCamera}
                  disabled={isUploading}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Abrir Cámara</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-cyan1-700 mb-2">
                  📁 Subir archivo
                </label>
                <label className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Seleccionar</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-br from-indigo-50 to-purple-50 text-gray-600 font-semibold">O</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-cyan1-700 mb-2">
                🔗 URL de imagen
              </label>
              <input
                type="url"
                disabled={isUploading}
                value={formData.imagen_url || ''}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-cyan1-600 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>

          {isUploading && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-center space-x-3">
              <svg className="animate-spin h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm font-semibold text-yellow-800">Procesando...</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan1-600 to-ocean1-600 text-white rounded-xl font-bold hover:from-cyan1-700 hover:to-ocean1-700 transition-all shadow-lg disabled:opacity-50"
            >
              {isUploading ? 'Procesando...' : (editingProduct ? '💾 Actualizar' : '✨ Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductModal