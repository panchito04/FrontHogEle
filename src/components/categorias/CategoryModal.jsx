// src/components/categorias/CategoryModal.jsx
import React, { useState } from 'react'

const CategoryModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      // Si llega aquí, fue exitoso (el padre maneja el toast)
      setFormData({ nombre: '', descripcion: '' })
      onClose()
    } catch (error) {
      // El padre ya manejó el error con toast
      console.error('Error en handleSubmit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (isSubmitting) return // No cerrar mientras se está enviando
    setFormData({ nombre: '', descripcion: '' })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-ocean1-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">🏷️ Nueva Categoría</h3>
              <p className="text-purple-100 mt-1">Organiza tus productos</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📝 Nombre *
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-ocean1-600 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Ej: Joyería"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📄 Descripción
            </label>
            <textarea
              rows="3"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-ocean1-600 focus:border-transparent transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Describe esta categoría..."
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-ocean1-600 to-pink-600 text-white rounded-xl font-bold hover:from-ocean1-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <span>✨ Crear</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryModal