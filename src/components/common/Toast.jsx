// src/components/common/Toast.jsx
import React, { useEffect } from 'react'

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const types = {
    success: {
      // Sage/Forest green
      bg: 'bg-[#234c48] border border-[#35c3a8]/20',
      icon: (
        <svg className="w-5 h-5 text-[#35c3a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    error: {
      // Matte terracota
      bg: 'bg-[#402422] border border-[#d97c75]/20',
      icon: (
        <svg className="w-5 h-5 text-[#d97c75]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    warning: {
      // Muted matte gold
      bg: 'bg-[#423a23] border border-[#cca64c]/20',
      icon: (
        <svg className="w-5 h-5 text-[#cca64c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    info: {
      // Muted cobalt
      bg: 'bg-[#1b2b3a] border border-[#6ba4e8]/20',
      icon: (
        <svg className="w-5 h-5 text-[#6ba4e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  }

  const currentType = types[type] || types.success

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-toast-slide-up w-full max-w-sm px-4">
      <div className={`${currentType.bg} text-white rounded-2xl shadow-xl p-4 flex items-center space-x-3.5 backdrop-blur-md bg-opacity-95`}>
        <div className="flex-shrink-0 bg-white/5 p-2 rounded-xl border border-white/5 shadow-inner">
          {currentType.icon}
        </div>
        <p className="flex-1 text-[13px] sm:text-sm font-sans-premium font-light tracking-wide">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white/40 hover:text-white/80 p-1.5 rounded-lg hover:bg-white/5 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Toast