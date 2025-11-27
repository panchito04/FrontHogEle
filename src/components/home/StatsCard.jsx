// src/components/home/StatsCard.jsx
import { useNavigate } from 'react-router-dom'

function StatsCard({ title, value, subtitle, icon, gradient, route }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (route) {
      navigate(route)
    }
  }

  return (
    <div 
      onClick={handleClick}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl ${route ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wide">{title}</p>
          </div>
          <h3 className="text-4xl font-bold mb-1">{value}</h3>
          <p className="text-white/70 text-xs">{subtitle}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatsCard