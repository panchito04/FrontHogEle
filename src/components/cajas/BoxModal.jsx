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
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">
                {editingBox ? '✏️ Editar Caja' : '📦 Nueva Caja'}
              </h3>
              <p className="text-cyan-100 text-sm">
                {editingBox ? 'Modifica la información' : 'Registra una nueva caja'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-1.5 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                🏷️ Código *
              </label>
              <input
                type="text"
                required
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600"
                placeholder="CAJA-2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                📅 Llegada *
              </label>
              <input
                type="date"
                required
                value={formData.fecha_llegada}
                onChange={(e) => setFormData({ ...formData, fecha_llegada: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              📄 Descripción
            </label>
            <textarea
              rows="2"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-cyan-600"
              placeholder="Describe el contenido..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                👤 Proveedor
              </label>
              <input
                type="text"
                value={formData.proveedor}
                onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600"
                placeholder="Proveedor"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                💰 Costo (Bs.)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.costo_total}
                onChange={(e) => setFormData({ ...formData, costo_total: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600"
                placeholder="0.00"
              />
            </div>
          </div>

          {editingBox && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">📊 Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600"
              >
                <option value="en_proceso">⏳ En Proceso</option>
                <option value="completada">✓ Completada</option>
                <option value="archivada">📁 Archivada</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              📝 Observaciones
            </label>
            <textarea
              rows="2"
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-cyan-600"
              placeholder="Notas adicionales..."
            ></textarea>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 shadow"
            >
              {editingBox ? '💾 Actualizar' : '✨ Crear'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default BoxModal
