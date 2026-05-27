// src/components/Register.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'
import Toast from './common/Toast'
import { useToast } from '../hooks/useToast'
import logoHogar from '../assets/logoHogar.jpg'
import FormField from './common/FormField'

function Register({ setIsAuthenticated, setUser }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rol, setRol] = useState('vendedor')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast, showToast, hideToast } = useToast()

  const roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'vendedor', label: 'Vendedor' },
    { value: 'entregas', label: 'Entregas' }
  ]

  const validateForm = () => {
    if (!nombre.trim()) {
      showToast('El nombre es requerido', 'error')
      return false
    }
    if (!email.trim()) {
      showToast('El correo electrónico es requerido', 'error')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Correo electrónico inválido', 'error')
      return false
    }
    if (!password) {
      showToast('La contraseña es requerida', 'error')
      return false
    }
    if (password.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'error')
      return false
    }
    if (password !== confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error')
      return false
    }
    if (!rol) {
      showToast('Debes seleccionar un rol', 'error')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await authService.registro(nombre, email, password, rol)

      if (result.success) {
        setUser(result.usuario)
        setIsAuthenticated(true)
        showToast('¡Cuenta creada exitosamente! Redirigiendo...', 'success')
        
        setTimeout(() => {
          navigate('/home')
        }, 1500)
      }
    } catch (error) {
      showToast(error.message || 'Error al crear la cuenta', 'error')
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
          <div className="text-center mb-8 mt-4">
            {/* Logo oficial (Hogar Elegante) */}
            <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center relative">
              <div className="absolute inset-0 border border-cyan1-600/20 rounded-full animate-pulse" />
              <img 
                src={logoHogar} 
                alt="Hogar Elegante" 
                className="w-14 h-14 rounded-full object-cover relative z-10 border border-cyan1-600/30"
              />
            </div>
            
            <h1 className="font-serif-editorial text-3xl font-normal text-stone-900 tracking-wide mb-1">
              Registrar Cuenta
            </h1>
            <p className="text-xs font-light text-stone-500 tracking-wider uppercase">
              Nuevo Colaborador
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <FormField
              label="Nombre Completo"
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Ej: Franz Flores"
            />

            <FormField
              label="Correo Electrónico"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="ejemplo@correo.com"
            />

            <FormField
              label="Rol del Usuario"
              id="rol"
              type="select"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              required
              disabled={isLoading}
              options={roles}
            />

            <FormField
              label="Contraseña"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="•••••••• (mín. 6 caracteres)"
            />

            <FormField
              label="Confirmar Contraseña"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="••••••••"
            />

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan1-600 hover:bg-cyan1-700 text-white py-3.5 px-6 rounded-xl font-medium tracking-wide shadow-md hover:shadow-lg focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] mt-2 text-[15px] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Registrando...</span>
                </>
              ) : (
                <span>Crear Cuenta</span>
              )}
            </button>
          </form>

          {/* Enlace para volver */}
          <div className="mt-8 text-center text-xs sm:text-sm font-light text-stone-500">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-semibold text-cyan1-600 hover:text-cyan1-700 transition-colors underline decoration-cyan1-600/30 underline-offset-4">
              Inicia sesión aquí
            </Link>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-[10px] sm:text-xs text-stone-400 font-light tracking-wide">
        © 2026 Hogar Elegante. Todos los derechos reservados.
      </div>

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

export default Register