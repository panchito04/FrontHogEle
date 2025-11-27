// src/hooks/useProgressiveLoad.js

import { useState, useEffect, useRef, useCallback } from 'react'

export const useProgressiveLoad = (items, itemsPerPage = 12) => {
  const [displayedItems, setDisplayedItems] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observerRef = useRef(null)
  const loadMoreRef = useRef(null)
  const currentPageRef = useRef(1)

  // Resetear cuando cambian los items (filtros, búsqueda, etc)
  useEffect(() => {
    console.log('🔄 Reset: items cambiaron', items.length)
    currentPageRef.current = 1
    const initialItems = items.slice(0, itemsPerPage)
    setDisplayedItems(initialItems)
    setHasMore(items.length > itemsPerPage)
    setIsLoadingMore(false)
  }, [items, itemsPerPage])

  // Cargar más items - VERSIÓN CORREGIDA
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) {
      console.log('🚫 loadMore bloqueado:', { isLoadingMore, hasMore })
      return
    }

    console.log('📦 Cargando más items...', {
      currentPage: currentPageRef.current,
      itemsPerPage,
      totalItems: items.length,
      currentDisplayed: displayedItems.length
    })

    setIsLoadingMore(true)
    
    // Simular delay mínimo para suavizar la carga
    setTimeout(() => {
      const nextPage = currentPageRef.current + 1
      currentPageRef.current = nextPage
      const endIndex = nextPage * itemsPerPage
      const nextItems = items.slice(0, endIndex)
      
      console.log('✅ Items cargados:', {
        nuevaPágina: nextPage,
        itemsMostrados: nextItems.length,
        totalItems: items.length,
        quedanMás: endIndex < items.length
      })
      
      setDisplayedItems(nextItems)
      setHasMore(endIndex < items.length)
      setIsLoadingMore(false)
    }, 150)
  }, [items, itemsPerPage, isLoadingMore, hasMore, displayedItems.length])

  // Intersection Observer para detectar cuando llegar al final
  useEffect(() => {
    // Limpiar observer anterior
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    if (!loadMoreRef.current || !hasMore) {
      console.log('⚠️ Observer no iniciado:', { hasRef: !!loadMoreRef.current, hasMore })
      return
    }

    const options = {
      root: null,
      rootMargin: '400px', // Cargar mucho antes de llegar al final
      threshold: 0
    }

    const callback = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !isLoadingMore) {
        console.log('👀 Observer detectó elemento visible, cargando más...')
        loadMore()
      }
    }

    observerRef.current = new IntersectionObserver(callback, options)
    
    // Pequeño delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(() => {
      if (loadMoreRef.current) {
        observerRef.current.observe(loadMoreRef.current)
        console.log('👀 Observer activado correctamente')
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, isLoadingMore, loadMore])

  // Auto-cargar si hay pocos items y la pantalla es grande
  useEffect(() => {
    if (displayedItems.length > 0 && displayedItems.length < 20 && hasMore && !isLoadingMore) {
      // Verificar si el usuario tiene una pantalla grande que puede mostrar más items
      const shouldAutoLoad = () => {
        const viewportHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        // Si la página es muy corta, cargar más automáticamente
        return documentHeight < viewportHeight * 1.5
      }

      if (shouldAutoLoad()) {
        console.log('📱 Pantalla grande detectada, cargando más productos automáticamente...')
        const timer = setTimeout(() => {
          loadMore()
        }, 200)
        return () => clearTimeout(timer)
      }
    }
  }, [displayedItems.length, hasMore, isLoadingMore, loadMore])

  return {
    displayedItems,
    hasMore,
    isLoadingMore,
    loadMoreRef,
    loadMore // Exportar para cargar manualmente si es necesario
  }
}