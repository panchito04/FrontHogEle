// src/hooks/useProgressiveLoad.js - VERSIÓN SIMPLIFICADA

import { useState, useEffect, useCallback } from 'react'

export const useProgressiveLoad = (items, itemsPerPage = 12) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Resetear cuando cambian los items (filtros, búsqueda, etc)
  useEffect(() => {
    console.log('🔄 Reset: items cambiaron', items.length)
    setCurrentPage(1)
    setIsLoadingMore(false)
  }, [items])

  // Calcular items a mostrar
  const displayedItems = items.slice(0, currentPage * itemsPerPage)
  const hasMore = displayedItems.length < items.length

  // Cargar más items
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) {
      console.log('🚫 loadMore bloqueado:', { isLoadingMore, hasMore })
      return
    }

    console.log('📦 Iniciando carga...', {
      paginaActual: currentPage,
      itemsPerPage,
      totalItems: items.length,
      mostrados: displayedItems.length
    })

    setIsLoadingMore(true)
    
    // Simular delay para suavizar la experiencia
    setTimeout(() => {
      setCurrentPage(prev => {
        const nextPage = prev + 1
        console.log('✅ Página cargada:', nextPage)
        return nextPage
      })
      setIsLoadingMore(false)
    }, 150)
  }, [isLoadingMore, hasMore, currentPage, itemsPerPage, items.length, displayedItems.length])

  // Auto-cargar si hay pocos items y la pantalla es grande
  useEffect(() => {
    if (displayedItems.length > 0 && displayedItems.length < 20 && hasMore && !isLoadingMore) {
      const shouldAutoLoad = () => {
        const viewportHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        return documentHeight < viewportHeight * 1.5
      }

      if (shouldAutoLoad()) {
        console.log('📱 Pantalla grande detectada, cargando más automáticamente...')
        const timer = setTimeout(loadMore, 200)
        return () => clearTimeout(timer)
      }
    }
  }, [displayedItems.length, hasMore, isLoadingMore, loadMore])

  console.log('📊 Hook state:', {
    currentPage,
    displayedItems: displayedItems.length,
    total: items.length,
    hasMore,
    isLoadingMore
  })

  return {
    displayedItems,
    hasMore,
    isLoadingMore,
    loadMore
  }
}