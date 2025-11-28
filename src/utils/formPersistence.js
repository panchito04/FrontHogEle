// ========================================
// utils/formPersistence.js
// ========================================
export const saveFormData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error al guardar datos:', error)
  }
}

export const loadFormData = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error al cargar datos:', error)
    return null
  }
}

export const clearFormData = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error al limpiar datos:', error)
  }
}