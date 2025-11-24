// src/hooks/useCategorias.js
import { useState, useCallback } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const useCategorias = () => {
  const [categorias, setCategorias] = useState([])

  const fetchCategorias = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categorias`)
      setCategorias(response.data)
      return { success: true }
    } catch (error) {
      console.error('Error al obtener categorías:', error)
      return { success: false, message: 'Error al cargar las categorías' }
    }
  }, [])

  const createCategoria = useCallback(async (categoriaData) => {
    try {
      await axios.post(`${API_URL}/api/categorias`, categoriaData)
      await fetchCategorias()
      return { success: true, message: 'Categoría creada exitosamente' }
    } catch (error) {
      console.error('Error al crear categoría:', error)
      return { success: false, message: error.response?.data?.error || 'Error al crear la categoría' }
    }
  }, [fetchCategorias])

  return {
    categorias,
    fetchCategorias,
    createCategoria
  }
}