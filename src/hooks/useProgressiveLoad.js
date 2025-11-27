// src/hooks/useProgressiveLoad.js - VERSIÓN ROBUSTA

import { useState, useEffect, useCallback, useRef } from 'react'

export const useProgressiveLoad = (items, itemsPerPage = 12) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observerRef = useRef(null)
  const sentinelRef = useRef(null)
  const loadingRef = useRef(false)
  const mountedRef = useRef(false) // Track si el sentinel está montado

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

  // Intersection Observer - CON CALLBACK REF
  useEffect(() => {
    // Limpiar observer previo
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    // No crear observer si no hay más items o no hay items mostrados
    if (!hasMore || displayedItems.length === 0) {
      console.log('⏹️ Observer no necesario:', { hasMore, itemsLength: displayedItems.length })
      return
    }

    console.log('🔧 Configurando observer...')

    const options = {
      root: null,
      rootMargin: '300px', // Trigger 300px antes
      threshold: 0.1
    }

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        console.log('👁️ Observer callback:', {
          isIntersecting: entry.isIntersecting,
          hasMore,
          isLoading: loadingRef.current,
          intersectionRatio: entry.intersectionRatio
        })

        if (entry.isIntersecting && hasMore && !loadingRef.current) {
          console.log('🎯 ¡Trigger! Cargando más...')
          loadMore()
        }
      })
    }

    observerRef.current = new IntersectionObserver(handleIntersect, options)

    // Intentar conectar múltiples veces si es necesario
    let attempts = 0
    const maxAttempts = 10
    
    const tryConnect = () => {
      attempts++
      
      if (sentinelRef.current) {
        observerRef.current.observe(sentinelRef.current)
        console.log(`✅ Observer conectado al sentinel (intento ${attempts})`)
        mountedRef.current = true
        return true
      }
      
      if (attempts < maxAttempts) {
        console.log(`⏳ Intento ${attempts}/${maxAttempts} - Esperando sentinel...`)
        setTimeout(tryConnect, 50)
        return false
      }
      
      console.warn('⚠️ No se pudo conectar el observer después de', maxAttempts, 'intentos')
      return false
    }

    tryConnect()

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      mountedRef.current = false
    }
  }, [hasMore, displayedItems.length, loadMore])

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
        }, 400) // Más tiempo para que el DOM esté listo
        return () => clearTimeout(timer)
      }
    }
  }, [displayedItems.length, hasMore, loadMore])

  // Callback ref function - se llama cuando el elemento se monta/desmonta
  const setSentinelRef = useCallback((node) => {
    sentinelRef.current = node
    
    if (node && observerRef.current && !mountedRef.current) {
      console.log('🎯 Sentinel montado, conectando observer...')
      observerRef.current.observe(node)
      mountedRef.current = true
    }
  }, [])

  return {
    displayedItems,
    hasMore,
    isLoadingMore,
    sentinelRef: setSentinelRef, // Callback ref en lugar de objeto ref
    loadMore
  }
}