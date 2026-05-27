// src/components/common/PageHeader.jsx
import React from 'react'

export default function PageHeader({ title, description, actions = [] }) {
  return (
    <div className="bg-white/75 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-20">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Title & Subtitle */}
          <div className="min-w-0 flex-1">
            <h1 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-stone-900 tracking-wide">
              {title}
            </h1>
            {description && (
              <p className="text-stone-500 mt-1 text-xs sm:text-sm font-light tracking-wide">
                {description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {actions && actions.length > 0 && (
            <div className="flex flex-wrap gap-2.5 sm:justify-end">
              {actions.map((action, index) => {
                const isPrimary = action.variant === 'primary'
                const isSuccess = action.variant === 'success'
                const isSecondary = action.variant === 'secondary' || !action.variant

                let styleClass = ''
                if (isPrimary) {
                  styleClass = 'bg-cyan1-600 hover:bg-cyan1-700 text-white shadow-md shadow-cyan1-600/10 hover:shadow-cyan1-600/20'
                } else if (isSuccess) {
                  styleClass = 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md hover:from-green-700 hover:to-emerald-700'
                } else if (isSecondary) {
                  styleClass = 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }

                return (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-medium tracking-wide transition-all duration-300 flex items-center justify-center space-x-2 text-xs sm:text-sm transform active:scale-[0.98] ${styleClass}`}
                  >
                    {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
                    <span>{action.label}</span>
                  </button>
                )
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
