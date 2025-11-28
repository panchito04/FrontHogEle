// src/hooks/useProductos.js
import { useState } from 'react'

export const useProductos = () => {
  const [productos, setProductos] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchProductos = async () => {
    // ... tu código
  }

  const createProducto = async (formData) => {
    try {
      const response = await fetch('/api/productos', {
        method: 'POST',
        body: formData // FormData se envía sin Content-Type
      })
      
      const result = await response.json()
      
      if (result.success) {
        await fetchProductos() // Recargar lista
      }
      
      return result
    } catch (error) {
      return { success: false, message: 'Error al crear producto' }
    }
  }

  const updateProducto = async (id, formData) => {
    // ... tu código
  }

  const deleteProducto = async (id) => {
    // ... tu código
  }

  return {
    productos,
    isLoading,
    fetchProductos,
    createProducto, // ⚠️ ASEGÚRATE DE RETORNAR ESTA FUNCIÓN
    updateProducto,
    deleteProducto
  }
}