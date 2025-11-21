// src/hooks/usePreventBackNavigation.js
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const usePreventBackNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let backPressCount = 0;
    let resetTimeout;

    // Agregar una entrada al historial para interceptar
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (e) => {
      // Prevenir la navegación por defecto
      window.history.pushState(null, '', window.location.href);

      backPressCount++;

      if (backPressCount === 1) {
        // Primera vez: mostrar mensaje
        const toast = document.createElement('div');
        toast.id = 'back-toast';
        toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-slide-up';
        toast.innerHTML = `
          <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span class="font-medium">Presiona atrás nuevamente para salir</span>
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
        resetTimeout = setTimeout(() => {
          backPressCount = 0;
        }, 3000);
      } else if (backPressCount === 2) {
        // Segunda vez: permitir navegación
        backPressCount = 0;
        clearTimeout(resetTimeout);
        
        // Remover el mensaje si existe
        const toast = document.getElementById('back-toast');
        if (toast) toast.remove();

        // Navegar realmente hacia atrás
        window.history.back();
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
      clearTimeout(resetTimeout);
      const toast = document.getElementById('back-toast');
      if (toast) toast.remove();
    };
  }, [location.pathname]);
};