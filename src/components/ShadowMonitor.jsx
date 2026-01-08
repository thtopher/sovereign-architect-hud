import { useState } from 'react'
import { Lock, UserX, Zap, Weight } from 'lucide-react'

const shadowDefinitions = [
  {
    id: 'over_control',
    name: 'Over-Control State',
    Icon: Lock,
    intensity: null,
    antidote: 'Intentional Release - Use Sovereign Yield skill, force surrender',
    description: 'Triggered by threat perception or exhaustion. The Protector takes over and grips tighter on everything.',
    trigger: 'Perceived threat, exhaustion, situations that feel out of control',
    intensityGuide: {
      low: 'Micromanaging details you\'d normally delegate. Checking things twice.',
      med: 'Rigidity spreading across multiple domains. Difficulty hearing alternatives or feedback.',
      high: 'Full lockdown mode. Everything feels like existential threat. Cannot release anything.'
    }
  },
  {
    id: 'isolation_spiral',
    name: 'Isolation Spiral',
    Icon: UserX,
    intensity: null,
    antidote: 'Deliberate Connection - Reach out to someone, break the spiral',
    description: 'Triggered by being misunderstood or misread. Withdrawal becomes the only safe response.',
    trigger: 'Being misunderstood, feeling unseen, having to explain yourself repeatedly',
    intensityGuide: {
      low: 'Declining social invitations. Preferring to work alone.',
      med: 'Active avoidance of people who could help. Resentment building. "No one gets it."',
      high: 'Complete withdrawal. Convinced isolation is the only safe state. Refusing all support.'
    }
  },
  {
    id: 'intensity_addiction',
    name: 'Intensity Addiction',
    Icon: Zap,
    intensity: null,
    antidote: 'Redirect to Depth - Use Gordian Cut on complex problem, not drama',
    description: 'Triggered by boredom or stability. The system seeks chaos because calm feels like death.',
    trigger: 'Extended calm, absence of crisis, stability that feels meaningless',
    intensityGuide: {
      low: 'Restlessness. Picking small fights. Seeking stimulation.',
      med: 'Manufacturing urgency. Collecting commitments that create synthetic crisis.',
      high: 'Full rapids-seeking. Stability feels like death. Only chaos feels alive.'
    }
  },
  {
    id: 'false_responsibility',
    name: 'False Responsibility Drain',
    Icon: Weight,
    intensity: null,
    antidote: 'Walling - Name what is NOT yours and put it down',
    description: 'Triggered by others\' inertia or helplessness. You pick up what isn\'t yours to carry.',
    trigger: 'Others\' helplessness, systems failing, inertia you feel compelled to overcome',
    intensityGuide: {
      low: 'Taking on a few tasks that should belong to others.',
      med: 'Systematic over-functioning. Becoming the default problem-solver for everyone.',
      high: 'Complete collapse of boundaries. Can\'t distinguish your work from others\'. Resentment overwhelming.'
    }
  }
]

