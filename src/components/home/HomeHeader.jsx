// src/components/home/HomeHeader.jsx

function HomeHeader({ user, onRefresh, isLoading }) {
  return (
    <div className="bg-white shadow-md border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan1-600 via-ocean1-600 to-pink-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base flex items-center">
              <svg className="w-5 h-5 mr-2 text-cyan1-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Bienvenido, <span className="font-semibold ml-1">{user?.nombre}</span>
            </p>
          </div>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="mt-4 sm:mt-0 inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-cyan1-600 to-ocean1-600 text-white rounded-lg hover:from-cyan1-700 hover:to-ocean1-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isLoading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomeHeader