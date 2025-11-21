import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import Login from './components/Login'
import Home from './pages/Home'
import Register from './components/Register'
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
      toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] flex items-center space-x-2 animate-slide-up'
      
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

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
          <Navigate to="/home" /> : 
          <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
        } 
      />
      <Route 
        path="/home" 
        element={
          isAuthenticated ? 
          <Home user={user} /> : 
          <Navigate to="/login" />
        } 
      />
      <Route 
        path="/clientes" 
        element={
          isAuthenticated ? 
          <Clientes user={user} /> : 
          <Navigate to="/login" />
        } 
      />
      <Route 
        path="/productos"
        element={
          isAuthenticated ? 
          <Productos user={user} /> : 
          <Navigate to="/login" />
        } 
      />
      <Route 
        path="/pedidos"
        element={
          isAuthenticated ? 
          <Pedidos user={user} /> : 
          <Navigate to="/login" />
        } 
      />
      <Route 
        path="/pagos"
        element={
          isAuthenticated ? 
          <Pagos user={user} /> : 
          <Navigate to="/login" />
        } 
      />
      <Route 
        path="/register" 
        element={
          isAuthenticated ? 
          <Navigate to="/home" /> : 
          <Register setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
        } 
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

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