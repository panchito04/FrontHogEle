// src/hooks/useProductos.js
import { useState, useCallback } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const useProductos = () => {
  const [productos, setProductos] = useState([])
  const [stats, setStats] = useState({ total: 0, vendidos: 0, disponibles: 0, porCategoria: {} })
  const [isLoading, setIsLoading] = useState(true)

  const fetchProductos = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${API_URL}/api/productos`)
      setProductos(response.data)
      const statsResponse = await axios.get(`${API_URL}/api/productos/stats/resumen`)
      setStats(statsResponse.data)
      return { success: true }
    } catch (error) {
      console.error('Error al obtener productos:', error)
      return { success: false, message: 'Error al cargar los productos' }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createProducto = useCallback(async (formData) => {
    try {
      await axios.post(`${API_URL}/api/productos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      await fetchProductos()
      return { success: true, message: 'Producto creado exitosamente' }
    } catch (error) {
      console.error('Error al crear producto:', error)
      return { success: false, message: error.response?.data?.error || 'Error al crear el producto' }
    }
  }, [fetchProductos])

  const updateProducto = useCallback(async (id, formData) => {
    try {
      await axios.put(`${API_URL}/api/productos/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      await fetchProductos()
      return { success: true, message: 'Producto actualizado exitosamente' }
    } catch (error) {
      console.error('Error al actualizar producto:', error)
      return { success: false, message: error.response?.data?.error || 'Error al actualizar el producto' }
    }
  }, [fetchProductos])

  const deleteProducto = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/api/productos/${id}`)
      await fetchProductos()
      return { success: true, message: 'Producto eliminado exitosamente' }
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      return { success: false, message: error.response?.data?.error || 'Error al eliminar el producto' }
    }
  }, [fetchProductos])

  return {
    productos,
    stats,
    isLoading,
    fetchProductos,
    createProducto,
    updateProducto,
    deleteProducto
  }
}