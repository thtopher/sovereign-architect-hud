import { BookOpen, Radar, Brain, Compass, Zap, Users, Waves, Moon, Lock, UserX, Weight } from 'lucide-react'

// ============================================
// IDENTITY LOOP PHASES
// ============================================

export const phases = [
  {
    name: 'Intake',
    Icon: BookOpen,
    short: 'Strategic learning, absorbing information',
    cost: 'Low drain',
    costColor: 'text-emerald-400',
    description: 'The gathering phase. You are taking in information — reading, researching, learning. Input without immediate output.',
    signals: [
      'Reading reports, articles, books',
      'Listening to podcasts or briefings',
      'Research mode — exploring possibilities',
      'Consuming without producing'
    ],
    note: 'This phase restores when done intentionally. It depletes when it becomes avoidance of harder phases.',
    transition: 'Move to Reconnaissance when you have enough raw material and need to watch how it plays out in the world.'
  },
  {
    name: 'Reconnaissance',
    Icon: Radar,
    short: 'Watching, noticing patterns, gathering intel',
    cost: 'Low drain',
    costColor: 'text-emerald-400',
    description: 'The watching phase. You are observing — people, systems, dynamics. Gathering intelligence without intervening.',
    signals: [
      'Noticing team dynamics in meetings',
      'Watching how a decision plays out',
      'Sensing mood shifts in the room',
      'Collecting data points before acting'
    ],
    note: 'Reconnaissance is active, not passive. You are scanning for signal. Extended recon without action can become avoidance.',
    transition: 'Move to Analysis when you have enough observations to start making sense of the pattern.'
  },
  {
    name: 'Analysis',
    Icon: Brain,
    short: 'Making sense of it, strategic thinking',
    cost: 'Medium drain',
    costColor: 'text-amber-400',
    description: 'The sense-making phase. You are processing — connecting dots, recognizing patterns, thinking strategically.',
    signals: [
      'Connecting information across domains',
      'Seeing the pattern beneath the surface',
      'Strategic planning and scenario thinking',
      'The "aha" moments of clarity'
    ],
    note: 'This is where your pattern-recognition gift lives. But analysis can become a trap — endless thinking without acting. Gordian Cut is the antidote.',
    transition: 'Move to Design when you see the pattern clearly enough to build something, or to Execution if the path is already clear.'
  },
  {
    name: 'Design',
    Icon: Compass,
    short: 'Solo creation work, building, writing',
    cost: 'Medium drain, high reward',
    costColor: 'text-amber-400',
    description: 'The building phase. You are creating — writing, designing, making something that didn\'t exist. Solo work, deep focus.',
    signals: [
      'Writing strategy docs or plans',
      'Designing systems or processes',
      'Building presentations or frameworks',
      'Deep work requiring uninterrupted time'
    ],
    note: 'This is where sovereignty is spent well. Protect this phase fiercely. It requires solitude and is easily killed by interruption.',
    transition: 'Move to Execution when the thing is ready to ship, or to Holding when others need access to you.'
  },
  {
    name: 'Execution',
    Icon: Zap,
    short: 'Shipping, decisions, external output',
    cost: 'High drain',
    costColor: 'text-orange-400',
    description: 'The output phase. You are shipping — making decisions, sending communications, putting work into the world. External-facing action.',
    signals: [
      'Making decisions and communicating them',
      'Sending important emails or messages',
      'Presenting work to stakeholders',
      'Any action that moves things forward externally'
    ],
    note: 'Execution costs more than it feels like in the moment. The drain often hits later. Track the cumulative cost.',
    transition: 'Move to Holding when others need your presence, or to Release when the output is complete and outcomes are out of your control.'
  },
  {
    name: 'Holding',
    Icon: Users,
    short: 'Being present for others, meetings, leadership',
    cost: 'Highest drain',
    costColor: 'text-rose-400',
    description: 'The presence phase. You are holding space — in meetings, for others\' emotions, for decisions that need your attention. Leadership as service.',
    signals: [
      'Back-to-back meetings',
      'Being the decision-maker others need',
      'Managing others\' emotions or conflicts',
      'Performing leadership — being "on"'
    ],
    note: 'This phase is often 60%+ of the day but rarely named. It is the highest drain because you are metabolizing others\' needs. Track it honestly.',
    transition: 'Move to Release when you can step away, or directly to Recovery if you\'ve been holding too long.'
  },
  {
    name: 'Release',
    Icon: Waves,
    short: 'Letting go, surrendering outcomes',
    cost: 'Restoration',
    costColor: 'text-teal-400',
    description: 'The surrender phase. You are releasing — letting go of attachment to outcomes, putting down what you\'ve been carrying. Chosen surrender.',
    signals: [
      'Accepting that a decision is made and outcome is uncertain',
      'Stopping the mental replay of conversations',
      'Putting down responsibility that isn\'t yours',
      'Ending the workday intentionally'
    ],
    note: 'This is the phase most often skipped. The Protector resists it. But the loop cannot complete without Release. Sovereign Yield lives here.',
    transition: 'Move to Recovery once you\'ve actually let go, not just told yourself you have.'
  },
  {
    name: 'Recovery',
    Icon: Moon,
    short: 'Rest, solitude, integration',
    cost: 'Restoration',
    costColor: 'text-teal-400',
    description: 'The restoration phase. You are recovering — resting, integrating, allowing the system to reconstitute. Solitude and stillness.',
    signals: [
      'Actual rest, not distraction',
      'Sleep, or genuine downtime',
      'Solitude without input',
      'Allowing the day to settle'
    ],
    note: 'Recovery is not scrolling. It is not "unwinding" with intensity. It is genuine stillness. The system cannot run without this phase.',
    transition: 'Move to Intake when you\'re resourced and ready to begin again, or stay here if sovereignty is still low.'
  }
]

// ============================================
// SHADOW MECHANICS
// ============================================

export const shadows = [
  {
    id: 'over_control',
    name: 'Over-Control State',
    Icon: Lock,
    short: 'Gripping tight on everything',
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
    short: 'Withdrawing from connection',
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
    short: 'Seeking chaos over calm',
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
    short: 'Carrying what isn\'t yours',
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

// ============================================
// PHASE NAMES (for logging)
// ============================================

export const phaseNames = phases.map(p => p.name)
