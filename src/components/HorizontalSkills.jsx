import { useState, useEffect } from 'react'

const HorizontalSkills = ({ sovereignty, setSovereignty }) => {
  const [cooldowns, setCooldowns] = useState({})
  const [notification, setNotification] = useState(null)

  const skills = [
    {
      id: 'gordian_cut',
      name: 'Gordian Cut',
      icon: '🗡️',
      cost: 5,
      cooldown: 30,
      color: 'border-game-gold',
      bgColor: 'bg-blue-900',
      bgGradient: 'from-blue-900 to-blue-800',
      effect: 'Cut complexity',
      impact: () => 'Pattern Recognition +15%'
    },
    {
      id: 'decisive_intervention',
      name: 'Decisive Intervention',
      icon: '⚡',
      cost: 15,
      cooldown: 60,
      color: 'border-game-gold',
      bgColor: 'bg-orange-900',
      bgGradient: 'from-orange-900 to-orange-800',
      effect: 'Force movement',
      impact: () => 'Agency +30%'
    },
    {
      id: 'galvanic_surge',
      name: 'Galvanic Surge',
      icon: '🔥',
      cost: 25,
      cooldown: 90,
      color: 'border-game-gold',
      bgColor: 'bg-red-900',
      bgGradient: 'from-red-900 to-red-800',
      effect: 'Rally others',
      impact: () => 'Team +30%, You -25%'
    },
    {
      id: 'sovereign_yield',
      name: 'Sovereign Yield',
      icon: '🌊',
      cost: 0,
      cooldown: 120,
      color: 'border-game-gold',
      bgColor: 'bg-cyan-900',
      bgGradient: 'from-cyan-900 to-cyan-800',
      effect: 'Restore',
      impact: () => '+40% Sovereignty'
    },
    {
      id: 'walling',
      name: 'Walling',
      icon: '🛡️',
      cost: 5,
      cooldown: 20,
      color: 'border-game-gold',
      bgColor: 'bg-green-900',
      bgGradient: 'from-green-900 to-green-800',
      effect: 'Set boundary',
      impact: () => 'Clear burden +10%'
    }
  ]

  const activateSkill = (skill) => {
    if (cooldowns[skill.id]) {
      setNotification({
        type: 'error',
        message: `${skill.name} on cooldown!`,
        icon: '⏳'
      })
      setTimeout(() => setNotification(null), 2000)
      return
    }

    if (skill.id !== 'sovereign_yield' && sovereignty < skill.cost) {
      setNotification({
        type: 'error',
        message: 'Insufficient Sovereignty!',
        icon: '⚠️'
      })
      setTimeout(() => setNotification(null), 2000)
      return
    }

    // Apply effects
    if (skill.id === 'sovereign_yield') {
      setSovereignty(Math.min(100, sovereignty + 40))
    } else if (skill.id === 'walling') {
      setSovereignty(Math.min(100, sovereignty + 10 - skill.cost))
    } else if (skill.id === 'galvanic_surge') {
      setSovereignty(Math.max(0, sovereignty - skill.cost))
    } else {
      setSovereignty(Math.max(0, sovereignty - skill.cost))
    }

    setNotification({
      type: 'success',
      message: skill.impact(),
      icon: skill.icon
    })

    setCooldowns({ ...cooldowns, [skill.id]: skill.cooldown })
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((key) => {
          if (updated[key] > 0) {
            updated[key] -= 1
          } else {
            delete updated[key]
          }
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="game-panel p-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-game text-xs text-game-gold">ACTIVE SKILLS</h3>
        {notification && (
          <div className={`
            px-2 py-0.5 rounded border text-[9px] font-bold flex items-center gap-1
            ${notification.type === 'success'
              ? 'bg-game-green bg-opacity-20 border-game-green text-game-green'
              : 'bg-game-red bg-opacity-20 border-game-red text-game-red'}
          `}>
            <span className="text-xs">{notification.icon}</span>
            <span>{notification.message}</span>
          </div>
        )}
      </div>

      {/* Horizontal Skill Bar - MTG Card Style */}
      <div className="flex gap-2">
        {skills.map((skill) => {
          const onCooldown = cooldowns[skill.id]
          const canUse = !onCooldown && (skill.id === 'sovereign_yield' || sovereignty >= skill.cost)

          return (
            <button
              key={skill.id}
              onClick={() => activateSkill(skill)}
              disabled={!canUse}
              className={`
                relative p-2 rounded-lg border-2 flex-1 text-center transition-all flex flex-col items-center justify-center
                shadow-lg bg-gradient-to-b
                ${canUse
                  ? `${skill.bgGradient} ${skill.color} hover:scale-105 hover:shadow-2xl hover:border-yellow-400 cursor-pointer active:scale-95`
                  : 'bg-gray-800 border-gray-600 opacity-50 cursor-not-allowed'}
              `}
              style={{ minHeight: '90px' }}
            >
              {/* Icon - smaller */}
              <div className="text-lg mb-1">{skill.icon}</div>

              {/* Name - MUCH BIGGER, ALL CAPS */}
              <div className="text-sm font-black text-white leading-tight tracking-wide uppercase mb-1">
                {skill.name}
              </div>

              {/* Cost/Effect */}
              <div className="text-[9px] font-bold text-white text-opacity-80">
                {skill.id === 'sovereign_yield' ? '+40%' : `-${skill.cost}%`}
              </div>

              {/* Cooldown overlay */}
              {onCooldown && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 rounded-lg border-2 border-game-red">
                  <span className="text-lg font-bold text-game-red">{onCooldown}s</span>
                </div>
              )}

              {/* Cooldown progress bar */}
              {onCooldown && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-50 rounded-b-lg overflow-hidden">
                  <div
                    className="h-full bg-game-gold transition-all"
                    style={{
                      width: `${((skill.cooldown - onCooldown) / skill.cooldown) * 100}%`
                    }}
                  />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default HorizontalSkills
