import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './components/Login'
import Home from './pages/Home'
import Register from './components/Register'
import Clientes from './pages/Clientes'
import Productos from './pages/Productos'
import Pedidos from './pages/Pedidos'
import Pagos from './pages/Pagos'
import { usePreventBackNavigation } from './hooks/usePreventBackNavigation'

// Componente wrapper que aplica el hook a todas las rutas
function AppContent({ isAuthenticated, setIsAuthenticated, user, setUser }) {
  // Aplicar el hook de prevención globalmente
  usePreventBackNavigation();

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