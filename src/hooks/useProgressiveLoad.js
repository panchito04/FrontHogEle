// src/hooks/useProgressiveLoad.js - CON SCROLL AUTOMÁTICO

import { useState, useEffect, useCallback, useRef } from 'react'

export const useProgressiveLoad = (items, itemsPerPage = 12) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observerRef = useRef(null)
  const sentinelRef = useRef(null)
  const loadingRef = useRef(false) // Prevenir múltiples cargas simultáneas

  // Resetear cuando cambian los items
  useEffect(() => {
    console.log('🔄 Reset: items cambiaron', items.length)
    setCurrentPage(1)
    setIsLoadingMore(false)
    loadingRef.current = false
  }, [items])

  // Calcular items a mostrar
  const displayedItems = items.slice(0, currentPage * itemsPerPage)
  const hasMore = displayedItems.length < items.length

  // Función de carga
  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) {
      console.log('🚫 loadMore bloqueado:', { loading: loadingRef.current, hasMore })
      return
    }

    console.log('📦 Iniciando carga automática...', {
      paginaActual: currentPage,
      itemsPerPage,
      totalItems: items.length,
      mostrados: displayedItems.length
    })

    loadingRef.current = true
    setIsLoadingMore(true)
    
    setTimeout(() => {
      setCurrentPage(prev => {
        const nextPage = prev + 1
        console.log('✅ Página cargada:', nextPage)
        return nextPage
      })
      setIsLoadingMore(false)
      loadingRef.current = false
    }, 300)
  }, [hasMore, currentPage, itemsPerPage, items.length, displayedItems.length])

  // Intersection Observer - MEJORADO
  useEffect(() => {
    // Limpiar observer previo
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    // No crear observer si no hay más items
    if (!hasMore) {
      console.log('⏹️ No hay más items, observer no necesario')
      return
    }

    // Crear nuevo observer
    const options = {
      root: null,
      rootMargin: '200px', // Trigger 200px antes del final
      threshold: 0.1
    }

    const handleIntersect = (entries) => {
      const [entry] = entries
      
      console.log('👁️ Observer callback:', {
        isIntersecting: entry.isIntersecting,
        hasMore,
        isLoading: loadingRef.current
      })

      if (entry.isIntersecting && hasMore && !loadingRef.current) {
        console.log('🎯 ¡Trigger! Cargando más...')
        loadMore()
      }
    }

    observerRef.current = new IntersectionObserver(handleIntersect, options)

    // Conectar al elemento sentinel cuando esté listo
    const connectObserver = () => {
      if (sentinelRef.current && observerRef.current) {
        observerRef.current.observe(sentinelRef.current)
        console.log('✅ Observer conectado al sentinel')
        return true
      }
      return false
    }

    // Intentar conectar inmediatamente
    if (!connectObserver()) {
      // Si no está listo, intentar en el siguiente tick
      const timeoutId = setTimeout(() => {
        if (connectObserver()) {
          console.log('✅ Observer conectado (delayed)')
        } else {
          console.warn('⚠️ No se pudo conectar el observer')
        }
      }, 100)

      return () => {
        clearTimeout(timeoutId)
        if (observerRef.current) {
          observerRef.current.disconnect()
        }
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loadMore])

  // Auto-cargar para pantallas grandes
  useEffect(() => {
    if (displayedItems.length > 0 && displayedItems.length < 20 && hasMore && !loadingRef.current) {
      const shouldAutoLoad = () => {
        const viewportHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        return documentHeight < viewportHeight * 1.5
      }

      if (shouldAutoLoad()) {
        console.log('📱 Pantalla grande detectada, auto-cargando...')
        const timer = setTimeout(() => {
          if (!loadingRef.current) {
            loadMore()
          }
        }, 200)
        return () => clearTimeout(timer)
      }
    }
  }, [displayedItems.length, hasMore, loadMore])

  return {
    displayedItems,
    hasMore,
    isLoadingMore,
    sentinelRef, // Este ref debe conectarse al elemento visible
    loadMore // Para uso manual si es necesario
  }
}