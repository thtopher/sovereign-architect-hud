import { useState, useEffect } from 'react'
import TimeContext from './TimeContext'
import CompactStats from './CompactStats'
import StickyResourceBar from './StickyResourceBar'
import LoopStatus from './LoopStatus'
import ShadowMonitor from './ShadowMonitor'
import DailyPrompts from './DailyPrompts'
import HorizontalSkills from './HorizontalSkills'

const HUD = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sovereigntyLevel, setSovereigntyLevel] = useState(75)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const getTimeOfDay = () => {
    const hour = currentTime.getHours()
    if (hour >= 5 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 21) return 'evening'
    return 'night'
  }

  const getGreeting = () => {
    const timeOfDay = getTimeOfDay()
    const greetings = {
      morning: 'Morning Orientation',
      afternoon: 'Mid-Day Status',
      evening: 'Evening Integration',
      night: 'Night Watch'
    }
    return greetings[timeOfDay]
  }

  return (
    <div className="w-full min-h-screen">
      {/* Sticky Resource Bar */}
      <StickyResourceBar
        sovereignty={sovereigntyLevel}
        setSovereignty={setSovereigntyLevel}
      />

      <div className="p-3 md:p-6 pb-6">
        {/* Top Row: Left Column + Stats Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Left: Header + Time Context + Active Skills */}
          <div className="lg:col-span-2 space-y-3">
            <div className="game-panel p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-game text-xl md:text-2xl text-game-gold glow-text">
                    SOVEREIGN ARCHITECT
                  </h1>
                  <p className="text-gray-500 text-xs">
                    Meaning Under Chaos • v1.0
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-game text-game-gold">
                    {currentTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentTime.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>

            <TimeContext timeOfDay={getTimeOfDay()} greeting={getGreeting()} />

            {/* Active Skills - Compact, in left column */}
            <HorizontalSkills
              sovereignty={sovereigntyLevel}
              setSovereignty={setSovereigntyLevel}
            />
          </div>

          {/* Right: Core Attributes */}
          <div className="h-full">
            <CompactStats />
          </div>
        </div>

        {/* Main Grid - Below skills */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Left Column - Daily Prompts */}
          <div className="lg:col-span-1">
            {/* Daily Prompts - Time-aware */}
            <DailyPrompts timeOfDay={getTimeOfDay()} />
          </div>

          {/* Right: Two columns side by side */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Loop Status */}
            <LoopStatus />

            {/* Shadow Monitor */}
            <ShadowMonitor />
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="mt-6 text-center text-gray-600 text-xs">
          <p>{getTimeOfDay().toUpperCase()} PROTOCOL ACTIVE</p>
        </div>
      </div>
    </div>
  )
}

export default HUD
