// src/components/home/StatsCard.jsx
import { useNavigate } from 'react-router-dom'

function StatsCard({ title, value, subtitle, icon, route, theme = 'default' }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (route) {
      navigate(route)
    }
  }

  // Define themed icon colors
  const themeStyles = {
    default: 'bg-cyan1-600/5 text-cyan1-600 border-cyan1-600/10',
    ocean: 'bg-ocean1-600/5 text-ocean1-700 border-ocean1-600/10',
    pink: 'bg-rose-500/5 text-rose-600 border-rose-500/10',
    emerald: 'bg-emerald-600/5 text-emerald-700 border-emerald-600/10'
  }

  const activeTheme = themeStyles[theme] || themeStyles.default

  return (
    <div 
      onClick={handleClick}
      className={`bg-white/90 border border-stone-200/70 rounded-2xl p-3.5 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 transform active:scale-[0.98] group overflow-hidden ${route ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className="text-[9px] sm:text-[10px] font-semibold text-stone-500 tracking-wider uppercase font-sans-premium leading-tight block">
            {title}
          </span>
          
          <h3 className="font-serif-editorial text-xl sm:text-2xl lg:text-3xl font-normal text-stone-900 tracking-wide truncate mt-1.5 mb-0.5">
            {value}
          </h3>
          
          <p className="text-stone-400 font-sans-premium text-[10px] sm:text-[11px] font-light tracking-wide truncate">
            {subtitle}
          </p>
        </div>

        {/* Premium Icon Container */}
        <div className={`p-2.5 sm:p-3 rounded-xl border flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${activeTheme}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatsCard