// src/components/home/RecentClients.jsx
import { useNavigate } from 'react-router-dom'
import { getTimeAgo } from '../../utils/formatters'

function RecentClients({ actividadReciente }) {
  const navigate = useNavigate()

  const handleClientClick = (clienteId) => {
    navigate(`/clientes/${clienteId}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan1-500 to-ocean1-500 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          Nuevos Clientes
        </h3>
        <span className="text-sm text-cyan1-600 bg-indigo-50 px-3 py-1 rounded-full font-medium">Recientes</span>
      </div>
      {actividadReciente && actividadReciente.length > 0 ? (
        <div className="space-y-3">
          {actividadReciente.slice(0, 5).map((cliente, index) => (
            <div
              key={index}
              onClick={() => handleClientClick(cliente.id_cliente)}
              className="flex items-center space-x-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:shadow-md transition-all border border-indigo-100 cursor-pointer"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cyan1-500 to-ocean1-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                {cliente.nombre?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 font-semibold text-sm truncate">{cliente.nombre}</p>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {getTimeAgo(cliente.fecha_registro)}
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">NUEVO</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No hay clientes recientes</p>
          <p className="text-gray-400 text-sm mt-1">Los registros aparecerán aquí</p>
        </div>
      )}
    </div>
  )
}

export default RecentClients