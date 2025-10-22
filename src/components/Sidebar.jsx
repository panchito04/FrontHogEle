import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import logo from '../assets/logoHogar.jpg';

function Sidebar({ user }) {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    {
      name: 'Inicio',
      path: '/home',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Clientes',
      path: '/clientes',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      name: 'Productos',
      path: '/productos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      name: 'Pedidos',
      path: '/pedidos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      name: 'Pagos',
      path: '/pagos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ]

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white z-50 shadow-lg">
        <div className="flex items-center justify-between p-4">
          {/* Botón de menú a la IZQUIERDA */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Logo en el CENTRO */}
          <div className="flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
  <img
    src={logo}
    alt="Logo"
    className="w-full h-full object-cover"
  />
</div>

            <h2 className="text-base font-bold">Hogar Elegante</h2>
          </div>

          {/* Espacio vacío a la derecha para balance */}
          <div className="w-10"></div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-indigo-600 to-purple-700 text-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header del Sidebar con botón de cerrar */}
          <div className="p-4 border-b border-indigo-500 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
  <img
    src={logo}
    alt="Logo"
    className="w-full h-full object-cover"
  />
</div>

              <div>
                <h2 className="text-lg font-bold">Hogar Elegante</h2>
                <p className="text-indigo-200 text-xs">Sistema de Gestión</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Info del usuario */}
          {user && (
            <div className="p-4 border-b border-indigo-500">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-xs text-indigo-100">Bienvenido/a</p>
                <p className="font-semibold text-sm">{user.nombre}</p>
                <p className="text-xs text-indigo-200 mt-1">Rol: {user.rol}</p>
              </div>
            </div>
          )}

          {/* Menú de navegación */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-lg transform scale-105'
                      : 'hover:bg-white/10 hover:translate-x-1'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Botón de cerrar sesión */}
          <div className="p-4 border-t border-indigo-500">
            <Link
              to="/login"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-colors duration-200"
              onClick={() => window.location.reload()}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Cerrar Sesión</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-64 bg-gradient-to-b from-indigo-600 to-purple-700 text-white flex-col shadow-2xl">
        {/* Logo y usuario */}
        <div className="p-6 border-b border-indigo-500">
          <div className="flex items-center space-x-3 mb-4">
<div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
  <img
    src={logo}
    alt="Logo"
    className="w-full h-full object-cover"
  />
</div>

            <div>
              <h2 className="text-xl font-bold">Hogar Elegante</h2>
              <p className="text-indigo-200 text-sm">Sistema de Gestión</p>
            </div>
          </div>
          
          {user && (
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-sm text-indigo-100">Bienvenido/a</p>
              <p className="font-semibold">{user.nombre}</p>
              <p className="text-xs text-indigo-200 mt-1">Rol: {user.rol}</p>
            </div>
          )}
        </div>

        {/* Menú de navegación */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-lg transform scale-105'
                    : 'hover:bg-white/10 hover:translate-x-1'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Botón de cerrar sesión */}
        <div className="p-4 border-t border-indigo-500">
          <Link
            to="/login"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-colors duration-200"
            onClick={() => window.location.reload()}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Cerrar Sesión</span>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Sidebar