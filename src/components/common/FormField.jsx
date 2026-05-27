// src/components/common/FormField.jsx
import React from 'react'

export default function FormField({ 
  label, 
  id, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  options = [], 
  rows = 3, 
  className = '', 
  disabled = false,
  error = ''
}) {
  const baseInputStyle = "block w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-cyan1-600/20 focus:border-cyan1-600 transition-all duration-300 disabled:bg-stone-50 disabled:text-stone-400 text-sm sm:text-[15px]"
  const errorInputStyle = "border-red-300 focus:ring-red-500/20 focus:border-red-500"

  const finalInputStyle = `${baseInputStyle} ${error ? errorInputStyle : ''} ${className}`

  return (
    <div className="space-y-1.5 w-full text-left">
      {label && (
        <label htmlFor={id} className="block text-[11px] font-semibold text-stone-600 tracking-wider uppercase">
          {label} {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}
      
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows}
            disabled={disabled}
            className={finalInputStyle}
          />
        ) : type === 'select' ? (
          <select
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`${finalInputStyle} bg-white`}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={finalInputStyle}
          />
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 mt-1 font-light tracking-wide">{error}</p>
      )}
    </div>
  )
}
