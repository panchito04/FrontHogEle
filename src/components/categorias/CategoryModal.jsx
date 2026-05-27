// src/components/categorias/CategoryModal.jsx
import React, { useState } from 'react'
import Modal from '../common/Modal'
import FormField from '../common/FormField'

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
      setFormData({ nombre: '', descripcion: '' })
      onClose()
    } catch (error) {
      console.error('Error en handleSubmit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (isSubmitting) return
    setFormData({ nombre: '', descripcion: '' })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nueva Categoría"
      subtitle="Organiza tus productos en colecciones exclusivas"
      maxWidth="max-w-md"
      theme="info"
    >
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
        <FormField
          label="Nombre de la Categoría"
          id="nombre"
          type="text"
          required
          disabled={isSubmitting}
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          placeholder="Ej: Anillos, Collares, Brazaletes..."
        />

        <FormField
          label="Descripción"
          id="descripcion"
          type="textarea"
          disabled={isSubmitting}
          value={formData.descripcion}
          onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
          placeholder="Breve descripción de las piezas de esta colección..."
        />

        {/* Buttons Panel */}
        <div className="flex gap-3 pt-3 border-t border-stone-200/50">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl font-medium transition-all text-sm transform active:scale-95 disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-cyan1-600 hover:bg-cyan1-700 text-white rounded-xl font-medium transition-all shadow-md text-sm transform active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? 'Creando...' : 'Crear Categoría'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CategoryModal