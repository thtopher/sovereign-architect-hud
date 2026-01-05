import { useState } from 'react'

const LoopStatus = () => {
  const [currentPhase, setCurrentPhase] = useState(2)

  const phases = [
    { name: 'Knowledge', icon: '📚', color: 'text-blue-400' },
    { name: 'Observation', icon: '👁️', color: 'text-purple-400' },
    { name: 'Pattern Recognition', icon: '🧠', color: 'text-pink-400' },
    { name: 'Creation', icon: '⚡', color: 'text-yellow-400' },
    { name: 'Deployment', icon: '🚀', color: 'text-green-400' },
    { name: 'Release', icon: '🌊', color: 'text-cyan-400' },
    { name: 'Reconstitution', icon: '🔄', color: 'text-orange-400' }
  ]

  const daysSinceRelease = 2 // This could be dynamic

  return (
    <div className="game-panel p-3">
      <h3 className="font-game text-base text-game-gold mb-2">IDENTITY LOOP</h3>

      <div className="space-y-1 mb-3">
        {phases.map((phase, index) => (
          <div
            key={phase.name}
            className={`
              flex items-center gap-2 p-1.5 rounded transition-all
              ${index === currentPhase
                ? 'bg-game-gold bg-opacity-20 border-l-2 border-game-gold'
                : 'opacity-40'
              }
            `}
          >
            <span className="text-base">{phase.icon}</span>
            <span className={`text-sm font-bold ${index === currentPhase ? phase.color : 'text-gray-500'}`}>
              {phase.name}
            </span>
            {index === currentPhase && (
              <span className="ml-auto text-[10px] text-game-gold animate-pulse">
                ●
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Warning if Release is overdue */}
      {daysSinceRelease >= 3 && (
        <div className="bg-game-red bg-opacity-20 border border-game-red rounded p-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚠️</span>
            <div>
              <div className="text-xs font-bold text-game-red">RELEASE OVERDUE</div>
              <div className="text-[10px] text-gray-400">
                {daysSinceRelease} days ago
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400">
        <div className="flex justify-between mb-0.5">
          <span>Status:</span>
          <span className="text-game-green font-bold">HEALTHY</span>
        </div>
        <div className="flex justify-between">
          <span>Last Release:</span>
          <span className="text-gray-300">{daysSinceRelease}d ago</span>
        </div>
      </div>

      {/* Phase Selector (for demo) - Compact */}
      <div className="mt-2 pt-2 border-t border-game-border">
        <select
          value={currentPhase}
          onChange={(e) => setCurrentPhase(parseInt(e.target.value))}
          className="w-full bg-game-darker border border-game-border rounded px-2 py-1 text-[10px] text-gray-400"
        >
          {phases.map((phase, index) => (
            <option key={index} value={index}>
              {phase.icon} {phase.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default LoopStatus
