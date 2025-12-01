// src/hooks/usePedidos.js
import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // ✅ FETCH PEDIDOS
  const fetchPedidos = async () => {
    setIsLoading(true)
    try {
      console.log('🔍 Fetching pedidos desde:', `${API_URL}/api/pedidos`)
      
      const response = await fetch(`${API_URL}/api/pedidos`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('📦 Pedidos recibidos:', result)

      // Soporta ambos formatos
      let pedidosData = []
      if (result.success && result.data) {
        pedidosData = result.data
      } else if (Array.isArray(result)) {
        pedidosData = result
      }

      setPedidos(pedidosData)
      return { success: true, message: 'Pedidos cargados' }
    } catch (error) {
      console.error('❌ Error al cargar pedidos:', error)
      setPedidos([])
      return { success: false, message: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ CREAR PEDIDO
  const createPedido = async (pedidoData) => {
    try {
      console.log('📤 Creando pedido:', pedidoData)
      
      const response = await fetch(`${API_URL}/api/pedidos`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedidoData)
      })

      const result = await response.json()
      console.log('📦 Respuesta del servidor:', result)

      if (!response.ok) {
        // El servidor devolvió un error con detalles
        throw new Error(result.message || `Error ${response.status}`)
      }

      if (result.success) {
        await fetchPedidos() // Recargar lista
        return {
          success: true,
          message: result.message || 'Pedido creado exitosamente'
        }
      } else {
        throw new Error(result.message || 'Error al crear pedido')
      }
    } catch (error) {
      console.error('❌ Error al crear pedido:', error)
      return {
        success: false,
        message: error.message || 'Error al crear pedido'
      }
    }
  }

  // ✅ ACTUALIZAR PEDIDO
  const updatePedido = async (id, updateData) => {
    try {
      console.log('🔄 Actualizando pedido:', id, updateData)
      
      const response = await fetch(`${API_URL}/api/pedidos/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `Error ${response.status}`)
      }

      if (result.success) {
        await fetchPedidos()
        return {
          success: true,
          message: result.message || 'Pedido actualizado'
        }
      } else {
        throw new Error(result.message || 'Error al actualizar')
      }
    } catch (error) {
      console.error('❌ Error al actualizar pedido:', error)
      return {
        success: false,
        message: error.message
      }
    }
  }

  // ✅ ELIMINAR PEDIDO
  const deletePedido = async (id) => {
    try {
      console.log('🗑️ Eliminando pedido:', id)
      
      const response = await fetch(`${API_URL}/api/pedidos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `Error ${response.status}`)
      }

      if (result.success) {
        await fetchPedidos()
        return {
          success: true,
          message: result.message || 'Pedido eliminado'
        }
      } else {
        throw new Error(result.message || 'Error al eliminar')
      }
    } catch (error) {
      console.error('❌ Error al eliminar pedido:', error)
      return {
        success: false,
        message: error.message
      }
    }
  }

  // ✅ REGISTRAR PAGO
  const registrarPago = async (idPedido, pagoData) => {
    try {
      console.log('💰 Registrando pago para pedido:', idPedido, pagoData)
      
      const response = await fetch(`${API_URL}/api/pedidos/${idPedido}/pago`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pagoData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `Error ${response.status}`)
      }

      if (result.success) {
        await fetchPedidos()
        return {
          success: true,
          message: result.message || 'Pago registrado'
        }
      } else {
        throw new Error(result.message || 'Error al registrar pago')
      }
    } catch (error) {
      console.error('❌ Error al registrar pago:', error)
      return {
        success: false,
        message: error.message
      }
    }
  }

  return {
    pedidos,
    isLoading,
    fetchPedidos,
    createPedido,
    updatePedido,
    deletePedido,
    registrarPago
  }
}