// src/components/cajas/BoxModal.jsx
import React, { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import FormField from '../common/FormField'

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

  const estadosCaja = [
    { value: 'en_proceso', label: 'En Proceso' },
    { value: 'completada', label: 'Completada' },
    { value: 'archivada', label: 'Archivada' }
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingBox ? 'Editar Caja' : 'Nueva Caja'}
      subtitle={editingBox ? 'Modifica la información de importación' : 'Registra un nuevo lote de importación'}
      maxWidth="max-w-xl"
      theme="default"
    >
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Código del lote"
            id="codigo"
            type="text"
            required
            value={formData.codigo}
            onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
            placeholder="CAJA-2026-001"
          />

          <FormField
            label="Fecha de Llegada"
            id="fecha_llegada"
            type="date"
            required
            value={formData.fecha_llegada}
            onChange={(e) => setFormData({ ...formData, fecha_llegada: e.target.value })}
          />
        </div>

        <FormField
          label="Descripción"
          id="descripcion"
          type="textarea"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          placeholder="Describe el contenido, origen, tipo de piezas..."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Proveedor / Origen"
            id="proveedor"
            type="text"
            value={formData.proveedor}
            onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
            placeholder="Ej: Joyería Shanghai"
          />

          <FormField
            label="Costo Total (Bs.)"
            id="costo_total"
            type="number"
            value={formData.costo_total}
            onChange={(e) => setFormData({ ...formData, costo_total: e.target.value })}
            placeholder="0.00"
          />
        </div>

        {editingBox && (
          <FormField
            label="Estado del Lote"
            id="estado"
            type="select"
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            options={estadosCaja}
          />
        )}

        <FormField
          label="Observaciones"
          id="observaciones"
          type="textarea"
          value={formData.observaciones}
          onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
          placeholder="Notas adicionales o reportes de revisión..."
        />

        {/* Buttons Panel */}
        <div className="flex gap-3 pt-3 border-t border-stone-200/50">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl font-medium transition-all text-sm transform active:scale-95"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-cyan1-600 hover:bg-cyan1-700 text-white rounded-xl font-medium transition-all shadow-md text-sm transform active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>{editingBox ? 'Actualizar Caja' : 'Crear Caja'}</span>
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default BoxModal
