import { Sunrise, Sun, Moon, Stars } from 'lucide-react'

const TimeContext = ({ timeOfDay, greeting }) => {
  const contexts = {
    morning: {
      Icon: Sunrise,
      message: 'Begin your day with intention. Resource check and priority setting.'
    },
    afternoon: {
      Icon: Sun,
      message: 'Mid-point recalibration. Check for False Responsibility and Intensity patterns.'
    },
    evening: {
      Icon: Moon,
      message: 'Integration time. Review completions and plan for Recovery.'
    },
    night: {
      Icon: Stars,
      message: 'Release phase. Choose surrender for Sovereignty restoration.'
    }
  }

  const context = contexts[timeOfDay]
  const IconComponent = context.Icon

  return (
    <div className="game-panel p-3 border-zinc-600">
      <div className="flex items-center gap-3">
        <IconComponent className="w-7 h-7 text-game-gold" strokeWidth={1.5} />
        <div className="flex-1">
          <h2 className="font-game text-base text-game-gold mb-0.5">
            {greeting}
          </h2>
          <p className="text-game-text-muted text-sm">
            {context.message}
          </p>
        </div>
      </div>
    </div>
  )
}

export default TimeContext
