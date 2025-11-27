import { useState, useEffect, useRef, useCallback } from 'react'

export const useProgressiveLoad = (items, itemsPerPage = 12) => {
  const [displayedItems, setDisplayedItems] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observerRef = useRef(null)
  const loadMoreRef = useRef(null)

  // Resetear cuando cambian los items (filtros, búsqueda, etc)
  useEffect(() => {
    setDisplayedItems(items.slice(0, itemsPerPage))
    setHasMore(items.length > itemsPerPage)
  }, [items, itemsPerPage])

  // Cargar más items
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    
    // Simular delay mínimo para suavizar la carga
    setTimeout(() => {
      const currentLength = displayedItems.length
      const nextItems = items.slice(0, currentLength + itemsPerPage)
      
      setDisplayedItems(nextItems)
      setHasMore(nextItems.length < items.length)
      setIsLoadingMore(false)
    }, 100)
  }, [items, displayedItems, itemsPerPage, hasMore, isLoadingMore])

  // Intersection Observer para detectar cuando llegar al final
  useEffect(() => {
    if (!loadMoreRef.current) return

    const options = {
      root: null,
      rootMargin: '200px', // Cargar antes de llegar al final
      threshold: 0.1
    }

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !isLoadingMore) {
        loadMore()
      }
    }, options)

    observerRef.current.observe(loadMoreRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, isLoadingMore, loadMore])

  return {
    displayedItems,
    hasMore,
    isLoadingMore,
    loadMoreRef
  }
}