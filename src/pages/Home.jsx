import Sidebar from '../components/Sidebar'

function Home({ user }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      
      <div className="flex-1 overflow-auto lg:ml-0 pt-16 lg:pt-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Panel de Control
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Bienvenido a tu sistema de gestión</p>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Cards de estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 sm:p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-xs sm:text-sm font-medium">Total Clientes</p>
                  <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">150</h3>
                </div>
                <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-xs sm:text-sm font-medium">Productos</p>
                  <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">45</h3>
                </div>
                <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 sm:p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-xs sm:text-sm font-medium">Pedidos</p>
                  <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">89</h3>
                </div>
                <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs sm:text-sm font-medium">Ingresos</p>
                  <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">$12.5k</h3>
                </div>
                <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Secciones de información */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Actividad reciente */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Actividad Reciente
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                      {item}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-medium text-sm sm:text-base truncate">Nuevo cliente registrado</p>
                      <p className="text-gray-500 text-xs sm:text-sm">Hace {item} hora(s)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accesos rápidos */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Accesos Rápidos
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button className="p-3 sm:p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg hover:shadow-md transition-all duration-200 border-2 border-indigo-100 hover:border-indigo-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 mx-auto mb-1 sm:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700">Nuevo Cliente</p>
                </button>
                <button className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all duration-200 border-2 border-purple-100 hover:border-purple-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-1 sm:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700">Nuevo Producto</p>
                </button>
                <button className="p-3 sm:p-4 bg-gradient-to-br from-pink-50 to-red-50 rounded-lg hover:shadow-md transition-all duration-200 border-2 border-pink-100 hover:border-pink-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600 mx-auto mb-1 sm:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700">Nuevo Pedido</p>
                </button>
                <button className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg hover:shadow-md transition-all duration-200 border-2 border-green-100 hover:border-green-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-1 sm:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700">Ver Reportes</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home