// src/components/Sidebar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import logo from '../assets/logoHogar.jpg'

function Sidebar({ user }) {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    {
      name: 'Inicio',
      path: '/home',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Productos',
      path: '/productos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      name: 'Ventas',
      path: '/pedidos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      name: 'Pagos',
      path: '/pagos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ]

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      authService.logout()
      navigate('/login')
    }
  }

  return (
    <>
      {/* MOBILE VIEW (Top Bar & Docked Bottom Navigation) */}
      <div className="lg:hidden">
        {/* Top Header */}
        <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-stone-200/60 z-30 px-5 h-16 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-9 h-9 rounded-full object-cover border border-cyan1-600/20 shadow-sm flex-shrink-0" 
            />
            <span className="font-serif-editorial text-lg text-stone-900 tracking-wide">
              Hogar Elegante
            </span>
          </div>
          
          {user && (
            <div className="flex items-center space-x-3">
              <span className="text-xs font-sans-premium text-stone-500 font-light truncate max-w-[120px] capitalize">
                {user.nombre}
              </span>
              <button 
                onClick={handleLogout} 
                className="text-stone-400 hover:text-red-600 p-1.5 bg-stone-50 rounded-lg border border-stone-200 transition-colors"
                title="Cerrar sesión"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Docked Bottom Navigation Bar (Instagram/Facebook Style) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-[0_-3px_12px_rgba(0,0,0,0.03)] h-16 flex justify-around items-center pb-safe px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center w-16 py-1 relative active:scale-90 transition-transform duration-200"
              >
                <div className={`${isActive ? 'text-cyan1-600' : 'text-stone-400'} transition-all duration-300`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] mt-0.5 tracking-wide font-sans-premium transition-all duration-300 ${isActive ? 'text-cyan1-600 font-semibold' : 'text-stone-400 font-light'}`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* DESKTOP VIEW (Luxury Side Navigation) */}
      <div className="hidden lg:flex h-screen w-64 bg-cyan1-600 text-white flex-col shadow-xl border-r border-white/5 relative">
        {/* Brand identity header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3.5 mb-5">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 shadow-md flex-shrink-0">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif-editorial text-lg tracking-wide leading-tight">Hogar Elegante</h2>
              <p className="text-stone-300 text-xs font-light tracking-widest uppercase">Admin</p>
            </div>
          </div>
          
          {user && (
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[11px] text-stone-300 font-light uppercase tracking-wider">Operador</p>
              <p className="font-medium text-sm mt-0.5 truncate">{user.nombre}</p>
              <p className="text-[10px] text-ocean1-600 mt-1 font-light tracking-wide uppercase">
                {user.rol}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3.5 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-sans-premium ${
                  isActive
                    ? 'bg-white text-cyan1-600 shadow-md font-semibold translate-x-1'
                    : 'text-stone-200 hover:bg-white/5 hover:translate-x-1'
                }`}
              >
                <span className={`${isActive ? 'text-cyan1-600' : 'text-stone-300'}`}>
                  {item.icon}
                </span>
                <span className="tracking-wide">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer Logout Option */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors duration-300 text-red-200 hover:text-white text-sm font-medium"
          >
            <svg className="w-5.5 h-5.5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar