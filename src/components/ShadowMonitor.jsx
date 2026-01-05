import { useState } from 'react'

const ShadowMonitor = () => {
  const [shadows, setShadows] = useState([
    {
      name: 'Over-Control State',
      icon: '🔒',
      active: false,
      antidote: 'Intentional Release - Use Sovereign Yield skill, force surrender'
    },
    {
      name: 'Isolation Spiral',
      icon: '🏝️',
      active: false,
      antidote: 'Deliberate Connection - Reach out to someone, break the spiral'
    },
    {
      name: 'Intensity Addiction',
      icon: '⚡',
      active: false,
      antidote: 'Redirect to Depth - Use Gordian Cut on complex problem, not drama'
    },
    {
      name: 'False Responsibility Drain',
      icon: '⚠️',
      active: true,
      antidote: 'Walling - Name what is NOT yours and put it down'
    }
  ])

  const toggleShadow = (index) => {
    const newShadows = [...shadows]
    newShadows[index].active = !newShadows[index].active
    setShadows(newShadows)
  }

  const activeShadowCount = shadows.filter(s => s.active).length

  return (
    <div className="game-panel p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-game text-base text-game-gold">SHADOW MECHANICS</h3>
        {activeShadowCount > 0 && (
          <span className="px-2 py-1 bg-game-red text-white text-xs font-bold rounded animate-pulse">
            {activeShadowCount} ACTIVE
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {shadows.map((shadow, index) => (
          <div
            key={shadow.name}
            className={`
              p-3 rounded border transition-all cursor-pointer
              ${shadow.active
                ? 'bg-game-red bg-opacity-20 border-game-red'
                : 'bg-game-darker border-game-border'
              }
            `}
            onClick={() => toggleShadow(index)}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-base">{shadow.icon}</span>
                <span className={`text-sm font-bold ${shadow.active ? 'text-game-red' : 'text-gray-300'}`}>
                  {shadow.name}
                </span>
              </div>
              <div className={`
                w-3 h-3 rounded-full
                ${shadow.active ? 'bg-game-red animate-pulse' : 'bg-gray-600'}
              `} />
            </div>

            {shadow.active && (
              <div className="mt-2 pt-2 border-t border-game-red border-opacity-30">
                <div className="flex items-start gap-1.5">
                  <span className="text-game-gold text-[10px] font-bold mt-0.5">ANTIDOTE:</span>
                  <span className="text-[10px] text-gray-300 italic">
                    {shadow.antidote}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {activeShadowCount === 0 && (
        <div className="bg-game-green bg-opacity-10 border border-game-green rounded p-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">✓</span>
            <span className="text-xs font-bold text-game-green">All Clear</span>
          </div>
        </div>
      )}

      {activeShadowCount >= 2 && (
        <div className="bg-game-red bg-opacity-20 border border-game-red rounded p-2 mt-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">🚨</span>
            <span className="text-xs font-bold text-game-red">CRITICAL - MULTIPLE SHADOWS</span>
          </div>
          <p className="text-[10px] text-gray-400">
            Apply all antidotes shown above. Start with highest priority.
          </p>
        </div>
      )}

      {activeShadowCount === 1 && (
        <div className="bg-yellow-900 bg-opacity-20 border border-yellow-600 rounded p-2 mt-2">
          <p className="text-[10px] text-gray-400">
            Shadow detected. Apply antidote before it compounds.
          </p>
        </div>
      )}

      <div className="mt-2 text-[10px] text-gray-600 italic">
        Click to toggle • Shadows are signals
      </div>
    </div>
  )
}

export default ShadowMonitor
