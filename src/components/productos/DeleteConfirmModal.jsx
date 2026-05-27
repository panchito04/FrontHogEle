// src/components/productos/DeleteConfirmModal.jsx
import React from 'react'
import Modal from '../common/Modal'

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Eliminación"
      subtitle="Esta acción no se puede deshacer"
      maxWidth="max-w-md"
      theme="danger"
    >
      <div className="p-6 text-center space-y-6">
        <p className="text-stone-700 text-[15px] font-sans-premium font-light tracking-wide leading-relaxed">
          ¿Estás seguro de que deseas eliminar este registro de forma permanente? El producto o lote dejará de estar disponible en el inventario.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl font-medium transition-all text-sm transform active:scale-95"
          >
            Cancelar
          </button>
          
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-[#402422] border border-[#d97c75]/25 text-[#d97c75] rounded-xl font-medium transition-all text-sm transform active:scale-95 flex items-center justify-center gap-1.5"
          >
            Eliminar
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirmModal