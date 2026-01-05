const StatsPanel = () => {
  const stats = [
    { name: 'PERCEPTION', subtitle: 'Pattern Recognition', tier: 'S+', value: 95, color: 'bg-stat-s-plus' },
    { name: 'WILL', subtitle: 'Autonomy + Drive', tier: 'S', value: 90, color: 'bg-stat-s' },
    { name: 'AGENCY', subtitle: 'Decisive Force', tier: 'A+', value: 85, color: 'bg-stat-a-plus' },
    { name: 'CREATIVE ENTROPY', subtitle: 'Generative Chaos', tier: 'A+', value: 85, color: 'bg-stat-a-plus' },
    { name: 'RELATIONAL SENSITIVITY', subtitle: 'Human Attunement', tier: 'A', value: 75, color: 'bg-stat-a' },
    { name: 'ENDURANCE', subtitle: 'Sustainment & Completion', tier: 'C', value: 30, color: 'bg-stat-c' }
  ]

  return (
    <div className="game-panel">
      <h3 className="font-game text-lg text-game-gold mb-4">CORE ATTRIBUTES</h3>

      <div className="space-y-3">
        {stats.map((stat) => (
          <div key={stat.name} className="group">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className={`
                  px-2 py-0.5 text-xs font-bold rounded
                  ${stat.tier === 'S+' || stat.tier === 'S' ? 'bg-red-600 text-white' : ''}
                  ${stat.tier.startsWith('A') ? 'bg-yellow-600 text-white' : ''}
                  ${stat.tier === 'C' ? 'bg-gray-600 text-white' : ''}
                `}>
                  {stat.tier}
                </span>
                <div>
                  <span className="text-sm font-bold text-gray-200">{stat.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{stat.subtitle}</span>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-400">{stat.value}%</span>
            </div>

            <div className="stat-bar h-4">
              <div
                className={`stat-bar-fill ${stat.color} group-hover:opacity-90 transition-opacity`}
                style={{ width: `${stat.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-game-border text-xs text-gray-400 italic">
        "You are not broken where you are low. You are specialized."
      </div>
    </div>
  )
}

export default StatsPanel
