// src/hooks/useProductos.js
import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const useProductos = () => {
  const [productos, setProductos] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // ✅ FETCH PRODUCTOS - Ahora sí funciona
  const fetchProductos = async () => {
    setIsLoading(true)
    try {
      console.log('🔍 Fetching productos desde:', `${API_URL}/api/productos`)
      
      const response = await fetch(`${API_URL}/api/productos`, {
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
      console.log('📦 Productos recibidos:', result)

      if (result.success && result.data) {
        setProductos(result.data)
        return { success: true, message: 'Productos cargados' }
      } else {
        console.error('❌ Formato de respuesta inesperado:', result)
        return { success: false, message: 'Formato de respuesta inválido' }
      }
    } catch (error) {
      console.error('❌ Error al cargar productos:', error)
      setProductos([])
      return { success: false, message: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ CREAR PRODUCTO
  const createProducto = async (formData) => {
    try {
      console.log('📤 Creando producto...')
      
      const response = await fetch(`${API_URL}/api/productos`, {
        method: 'POST',
        credentials: 'include',
        body: formData // FormData se envía sin Content-Type
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Producto creado:', result)

      if (result.success) {
        await fetchProductos() // Recargar lista
      }

      return result
    } catch (error) {
      console.error('❌ Error al crear producto:', error)
      return { success: false, message: error.message }
    }
  }

  // ✅ ACTUALIZAR PRODUCTO
  const updateProducto = async (id, formData) => {
    try {
      console.log('🔄 Actualizando producto:', id)
      
      const response = await fetch(`${API_URL}/api/productos/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Producto actualizado:', result)

      if (result.success) {
        await fetchProductos() // Recargar lista
      }

      return result
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error)
      return { success: false, message: error.message }
    }
  }

  // ✅ ELIMINAR PRODUCTO
  const deleteProducto = async (id) => {
    try {
      console.log('🗑️ Eliminando producto:', id)
      
      const response = await fetch(`${API_URL}/api/productos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Producto eliminado:', result)

      if (result.success) {
        await fetchProductos() // Recargar lista
      }

      return result
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error)
      return { success: false, message: error.message }
    }
  }

  return {
    productos,
    isLoading,
    fetchProductos,
    createProducto,
    updateProducto,
    deleteProducto
  }
}