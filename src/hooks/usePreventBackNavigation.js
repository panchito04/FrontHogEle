// src/hooks/usePreventBackNavigation.js
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const usePreventBackNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const backPressCount = useRef(0);
  const resetTimeout = useRef(null);
  const isNavigating = useRef(false);

  useEffect(() => {
    // Reset el contador cuando cambia la ruta
    backPressCount.current = 0;
    isNavigating.current = false;

    const handlePopState = (e) => {
      // Si ya estamos navegando, no hacer nada
      if (isNavigating.current) {
        return;
      }

      // Prevenir la navegación por defecto
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);

      backPressCount.current++;

      if (backPressCount.current === 1) {
        // Primera vez: mostrar mensaje
        const existingToast = document.getElementById('back-toast');
        if (existingToast) {
          existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.id = 'back-toast';
        toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] flex items-center space-x-2 animate-toast-slide-up';
        toast.innerHTML = `
          <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span class="font-medium">Presiona atrás nuevamente para volver</span>
        `;
        
        document.body.appendChild(toast);

        // Remover el mensaje después de 3 segundos
        setTimeout(() => {
          const existingToast = document.getElementById('back-toast');
          if (existingToast) {
            existingToast.remove();
          }
        }, 3000);

        // Reset el contador después de 3 segundos
        if (resetTimeout.current) {
          clearTimeout(resetTimeout.current);
        }
        resetTimeout.current = setTimeout(() => {
          backPressCount.current = 0;
        }, 3000);

      } else if (backPressCount.current === 2) {
        // Segunda vez: navegar hacia atrás
        backPressCount.current = 0;
        isNavigating.current = true;
        
        if (resetTimeout.current) {
          clearTimeout(resetTimeout.current);
        }
        
        // Remover el mensaje si existe
        const toast = document.getElementById('back-toast');
        if (toast) toast.remove();

        // Navegar hacia atrás dentro de la aplicación
        setTimeout(() => {
          navigate(-1);
        }, 100);
      }
    };

    // Agregar entrada al historial después de un momento
    const timeoutId = setTimeout(() => {
      window.history.pushState(null, '', window.location.href);
    }, 100);

    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('popstate', handlePopState);
      if (resetTimeout.current) {
        clearTimeout(resetTimeout.current);
      }
      const toast = document.getElementById('back-toast');
      if (toast) toast.remove();
    };
  }, [location.pathname, navigate]);
};