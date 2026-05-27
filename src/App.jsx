// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { authService } from './services/authService'
import Login from './components/Login'
import Register from './components/Register'
import Home from './pages/Home'
import Clientes from './pages/Clientes'
import Productos from './pages/Productos'
import Pedidos from './pages/Pedidos'
import Pagos from './pages/Pagos'

function AppContent({ isAuthenticated, setIsAuthenticated, user, setUser }) {
  const navigate = useNavigate()
  const location = useLocation()
  const backPressCountRef = useRef(0)
  const resetTimeoutRef = useRef(null)

  // Manejo GLOBAL del botón atrás
  useEffect(() => {
    const handlePopState = (e) => {
      // Si el evento tiene state.modal, es un modal y lo ignora
      if (e.state?.modal) {
        return
      }

      backPressCountRef.current++

      if (backPressCountRef.current === 1) {
        // Primera vez: mostrar mensaje y bloquear
        window.history.pushState(null, '', window.location.href)
        
        const existingToast = document.getElementById('back-toast')
        if (existingToast) existingToast.remove()

        const toast = document.createElement('div')
        toast.id = 'back-toast'
        toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] flex items-center space-x-2 animate-toast-slide-up'
        
        if (location.pathname === '/home') {
          toast.innerHTML = `
            <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="font-medium">Presiona atrás nuevamente para salir</span>
          `
        } else {
          toast.innerHTML = `
            <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="font-medium">Presiona atrás nuevamente para volver</span>
          `
        }
        
        document.body.appendChild(toast)

        setTimeout(() => {
          const t = document.getElementById('back-toast')
          if (t) t.remove()
        }, 3000)

        if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
        resetTimeoutRef.current = setTimeout(() => {
          backPressCountRef.current = 0
        }, 3000)
        
      } else if (backPressCountRef.current >= 2) {
        backPressCountRef.current = 0
        if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
        const toast = document.getElementById('back-toast')
        if (toast) toast.remove()
        
        if (location.pathname === '/home') {
          window.history.back()
        } else {
          navigate(-1)
        }
      }
    }

    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [navigate, location.pathname])

  // Resetear contador cuando cambia la ruta
  useEffect(() => {
    backPressCountRef.current = 0
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
    const toast = document.getElementById('back-toast')
    if (toast) toast.remove()
  }, [location.pathname])

  // Componente para rutas protegidas
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
          <Navigate to="/home" replace /> : 
          <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
        } 
      />
      <Route 
        path="/register" 
        element={
          isAuthenticated ? 
          <Navigate to="/home" replace /> : 
          <Register setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
        } 
      />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home user={user} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/clientes" 
        element={
          <ProtectedRoute>
            <Clientes user={user} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/productos"
        element={
          <ProtectedRoute>
            <Productos user={user} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/pedidos"
        element={
          <ProtectedRoute>
            <Pedidos user={user} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/pagos"
        element={
          <ProtectedRoute>
            <Pagos user={user} />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar sesión al cargar la app
  useEffect(() => {
    const verificarSesion = async () => {
      if (authService.isAuthenticated()) {
        try {
          const result = await authService.verificarSesion()
          if (result.success) {
            setUser(result.usuario)
            setIsAuthenticated(true)
          }
        } catch (error) {
          console.error('Error al verificar sesión:', error)
          authService.logout()
        }
      }
      setIsLoading(false)
    }

    verificarSesion()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-luxury">
        <div className="text-center p-8 bg-white/40 backdrop-blur-md border border-stone-200/40 rounded-3xl max-w-xs w-full shadow-sm">
          <div className="relative flex justify-center mb-6">
            <div className="w-16 h-16 border-4 border-cyan1-600/10 border-t-cyan1-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan1-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
          </div>
          <h3 className="text-stone-900 text-lg font-serif-editorial tracking-wide mb-1">Verificando Sesión</h3>
          <p className="text-stone-400 text-[10px] font-sans-premium font-light tracking-widest uppercase">Garantizando Conexión Segura</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <AppContent 
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        user={user}
        setUser={setUser}
      />
    </BrowserRouter>
  )
}

export default App