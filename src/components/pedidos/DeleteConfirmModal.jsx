// components/pedidos/DeleteConfirmModal.jsx - OPTIMIZADO MÓVIL
export default function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 sm:p-4 lg:p-6 text-white rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-white bg-opacity-20 p-2 sm:p-2.5 lg:p-3 rounded-full flex-shrink-0">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">Confirmar Eliminación</h3>
              <p className="text-red-100 mt-0.5 sm:mt-1 text-xs sm:text-sm truncate">Esta acción no se puede deshacer</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 lg:p-6">
          <p className="text-gray-700 text-center mb-4 sm:mb-5 lg:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed px-2">
            ¿Estás seguro de que deseas eliminar este pedido?<br />
            <span className="text-green-600 font-semibold">Los productos quedarán disponibles nuevamente.</span>
          </p>

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 border border-gray-300 sm:border-2
                        text-gray-700 rounded-lg sm:rounded-xl font-bold hover:bg-gray-50 
                        transition-all text-xs sm:text-sm lg:text-base"
            >
              Cancelar
            </button>

            <button
              onClick={onConfirm}
              className="flex-1 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-red-500 to-red-600 
                        text-white rounded-lg sm:rounded-xl font-bold hover:from-red-600 hover:to-red-700 
                        transition-all shadow-lg text-xs sm:text-sm lg:text-base flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Eliminar</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}