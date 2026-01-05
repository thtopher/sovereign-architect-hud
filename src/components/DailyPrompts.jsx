import { useState } from 'react'

const DailyPrompts = ({ timeOfDay }) => {
  const [responses, setResponses] = useState({})
  const [completed, setCompleted] = useState(false)

  const instructions = {
    morning: {
      title: 'Morning Protocol Complete',
      icon: '✓',
      actions: [
        'Protect time for architectural work (1-3 priorities identified)',
        'Do not allow calendar to fill with only execution tasks',
        'If Sovereignty is low, adjust expectations downward',
        'Check for active shadow mechanics before engaging'
      ],
      reminder: 'Design work > Execution work. Protect this ratio.'
    },
    afternoon: {
      title: 'Mid-Day Recalibration Complete',
      icon: '✓',
      actions: [
        'If Sovereignty depleted, create space for restoration',
        'Put down False Responsibility burdens identified',
        'Redirect intensity-seeking toward depth, not novelty',
        'Cancel/postpone what can be moved if resources low'
      ],
      reminder: 'The second half of the day requires intentional resource management.'
    },
    evening: {
      title: 'Evening Integration Complete',
      icon: '✓',
      actions: [
        'Acknowledge completions (even if they don\'t feel satisfying)',
        'Plan specific Recovery action for tonight',
        'If intervention occurred today, Release MUST happen before sleep',
        'Make explicit choice for surrender, not passive consumption'
      ],
      reminder: 'Without Release, tomorrow starts depleted. Choose your surrender.'
    },
    night: {
      title: 'Night Protocol Complete',
      icon: '✓',
      actions: [
        'If no Release occurred, system will start tomorrow depleted',
        'Chosen surrender restores Sovereignty (play, intimacy, rest)',
        'Forced rest does NOT restore - choice is essential',
        'Loop completion requires this phase'
      ],
      reminder: 'Release is not optional. The loop requires all phases.'
    }
  }

  const promptSets = {
    morning: [
      {
        id: 'resource',
        question: 'What is my Sovereignty level this morning?',
        type: 'choice',
        options: ['High (80+%)', 'Moderate (60-80%)', 'Low (40-60%)', 'Critical (<40%)']
      },
      {
        id: 'loop',
        question: 'Where am I in the identity loop?',
        type: 'choice',
        options: ['Knowledge', 'Observation', 'Pattern Recognition', 'Creation', 'Deployment', 'Release', 'Reconstitution']
      },
      {
        id: 'priority',
        question: 'What is the architectural work today? (1-3 things)',
        type: 'text',
        placeholder: 'Design work, not execution...'
      }
    ],
    afternoon: [
      {
        id: 'resource_check',
        question: 'Has Sovereignty shifted since morning?',
        type: 'choice',
        options: ['Increased', 'Stable', 'Decreased', 'Depleted']
      },
      {
        id: 'false_responsibility',
        question: 'Have I picked up anything that is not mine today?',
        type: 'choice',
        options: ['No', 'Yes, but I can release it', 'Yes, and it\'s accumulating']
      },
      {
        id: 'intensity',
        question: 'Am I seeking intensity to cope?',
        type: 'choice',
        options: ['No', 'Yes, redirect to depth', 'Yes, creating conflict']
      }
    ],
    evening: [
      {
        id: 'completions',
        question: 'What was completed today?',
        type: 'text',
        placeholder: 'Acknowledge completions...'
      },
      {
        id: 'unfinished',
        question: 'What remains unfinished?',
        type: 'choice',
        options: ['Appropriately unfinished (continues tomorrow)', 'Problematically unfinished (abandoned)']
      },
      {
        id: 'recovery',
        question: 'What will restore Sovereignty tonight?',
        type: 'text',
        placeholder: 'Specific choice for release...'
      }
    ],
    night: [
      {
        id: 'release',
        question: 'Has Release occurred today?',
        type: 'choice',
        options: ['Yes, chosen surrender', 'No, need to force Release phase', 'Partial']
      },
      {
        id: 'tomorrow',
        question: 'Will tomorrow start depleted?',
        type: 'choice',
        options: ['No, resources restored', 'Yes, need rest', 'Uncertain']
      }
    ]
  }

  const prompts = promptSets[timeOfDay] || promptSets.morning

  const handleResponse = (promptId, value) => {
    setResponses({
      ...responses,
      [promptId]: value
    })
  }

  const allAnswered = prompts.every(p => responses[p.id])

  const generateDynamicProtocol = () => {
    const actions = []
    let title = ''
    let icon = '✓'
    let reminder = ''

    if (timeOfDay === 'afternoon') {
      title = 'Mid-Day Recalibration Complete'

      // Analyze resource level
      if (responses.resource_check === 'Depleted') {
        actions.push('CRITICAL: Create immediate space for restoration')
        actions.push('Cancel/postpone non-essential items for rest of day')
        actions.push('Use Sovereign Yield skill if available')
        icon = '⚠️'
      } else if (responses.resource_check === 'Decreased') {
        actions.push('Sovereignty dropping - identify what\'s draining you')
        actions.push('Reduce expectations for second half of day')
        actions.push('Consider using Walling skill to set boundaries')
      } else if (responses.resource_check === 'Stable') {
        actions.push('Maintain current pace - resources holding steady')
      } else if (responses.resource_check === 'Increased') {
        actions.push('Resources strong - this is capacity for depth work')
        actions.push('Don\'t squander restored Sovereignty on execution tasks')
      }

      // Analyze false responsibility
      if (responses.false_responsibility === 'Yes, and it\'s accumulating') {
        actions.push('WALL IMMEDIATELY: You are carrying others\' burdens')
        actions.push('Name what is NOT yours and put it down')
        actions.push('Active Shadow: False Responsibility Drain')
        icon = '⚠️'
      } else if (responses.false_responsibility === 'Yes, but I can release it') {
        actions.push('Release the burden you identified - do not carry it into evening')
      }

      // Analyze intensity seeking
      if (responses.intensity === 'Yes, creating conflict') {
        actions.push('CRITICAL: Intensity Addiction active - you are manufacturing drama')
        actions.push('Stop. Breathe. Redirect to depth, not chaos')
        actions.push('Active Shadow: Intensity Addiction')
        icon = '⚠️'
      } else if (responses.intensity === 'Yes, redirect to depth') {
        actions.push('Good catch - channel intensity toward meaningful work')
        actions.push('Use Gordian Cut on a complex problem instead')
      }

      // Set reminder based on overall state
      if (responses.resource_check === 'Depleted' || responses.false_responsibility === 'Yes, and it\'s accumulating') {
        reminder = 'The second half requires restoration, not heroics. Adjust expectations now.'
      } else {
        reminder = 'The second half of the day requires intentional resource management.'
      }
    } else if (timeOfDay === 'morning') {
      title = 'Morning Protocol Complete'

      if (responses.resource === 'Critical (<40%)') {
        actions.push('START DEPLETED: Today is recovery mode, not performance mode')
        actions.push('Limit to 1 priority maximum, or defer entirely')
        actions.push('Identify what caused depletion and prevent tonight')
        icon = '⚠️'
      } else if (responses.resource === 'Low (40-60%)') {
        actions.push('Low resources: Reduce scope to 1-2 priorities only')
        actions.push('Protect rest periods during the day')
      } else if (responses.resource === 'Moderate (60-80%)') {
        actions.push('Normal capacity: Protect time for 1-3 architectural priorities')
        actions.push('Monitor for False Responsibility patterns')
      } else if (responses.resource === 'High (80+%)') {
        actions.push('High Sovereignty: This is capacity for depth work')
        actions.push('Design work > Execution work - protect this ratio')
        actions.push('Beware intensity-seeking that wastes this resource')
      }

      reminder = 'Design work > Execution work. Protect this ratio.'
    } else if (timeOfDay === 'evening') {
      title = 'Evening Integration Complete'

      if (responses.unfinished === 'Problematically unfinished (abandoned)') {
        actions.push('Pattern: You are abandoning work, not completing cycles')
        actions.push('Identify what caused abandonment - lack of resources? Interest?')
        actions.push('Tomorrow: Protect completion phase of loop')
        icon = '⚠️'
      } else {
        actions.push('Acknowledge what was completed today (even if unsatisfying)')
      }

      if (responses.recovery) {
        actions.push(`Commit to: ${responses.recovery}`)
        actions.push('This is not optional - Release phase is required')
      } else {
        actions.push('Choose specific Release action before sleep')
        icon = '⚠️'
      }

      reminder = 'Without Release, tomorrow starts depleted. Choose your surrender.'
    } else if (timeOfDay === 'night') {
      title = 'Night Protocol Complete'

      if (responses.release === 'No, need to force Release phase') {
        actions.push('CRITICAL: No Release today - tomorrow WILL start depleted')
        actions.push('Force Release NOW: play, intimacy, chosen rest')
        actions.push('Passive consumption does NOT restore')
        icon = '⚠️'
      } else if (responses.release === 'Partial') {
        actions.push('Incomplete Release - some restoration but not full')
        actions.push('Tomorrow will start below baseline')
      } else {
        actions.push('Release complete - loop cycle honored')
      }

      reminder = 'Release is not optional. The loop requires all phases.'
    }

    if (actions.length === 0) {
      return instructions[timeOfDay] || instructions.morning
    }

    return { title, icon, actions, reminder }
  }

  const handleComplete = () => {
    setCompleted(true)
    // Could save to localStorage here
  }

  const handleReset = () => {
    setCompleted(false)
    setResponses({})
  }

  const instruction = completed ? generateDynamicProtocol() : (instructions[timeOfDay] || instructions.morning)

  return (
    <div className="game-panel p-3">
      <h3 className="font-game text-base text-game-gold mb-3">
        {timeOfDay.toUpperCase()} CHECK-IN
      </h3>

      {!completed ? (
        <>
          <div className="space-y-3">
            {prompts.map((prompt, index) => (
          <div key={prompt.id} className="border-b border-game-border pb-3 last:border-0">
            <p className="text-sm font-bold text-gray-100 mb-2">
              {index + 1}. {prompt.question}
            </p>

            {prompt.type === 'choice' && (
              <div className="space-y-1.5">
                {prompt.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name={prompt.id}
                      value={option}
                      checked={responses[prompt.id] === option}
                      onChange={(e) => handleResponse(prompt.id, e.target.value)}
                      className="accent-game-gold w-3 h-3"
                    />
                    <span className="text-sm text-gray-300 group-hover:text-game-gold transition-colors">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {prompt.type === 'text' && (
              <textarea
                value={responses[prompt.id] || ''}
                onChange={(e) => handleResponse(prompt.id, e.target.value)}
                placeholder={prompt.placeholder}
                className="w-full bg-game-darker border border-game-border rounded p-2 text-sm text-gray-200 placeholder-gray-500 focus:border-game-gold focus:outline-none"
                rows="2"
              />
            )}
            </div>
          ))}
          </div>

          {allAnswered && (
            <div className="mt-3 pt-3 border-t border-game-border">
              <button onClick={handleComplete} className="game-button w-full text-xs py-2">
                Complete {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} Protocol
              </button>
            </div>
          )}

          <div className="mt-2 text-[10px] text-gray-600">
            ~3-5 min protocol
          </div>
        </>
      ) : (
        /* Protocol Completed - Show Instructions */
        <div className="space-y-3">
          <div className="bg-game-green bg-opacity-20 border border-game-green rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{instruction.icon}</span>
              <h4 className="font-game text-sm text-game-green">
                {instruction.title}
              </h4>
            </div>

            <div className="mb-3">
              <p className="text-[10px] text-gray-500 mb-1.5 font-bold">NEXT ACTIONS:</p>
              <ul className="space-y-1.5">
                {instruction.actions.map((action, index) => (
                  <li key={index} className="flex items-start gap-1.5">
                    <span className="text-game-gold mt-0.5 text-xs">→</span>
                    <span className="text-xs text-gray-300">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-game-green border-opacity-30">
              <p className="text-[10px] text-game-gold italic">
                {instruction.reminder}
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full px-3 py-1.5 bg-game-darker border border-game-border rounded
                     hover:border-game-gold transition-all text-xs text-gray-500"
          >
            Reset Protocol
          </button>
        </div>
      )}
    </div>
  )
}

export default DailyPrompts