const ShadowMonitor = ({ onShadowChange, initialShadows = {} }) => {
  // Merge initial shadows from onboarding into shadow definitions
  const [shadows, setShadows] = useState(() =>
    shadowDefinitions.map(shadow => ({
      ...shadow,
      intensity: initialShadows[shadow.id] || null
    }))
  )
  const [activeTooltip, setActiveTooltip] = useState(null)

  // Sophisticated muted red scale for shadows
  const intensityColors = {
    low: 'bg-zinc-800 hover:bg-zinc-700',
    med: 'bg-zinc-600 hover:bg-zinc-500',
    high: 'bg-rose-700 hover:bg-rose-600'
  }

  const toggleIntensity = (index, level) => {
    const newShadows = [...shadows]
    const shadow = newShadows[index]
    const previousIntensity = shadow.intensity

    // If clicking the same level, toggle it off
    if (shadow.intensity === level) {
      newShadows[index].intensity = null
    } else {
      newShadows[index].intensity = level
    }
    setShadows(newShadows)

    // Log the change
    if (onShadowChange) {
      onShadowChange(shadow.id, newShadows[index].intensity, previousIntensity)
    }
  }

  const activeShadows = shadows.filter(s => s.intensity !== null)
  const activeShadowCount = activeShadows.length
  const hasHighIntensity = activeShadows.some(s => s.intensity === 'high')

  return (
    <div className="game-panel p-3 relative">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-game text-base text-game-gold">SHADOW MECHANICS</h3>
        {activeShadowCount > 0 && (
          <span className={`px-2 py-1 text-white text-xs font-bold rounded animate-pulse ${hasHighIntensity ? 'bg-game-red' : 'bg-yellow-600'}`}>
            {activeShadowCount} ACTIVE
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {shadows.map((shadow, index) => {
          const isActive = shadow.intensity !== null

          return (
            <div
              key={shadow.id}
              className={`
                p-2 rounded border transition-all
                ${isActive
                  ? 'bg-game-red bg-opacity-10 border-game-red'
                  : 'bg-game-darker border-game-border'
                }
              `}
            >
              <button
                className="flex items-center justify-between mb-2 w-full text-left hover:bg-white hover:bg-opacity-5 rounded p-1 -m-1 transition-all"
                onClick={() => setActiveTooltip(activeTooltip === shadow.id ? null : shadow.id)}
              >
                <div className="flex items-center gap-2">
                  <shadow.Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-game-text-muted'}`} strokeWidth={1.5} />
                  <div>
                    <span className={`text-xs font-bold ${isActive ? 'text-rose-400' : 'text-game-text'}`}>
                      {shadow.name}
                    </span>
                    <div className="text-[8px] text-game-text-dim">tap for info</div>
                  </div>
                </div>
              </button>

              {/* Intensity buttons - three equal sections */}
              <div className="flex h-6 rounded overflow-hidden border border-zinc-700">
                {['low', 'med', 'high'].map((level) => (
                  <button
                    key={level}
                    onClick={() => toggleIntensity(index, level)}
                    className={`
                      flex-1 text-[8px] font-semibold uppercase transition-all
                      ${shadow.intensity === level
                        ? `${intensityColors[level]} ring-1 ring-white ring-opacity-30`
                        : 'bg-zinc-800 hover:bg-zinc-700'}
                      cursor-pointer active:scale-95
                      ${level !== 'high' ? 'border-r border-zinc-700' : ''}
                    `}
                  >
                    <span className={`${shadow.intensity === level && level === 'high' ? 'text-white' : shadow.intensity === level ? 'text-game-text' : 'text-game-text-muted'}`}>
                      {level}
                    </span>
                  </button>
                ))}
              </div>

              {isActive && (
                <div className="mt-2 pt-2 border-t border-game-red border-opacity-30">
                  <div className="flex items-start gap-1.5">
                    <span className="text-game-gold text-[10px] font-bold mt-0.5">ANTIDOTE:</span>
                    <span className="text-[10px] text-game-text italic">
                      {shadow.antidote}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {activeShadowCount === 0 && (
        <div className="bg-zinc-800 border border-zinc-600 rounded p-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-medium text-game-text-muted">All Clear</span>
          </div>
        </div>
      )}

      {hasHighIntensity && (
        <div className="bg-rose-950 bg-opacity-50 border border-rose-700 rounded p-2 mt-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-rose-400">HIGH INTENSITY SHADOW</span>
          </div>
          <p className="text-[10px] text-game-text-muted">
            Apply antidote immediately. High intensity shadows compound rapidly.
          </p>
        </div>
      )}

      {activeShadowCount >= 2 && !hasHighIntensity && (
        <div className="bg-amber-950 bg-opacity-30 border border-amber-700 border-opacity-50 rounded p-2 mt-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-xs font-semibold text-amber-400">MULTIPLE SHADOWS</span>
          </div>
          <p className="text-[10px] text-game-text-muted">
            Apply antidotes before they compound.
          </p>
        </div>
      )}

      {activeShadowCount === 1 && !hasHighIntensity && (
        <div className="bg-zinc-800 border border-zinc-600 rounded p-2 mt-2">
          <p className="text-[10px] text-game-text-muted">
            Shadow detected. Apply antidote before it compounds.
          </p>
        </div>
      )}

      <div className="mt-2 text-[10px] text-game-text-dim">
        Select intensity level
      </div>

      {/* Tooltip Overlay */}
      {activeTooltip && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 rounded-lg"
          onClick={() => setActiveTooltip(null)}
        >
          {shadows.filter(s => s.id === activeTooltip).map(shadow => (
            <div
              key={shadow.id}
              className="bg-zinc-900 border border-zinc-600 rounded-lg p-4 max-w-sm mx-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-3">
                <shadow.Icon className="w-5 h-5 text-rose-400" strokeWidth={1.5} />
                <h4 className="font-game text-rose-400 text-base">{shadow.name}</h4>
              </div>

              <p className="text-game-text text-sm mb-3">{shadow.description}</p>

              <div className="mb-3 p-2 bg-zinc-800 rounded border border-zinc-700">
                <span className="text-[10px] text-game-gold font-semibold">TRIGGER: </span>
                <span className="text-[10px] text-game-text-muted">{shadow.trigger}</span>
              </div>

              <div className="space-y-2 mb-3 border-t border-zinc-700 pt-3">
                <div className="text-[10px] text-game-text-dim font-semibold mb-1">INTENSITY LEVELS:</div>
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-800 text-game-text-muted min-w-[40px] text-center">LOW</span>
                  <span className="text-[10px] text-game-text-muted">{shadow.intensityGuide.low}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-600 text-game-text min-w-[40px] text-center">MED</span>
                  <span className="text-[10px] text-game-text-muted">{shadow.intensityGuide.med}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-700 text-white min-w-[40px] text-center">HIGH</span>
                  <span className="text-[10px] text-game-text-muted">{shadow.intensityGuide.high}</span>
                </div>
              </div>

              <div className="p-2 bg-game-gold bg-opacity-10 border border-game-gold border-opacity-30 rounded mb-3">
                <span className="text-[10px] text-game-gold font-semibold">ANTIDOTE: </span>
                <span className="text-[10px] text-game-text">{shadow.antidote}</span>
              </div>

              <button
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-game-text-muted text-xs rounded transition-all border border-zinc-700"
                onClick={() => setActiveTooltip(null)}
              >
                Close
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ShadowMonitor
