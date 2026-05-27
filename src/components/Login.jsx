// src/components/Login.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'
import Toast from './common/Toast'
import { useToast } from '../hooks/useToast'
import logoHogar from '../assets/logoHogar.jpg'

function Login({ setIsAuthenticated, setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const navigate = useNavigate()
  const { toast, showToast, hideToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await authService.login(email, password)

      if (result.success) {
        setUser(result.usuario)
        setIsAuthenticated(true)
        showToast('¡Bienvenido! Inicio de sesión exitoso', 'success')

        setTimeout(() => {
          navigate('/home')
        }, 1000)
      }
    } catch (error) {
      console.error('Error de login:', error)
      showToast(error.message || 'Usuario o contraseña incorrectos', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-cream-luxury font-sans-premium p-6 sm:py-12">
      {/* Elemento decorativo superior - Línea de diseño minimalista */}
      <div className="hidden sm:block absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan1-600 via-ocean1-600 to-cyan1-700" />

      {/* Contenedor central - Mobile First */}
      <div className="flex-1 flex items-center justify-center my-auto w-full max-w-[390px] mx-auto">
        <div className="w-full flex flex-col">
          
          {/* Cabecera / Identidad de Marca */}
          <div className="text-center mb-10 mt-4">
            {/* Logo oficial (Hogar Elegante) */}
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center relative">
              <div className="absolute inset-0 border border-cyan1-600/20 rounded-full animate-pulse" />
              <img 
                src={logoHogar} 
                alt="Hogar Elegante" 
                className="w-14 h-14 rounded-full object-cover relative z-10 border border-cyan1-600/30"
              />
            </div>
            
            <h1 className="font-serif-editorial text-3xl font-normal text-stone-900 tracking-wide mb-2">
              Hogar Elegante
            </h1>
            <p className="text-sm font-light text-stone-500 tracking-wider uppercase">
              Iniciar Sesión
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Campo: Correo */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-semibold text-stone-600 tracking-wider uppercase">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-cyan1-600 transition-colors duration-200">
                  <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="block w-full pl-10 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-cyan1-600/20 focus:border-cyan1-600 transition-all duration-300 disabled:bg-stone-50 disabled:text-stone-400 text-[15px]"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            {/* Campo: Contraseña */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-stone-600 tracking-wider uppercase">
                  Contraseña
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-cyan1-600 transition-colors duration-200">
                  <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="block w-full pl-10 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-cyan1-600/20 focus:border-cyan1-600 transition-all duration-300 disabled:bg-stone-50 disabled:text-stone-400 text-[15px]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Mantener sesión */}
            <div className="flex items-center">
              <label className="relative flex items-center cursor-pointer select-none">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 bg-white border border-stone-300 rounded-md peer-checked:bg-cyan1-600 peer-checked:border-cyan1-600 flex items-center justify-center transition-all duration-200">
                  <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-2.5 text-[13px] text-stone-600 font-light">
                  Recordarme en este dispositivo
                </span>
              </label>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan1-600 hover:bg-cyan1-700 text-white py-4 px-6 rounded-xl font-medium tracking-wide shadow-md hover:shadow-lg focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] mt-2 text-[15px]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2.5">
                  <svg className="animate-spin h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Identificando...</span>
                </span>
              ) : (
                'Acceder'
              )}
            </button>
          </form>

          {/* Registro alternativo */}
          <div className="mt-8 text-center">
            <span className="text-[13px] text-stone-500 font-light">¿No tienes cuenta? </span>
            <Link
              to="/register"
              className="text-[13px] text-cyan1-600 hover:text-cyan1-700 font-medium underline underline-offset-4 decoration-cyan1-600/30"
            >
              Crea una aquí
            </Link>
          </div>
        </div>
      </div>

      {/* Pie de página sutil */}
      <div className="mt-8 text-center text-xs font-light text-stone-400 tracking-wider">
        © 2024 HOGAR ELEGANTE.
      </div>

      {/* Mensajes Flotantes */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          duration={toast.duration}
        />
      )}
    </div>
  )
}

export default Login