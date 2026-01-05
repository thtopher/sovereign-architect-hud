const TimeContext = ({ timeOfDay, greeting }) => {
  const contexts = {
    morning: {
      icon: '🌅',
      message: 'Begin your day with intention. Resource check and priority setting.',
      color: 'text-orange-400'
    },
    afternoon: {
      icon: '☀️',
      message: 'Mid-point recalibration. Check for False Responsibility and Intensity patterns.',
      color: 'text-yellow-400'
    },
    evening: {
      icon: '🌙',
      message: 'Integration time. Review completions and plan for Recovery.',
      color: 'text-blue-400'
    },
    night: {
      icon: '✨',
      message: 'Release phase. Choose surrender for Sovereignty restoration.',
      color: 'text-purple-400'
    }
  }

  const context = contexts[timeOfDay]

  return (
    <div className="game-panel p-3 bg-opacity-50 border-game-gold border-opacity-30">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{context.icon}</div>
        <div className="flex-1">
          <h2 className={`font-game text-base ${context.color} mb-0.5`}>
            {greeting}
          </h2>
          <p className="text-gray-300 text-sm">
            {context.message}
          </p>
        </div>
      </div>
    </div>
  )
}

export default TimeContext
