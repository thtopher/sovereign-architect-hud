const StickyResourceBar = ({ sovereignty, setSovereignty }) => {
  const getStatusColor = () => {
    if (sovereignty >= 80) return 'bg-game-green'
    if (sovereignty >= 60) return 'bg-game-blue'
    if (sovereignty >= 40) return 'bg-yellow-500'
    return 'bg-game-red'
  }

  const getStatusText = () => {
    if (sovereignty >= 80) return 'PEAK'
    if (sovereignty >= 60) return 'EFFECTIVE'
    if (sovereignty >= 40) return 'WARNING'
    if (sovereignty >= 20) return 'CRITICAL'
    return 'COLLAPSE'
  }

  return (
    <div className="sticky top-0 z-50 bg-game-darker border-b-2 border-game-gold py-2 px-3 md:px-4 shadow-xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Title */}
          <div className="flex-shrink-0">
            <span className="font-game text-xs md:text-sm text-game-gold">SOVEREIGNTY</span>
          </div>

          {/* Bar - smaller text on mobile */}
          <div className="flex-1 min-w-0">
            <div className="stat-bar h-3 md:h-4">
              <div
                className={`stat-bar-fill ${getStatusColor()} flex items-center justify-center`}
                style={{ width: `${sovereignty}%` }}
              >
                <span className="text-[8px] md:text-[10px] font-bold text-white whitespace-nowrap px-1">
                  {sovereignty > 20 && (
                    <>
                      <span className="hidden sm:inline">{sovereignty}% - {getStatusText()}</span>
                      <span className="sm:hidden">{sovereignty}%</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Value */}
          <div className="flex-shrink-0 text-right">
            <span className="text-base md:text-lg font-bold text-game-gold">{sovereignty}%</span>
          </div>

          {/* Demo slider - responsive width */}
          <div className="flex-shrink-0 w-20 md:w-32">
            <input
              type="range"
              min="0"
              max="100"
              value={sovereignty}
              onChange={(e) => setSovereignty(parseInt(e.target.value))}
              className="w-full h-2 accent-game-gold cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StickyResourceBar
