// hooks/usePedidos.js
import { useState } from 'react'

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState([])
  const [detallesPedidos, setDetallesPedidos] = useState({})
  const [pagosPedidos, setPagosPedidos] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const fetchPedidos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`)
      
      if (!response.ok) throw new Error('Error al obtener pedidos')
      
      const data = await response.json()
      setPedidos(data)

      // Obtener detalles y pagos de cada pedido
      const detallesMap = {}
      const pagosMap = {}
      
      for (const pedido of data) {
        try {
          // Detalles
          const detalleRes = await fetch(
            `${import.meta.env.VITE_API_URL}/api/pedidos/${pedido.id_pedido}/detalles`
          )
          if (detalleRes.ok) {
            detallesMap[pedido.id_pedido] = await detalleRes.json()
          }

          // Pagos
          const pagoRes = await fetch(
            `${import.meta.env.VITE_API_URL}/api/pagos/pedido/${pedido.id_pedido}`
          )
          if (pagoRes.ok) {
            pagosMap[pedido.id_pedido] = await pagoRes.json()
          }
        } catch (err) {
          console.error(`Error al cargar datos del pedido ${pedido.id_pedido}:`, err)
        }
      }
      
      setDetallesPedidos(detallesMap)
      setPagosPedidos(pagosMap)
      
      return { success: true }
    } catch (error) {
      console.error('Error:', error)
      return { success: false, message: 'Error al cargar pedidos' }
    } finally {
      setIsLoading(false)
    }
  }

  const createPedido = async (pedidoData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear pedido')
      }

      await fetchPedidos()
      return { 
        success: true, 
        message: pedidoData.es_venta_directa 
          ? '✅ Venta registrada exitosamente' 
          : '✅ Pedido creado exitosamente' 
      }
    } catch (error) {
      console.error('Error:', error)
      return { success: false, message: error.message }
    }
  }

  const updatePedido = async (id, data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar pedido')
      }

      await fetchPedidos()
      return { success: true, message: '✅ Pedido actualizado exitosamente' }
    } catch (error) {
      console.error('Error:', error)
      return { success: false, message: error.message }
    }
  }

  const deletePedido = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar pedido')
      }

      await fetchPedidos()
      return { 
        success: true, 
        message: '✅ Pedido eliminado. Productos disponibles nuevamente.' 
      }
    } catch (error) {
      console.error('Error:', error)
      return { success: false, message: error.message }
    }
  }

  return {
    pedidos,
    detallesPedidos,
    pagosPedidos,
    isLoading,
    fetchPedidos,
    createPedido,
    updatePedido,
    deletePedido
  }
}