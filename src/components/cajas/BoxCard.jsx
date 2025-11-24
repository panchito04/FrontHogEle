// src/components/cajas/BoxCard.jsx
import React from 'react'

const BoxCard = ({ caja, onViewDetail, onEdit, onDelete }) => {
  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-cyan-200"
    >
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-1">{caja.codigo}</h3>
            <p className="text-cyan-100 text-sm">{caja.descripcion || 'Sin descripción'}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            caja.estado === 'completada' ? 'bg-green-400' :
            caja.estado === 'archivada' ? 'bg-gray-400' :
            'bg-yellow-400'
          }`}>
            {caja.estado === 'completada' ? '✓ Completada' :
             caja.estado === 'archivada' ? '📁 Archivada' :
             '⏳ En Proceso'}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
            <p className="text-cyan-200 text-xs">Productos</p>
            <p className="text-xl font-bold">{caja.total_productos || 0}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
            <p className="text-cyan-200 text-xs">Inversión</p>
            <p className="text-xl font-bold">
              {caja.costo_total ? `Bs. ${parseFloat(caja.costo_total).toFixed(2)}` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">Llegada:</span>
          <span className="ml-2">{new Date(caja.fecha_llegada).toLocaleDateString()}</span>
        </div>

        {caja.proveedor && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium">Proveedor:</span>
            <span className="ml-2">{caja.proveedor}</span>
          </div>
        )}

        {caja.observaciones && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">📝 Observaciones:</p>
            <p className="text-xs">{caja.observaciones}</p>
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t">
          <button
            onClick={() => onViewDetail(caja)}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Ver Detalles</span>
          </button>
          <button
            onClick={() => onEdit(caja)}
            className="bg-yellow-500 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-yellow-600 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(caja.id_caja)}
            className="bg-red-500 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-red-600 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default BoxCard