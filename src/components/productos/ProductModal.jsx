// src/components/productos/ProductModal.jsx
import React, { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import FormField from '../common/FormField'

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
    precio: '1',
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
        precio: '1',
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
      alert('La imagen no puede pesar más de 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen')
      return
    }

    onOpenCameraWithFile(file, formData)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.nombre || formData.nombre.trim() === '') {
      alert('El campo "Nombre" es obligatorio.')
      return
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      alert('El campo "Precio" es obligatorio y debe ser mayor a 0.')
      return
    }

    if (!formData.cantidad || parseInt(formData.cantidad) <= 0) {
      alert('El campo "Cantidad" es obligatorio.')
      return
    }

    if (!formData.id_categoria) {
      alert('Debes seleccionar una "Categoría".')
      return
    }

    onSubmit(e, formData)
  }

  const handleClose = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '1',
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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isRealEdit ? 'Editar Producto' : 'Nuevo Producto'}
      subtitle={isRealEdit ? 'Modifica los datos del producto' : 'Cada producto es una pieza única de catálogo'}
      theme="default"
    >
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <FormField
          label="Nombre del Producto"
          id="nombre"
          type="text"
          required
          disabled={isUploading}
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          placeholder="Ej: Collar de Plata"
        />

        <FormField
          label="Descripción"
          id="descripcion"
          type="textarea"
          disabled={isUploading}
          value={formData.descripcion}
          onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
          placeholder="Características, material, detalles de diseño..."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <FormField
              label="Precio (Bs.)"
              id="precio"
              type="number"
              required
              disabled={isUploading}
              value={formData.precio}
              onChange={(e) => setFormData({...formData, precio: e.target.value})}
              placeholder="0.00"
            />
          </div>

          <div className="col-span-1">
            <FormField
              label="Cantidad"
              id="cantidad"
              type="number"
              required
              disabled={isUploading}
              value={formData.cantidad}
              onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
              placeholder="1"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <FormField
              label="Categoría"
              id="id_categoria"
              type="select"
              required
              disabled={isUploading}
              value={formData.id_categoria}
              onChange={(e) => setFormData({...formData, id_categoria: e.target.value})}
              placeholder="Selecciona..."
              options={categorias.map((cat) => ({ value: cat.id_categoria, label: cat.nombre }))}
            />
          </div>
        </div>

        {/* Caja (Ubicación) */}
        <div className="bg-[#FAF8F5] border border-stone-200 rounded-xl p-4">
          <FormField
            label="Ubicación física (Caja)"
            id="id_caja"
            type="select"
            disabled={isUploading}
            value={formData.id_caja || ''}
            onChange={(e) => setFormData({...formData, id_caja: e.target.value})}
            placeholder="Sin caja asignada (Almacén General)"
            options={cajas.map((caja) => ({ 
              value: caja.id_caja, 
              label: `Caja ${caja.codigo} ${caja.descripcion ? `(${caja.descripcion})` : ''}` 
            }))}
          />
        </div>

        {/* Imagen del Producto */}
        <div className="bg-[#FAF8F5] border border-stone-200 p-4 rounded-xl space-y-3.5">
          <label className="block text-[11px] font-semibold text-stone-600 tracking-wider uppercase">
            Fotografía del Producto
          </label>
          
          {filePreview && (
            <div className="relative">
              <img 
                src={filePreview} 
                alt="Preview" 
                className="w-full h-40 sm:h-52 object-cover rounded-xl shadow-sm border border-stone-200"
              />
              <button
                type="button"
                onClick={removeImage}
                disabled={isUploading}
                className="absolute top-2.5 right-2.5 bg-red-600/90 text-white p-2 rounded-xl hover:bg-red-700 shadow-sm transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onOpenCamera && onOpenCamera(formData)}
              disabled={isUploading}
              className="px-4 py-2.5 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl font-medium transition-all text-xs flex items-center justify-center gap-1.5"
            >
              Usar Cámara
            </button>

            <label className="px-4 py-2.5 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl font-medium transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer">
              Subir Archivo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          <FormField
            label="Enlace Directo de Imagen (Opcional)"
            id="imagen_url"
            type="text"
            disabled={isUploading}
            value={formData.imagen_url || ''}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            placeholder="https://..."
          />
        </div>

        {isUploading && (
          <div className="bg-[#423a23]/5 border border-[#cca64c]/20 rounded-xl p-3 flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-[#cca64c]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xs font-semibold text-[#cca64c]">Subiendo imagen y procesando datos...</p>
          </div>
        )}

        {/* Buttons Panel */}
        <div className="flex gap-3 pt-3 border-t border-stone-200/50">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="flex-1 px-4 py-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl font-medium transition-all text-sm transform active:scale-95"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isUploading}
            className="flex-1 px-4 py-3 bg-cyan1-600 hover:bg-cyan1-700 text-white rounded-xl font-medium transition-all shadow-md text-sm transform active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>{isRealEdit ? 'Actualizar Producto' : 'Crear Producto'}</span>
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ProductModal