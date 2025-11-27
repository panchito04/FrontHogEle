// src/utils/formatters.js

export const formatCurrency = (value) => `Bs. ${parseFloat(value).toFixed(2)}`

export const formatMes = (mes) => {
  const [year, month] = mes.split('-')
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${meses[parseInt(month) - 1]} ${year}`
}

export const getTimeAgo = (fecha) => {
  const diff = Date.now() - new Date(fecha).getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`
  if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
  return 'Hace unos minutos'
}

export const getEstadoBadgeColor = (estado) => {
  const colors = {
    pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    pagado: 'bg-blue-100 text-blue-800 border-blue-300',
    entregado: 'bg-green-100 text-green-800 border-green-300',
    cancelado: 'bg-red-100 text-red-800 border-red-300'
  }
  return colors[estado] || 'bg-gray-100 text-gray-800 border-gray-300'
}