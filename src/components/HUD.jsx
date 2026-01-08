import { useState, useEffect } from 'react'
import TimeContext from './TimeContext'
import ActivityLog from './ActivityLog'
import NotePrompt from './NotePrompt'
import StickyResourceBar from './StickyResourceBar'
import LoopStatus from './LoopStatus'
import ShadowMonitor from './ShadowMonitor'
import DailyPrompts from './DailyPrompts'
import HorizontalSkills from './HorizontalSkills'
import OnboardingFlow from './OnboardingFlow'
import useActivityLog from '../hooks/useActivityLog'

const HUD = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sovereigntyLevel, setSovereigntyLevel] = useState(75)
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [initialPhase, setInitialPhase] = useState(null)
  const [initialShadows, setInitialShadows] = useState({})

  // Activity logging
  const {
    entries,
    logSkill,
    logShadow,
    logSovereignty,
    logLoopPhase,
    logLoopComplete,
    logCheckin,
    logManualNote,
    logSessionStart,
    addNoteToEntry,
    editEntryNote,
    deleteEntry,
    exportLog,
    clearLog,
    getStats
  } = useActivityLog()

  // Note prompt state - includes undo info
  const [notePrompt, setNotePrompt] = useState({
    isOpen: false,
    pendingEntryId: null,
    actionLabel: '',
    undoData: null // { type: 'sovereignty', previousValue: 75 } etc.
  })

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

  // Skill names for display
  const skillNames = {
    gordian_cut: 'Gordian Cut',
    decisive_intervention: 'Decisive Intervention',
    galvanic_surge: 'Galvanic Surge',
    sovereign_yield: 'Sovereign Yield',
    walling: 'Walling'
  }

  // Shadow names for display
  const shadowNames = {
    over_control: 'Over-Control State',
    isolation_spiral: 'Isolation Spiral',
    intensity_addiction: 'Intensity Addiction',
    false_responsibility: 'False Responsibility'
  }

  // Handle skill activation - log and show note prompt
  const handleSkillActivate = (skillId, intensity, sovereigntyBefore) => {
    const entryId = logSkill(skillId, intensity)
    setNotePrompt({
      isOpen: true,
      pendingEntryId: entryId,
      actionLabel: `${skillNames[skillId] || skillId} (${intensity.toUpperCase()})`,
      undoData: { type: 'skill', sovereigntyBefore }
    })
  }

  // Handle shadow change - log and show note prompt
  const handleShadowChange = (shadowId, intensity, previousIntensity) => {
    const entryId = logShadow(shadowId, intensity)
    const action = intensity ? 'detected' : 'cleared'
    setNotePrompt({
      isOpen: true,
      pendingEntryId: entryId,
      actionLabel: `${shadowNames[shadowId] || shadowId} ${action}${intensity ? ` (${intensity.toUpperCase()})` : ''}`,
      undoData: { type: 'shadow', shadowId, previousIntensity }
    })
  }

  // Handle sovereignty change - log and show note prompt
  const handleSovereigntyChange = (newValue, oldValue) => {
    const entryId = logSovereignty(newValue, oldValue)
    setNotePrompt({
      isOpen: true,
      pendingEntryId: entryId,
      actionLabel: `Sovereignty: ${oldValue}% → ${newValue}%`,
      undoData: { type: 'sovereignty', previousValue: oldValue }
    })
  }

  // Handle loop phase change - log and show note prompt
  const handleLoopPhaseChange = (phase, previousPhase) => {
    const entryId = logLoopPhase(phase)
    setNotePrompt({
      isOpen: true,
      pendingEntryId: entryId,
      actionLabel: `Loop phase: ${phase}`,
      undoData: { type: 'loop', previousPhase }
    })
  }

  // Handle check-in response - log and show note prompt
  const handleCheckinResponse = (question, answer) => {
    const entryId = logCheckin(question, answer)
    setNotePrompt({
      isOpen: true,
      pendingEntryId: entryId,
      actionLabel: `Check-in: ${question} — ${answer}`,
      undoData: { type: 'checkin' }
    })
  }

  // Handle note prompt submission
  const handleNoteSubmit = (note) => {
    if (note && notePrompt.pendingEntryId) {
      addNoteToEntry(notePrompt.pendingEntryId, note)
    }
    setNotePrompt({ isOpen: false, pendingEntryId: null, actionLabel: '', undoData: null })
  }

  // Handle undo - reverse the action and delete the entry
  const handleNoteUndo = () => {
    const { pendingEntryId, undoData } = notePrompt

    // Delete the log entry
    if (pendingEntryId) {
      deleteEntry(pendingEntryId)
    }

    // Reverse state changes based on action type
    if (undoData) {
      switch (undoData.type) {
        case 'sovereignty':
          if (undoData.previousValue !== undefined) {
            setSovereigntyLevel(undoData.previousValue)
          }
          break
        case 'skill':
          if (undoData.sovereigntyBefore !== undefined) {
            setSovereigntyLevel(undoData.sovereigntyBefore)
          }
          break
        // shadow, loop, checkin don't need state reversal - just entry deletion
        default:
          break
      }
    }

    setNotePrompt({ isOpen: false, pendingEntryId: null, actionLabel: '', undoData: null })
  }

  // Phase names for logging
  const phaseNames = [
    'Intake', 'Reconnaissance', 'Analysis', 'Design',
    'Execution', 'Holding', 'Release', 'Recovery'
  ]

  // Handle onboarding completion
  const handleOnboardingComplete = ({ sovereignty, phase, shadows }) => {
    setSovereigntyLevel(sovereignty)
    setInitialPhase(phase)
    setInitialShadows(shadows)
    setOnboardingComplete(true)

    // Log the session start
    const phaseName = phase !== null ? phaseNames[phase] : null
    logSessionStart(sovereignty, phaseName, shadows)
  }

  // Show onboarding flow first
  if (!onboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="w-full min-h-screen">
      {/* Sticky Resource Bar */}
      <StickyResourceBar
        sovereignty={sovereigntyLevel}
        setSovereignty={setSovereigntyLevel}
        onSovereigntyChange={handleSovereigntyChange}
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
                  <p className="text-game-text-muted text-xs">
                    Meaning Under Chaos • v1.2
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-game text-game-gold">
                    {currentTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="text-xs text-game-text-muted">
                    {currentTime.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
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
              onSkillActivate={handleSkillActivate}
            />
          </div>

          {/* Right: Activity Log */}
          <div className="h-full">
            <ActivityLog
              entries={entries}
              onExport={exportLog}
              onClear={clearLog}
              onAddNote={logManualNote}
              onEditNote={editEntryNote}
              onDelete={deleteEntry}
              stats={getStats()}
            />
          </div>
        </div>

        {/* Main Grid - Below skills */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Left Column - Daily Prompts */}
          <div className="lg:col-span-1">
            {/* Daily Prompts - Time-aware */}
            <DailyPrompts timeOfDay={getTimeOfDay()} onCheckinResponse={handleCheckinResponse} />
          </div>

          {/* Right: Two columns side by side */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Loop Status */}
            <LoopStatus
              onPhaseChange={handleLoopPhaseChange}
              entries={entries}
              sovereignty={sovereigntyLevel}
              initialPhase={initialPhase}
            />

            {/* Shadow Monitor */}
            <ShadowMonitor
              onShadowChange={handleShadowChange}
              initialShadows={initialShadows}
            />
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="mt-6 text-center text-game-text-dim text-xs">
          <p>{getTimeOfDay().toUpperCase()} PROTOCOL ACTIVE</p>
        </div>
      </div>

      {/* Note Prompt Modal */}
      <NotePrompt
        isOpen={notePrompt.isOpen}
        onSubmit={handleNoteSubmit}
        onUndo={handleNoteUndo}
        actionLabel={notePrompt.actionLabel}
      />
    </div>
  )
}

export default HUD
