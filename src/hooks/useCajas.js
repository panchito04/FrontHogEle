// src/hooks/useCajas.js
import { useState, useCallback } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const useCajas = () => {
  const [cajas, setCajas] = useState([])

  const fetchCajas = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cajas`)
      setCajas(response.data)
      return { success: true }
    } catch (error) {
      console.error('Error al obtener cajas:', error)
      return { success: false, message: 'Error al cargar las cajas' }
    }
  }, [])

  const createCaja = useCallback(async (cajaData) => {
    try {
      await axios.post(`${API_URL}/api/cajas`, cajaData)
      await fetchCajas()
      return { success: true, message: 'Caja creada exitosamente' }
    } catch (error) {
      console.error('Error al crear caja:', error)
      return { success: false, message: error.response?.data?.error || 'Error al crear la caja' }
    }
  }, [fetchCajas])

  const updateCaja = useCallback(async (id, cajaData) => {
    try {
      await axios.put(`${API_URL}/api/cajas/${id}`, cajaData)
      await fetchCajas()
      return { success: true, message: 'Caja actualizada exitosamente' }
    } catch (error) {
      console.error('Error al actualizar caja:', error)
      return { success: false, message: error.response?.data?.error || 'Error al actualizar la caja' }
    }
  }, [fetchCajas])

  const deleteCaja = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/api/cajas/${id}`)
      await fetchCajas()
      return { success: true, message: 'Caja eliminada exitosamente' }
    } catch (error) {
      console.error('Error al eliminar caja:', error)
      return { success: false, message: error.response?.data?.error || 'Error al eliminar la caja' }
    }
  }, [fetchCajas])

  const getCajaDetail = useCallback(async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/cajas/${id}`)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error al obtener detalles de caja:', error)
      return { success: false, message: 'Error al cargar los detalles de la caja' }
    }
  }, [])

  return {
    cajas,
    fetchCajas,
    createCaja,
    updateCaja,
    deleteCaja,
    getCajaDetail
  }
}