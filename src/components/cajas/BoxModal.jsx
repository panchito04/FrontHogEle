// src/components/cajas/BoxModal.jsx
import React, { useState, useEffect } from 'react'

const BoxModal = ({ isOpen, onClose, onSubmit, editingBox }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
    fecha_llegada: new Date().toISOString().split('T')[0],
    proveedor: '',
    costo_total: '',
    observaciones: '',
    estado: 'en_proceso'
  })

  useEffect(() => {
    if (editingBox) {
      setFormData(editingBox)
    } else {
      setFormData({
        codigo: '',
        descripcion: '',
        fecha_llegada: new Date().toISOString().split('T')[0],
        proveedor: '',
        costo_total: '',
        observaciones: '',
        estado: 'en_proceso'
      })
    }
  }, [editingBox, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(e, formData)
  }

  const handleClose = () => {
    setFormData({
      codigo: '',
      descripcion: '',
      fecha_llegada: new Date().toISOString().split('T')[0],
      proveedor: '',
      costo_total: '',
      observaciones: '',
      estado: 'en_proceso'
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {editingBox ? '✏️ Editar Caja' : '📦 Nueva Caja'}
              </h3>
              <p className="text-cyan-100 mt-1">
                {editingBox ? 'Modifica la información de la caja' : 'Registra una nueva caja de productos'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🏷️ Código de Caja *
              </label>
              <input
                type="text"
                required
                value={formData.codigo}
                onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all"
                placeholder="CAJA-2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📅 Fecha de Llegada *
              </label>
              <input
                type="date"
                required
                value={formData.fecha_llegada}
                onChange={(e) => setFormData({...formData, fecha_llegada: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📄 Descripción
            </label>
            <textarea
              rows="3"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all resize-none"
              placeholder="Describe el contenido de la caja..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                👤 Proveedor
              </label>
              <input
                type="text"
                value={formData.proveedor}
                onChange={(e) => setFormData({...formData, proveedor: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all"
                placeholder="Nombre del proveedor"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                💰 Costo Total (Bs.)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.costo_total}
                onChange={(e) => setFormData({...formData, costo_total: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          {editingBox && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📊 Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all"
              >
                <option value="en_proceso">⏳ En Proceso</option>
                <option value="completada">✓ Completada</option>
                <option value="archivada">📁 Archivada</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📝 Observaciones
            </label>
            <textarea
              rows="3"
              value={formData.observaciones}
              onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all resize-none"
              placeholder="Notas adicionales sobre esta caja..."
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg"
            >
              {editingBox ? '💾 Actualizar Caja' : '✨ Crear Caja'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BoxModal