// src/components/common/Modal.jsx
import React, { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-3xl', theme = 'default' }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  // Gradients for header based on theme - Unified brand forest green
  const themeGradients = {
    default: 'from-cyan1-600 to-cyan1-700',
    success: 'from-cyan1-600 to-cyan1-700',
    info: 'from-cyan1-600 to-cyan1-700',
    warning: 'from-amber-600 to-amber-700',
    danger: 'from-red-800 to-red-900',
    payment: 'from-cyan1-600 to-cyan1-700'
  }

  const headerGradient = themeGradients[theme] || themeGradients.default

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop blur overlay */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Position Helper */}
      <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 text-center">
        <div 
          className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all duration-300 w-full ${maxWidth} animate-slide-up border border-stone-200/80`}
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${headerGradient} p-5 text-white sticky top-0 z-10 shadow-sm`}>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-serif-editorial text-xl sm:text-2xl font-normal leading-tight tracking-wide">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-stone-200 mt-1.5 text-xs sm:text-sm font-light tracking-wider leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl p-2 transition-all duration-200 focus:outline-none flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-cream-luxury">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
