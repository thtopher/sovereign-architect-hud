// ============================================
// CHECK-IN QUESTION POOLS
// Questions rotate daily while maintaining trackable categories
// ============================================

// Get a deterministic "random" index based on date and category
export const getDailyIndex = (category, poolSize) => {
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
  // Use category string to offset so different categories get different questions
  const categoryOffset = category.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return (dayOfYear + categoryOffset) % poolSize
}

// ============================================
// MORNING QUESTIONS
// ============================================

export const morningQuestions = {
  // Category: Resource Assessment (always include one)
  resource: [
    {
      question: 'What is my Sovereignty level this morning?',
      options: ['Resourced (80+%)', 'Adequate (60-80%)', 'Strained (40-60%)', 'Depleted (<40%)']
    },
    {
      question: 'How did I wake up?',
      options: ['Ready — full capacity available', 'Okay — manageable but watch the trend', 'Heavy — something is weighing', 'Depleted — start in conservation mode']
    },
    {
      question: 'If my reserves were a fuel gauge, where am I?',
      options: ['Full tank', 'Three quarters', 'Half tank', 'Running on fumes']
    },
    {
      question: 'How much do I have to spend today?',
      options: ['Plenty — can take on challenge', 'Enough — if I\'m strategic', 'Limited — must protect', 'Almost nothing — survival mode']
    },
    {
      question: 'What is the honest state of my system right now?',
      options: ['Strong and ready', 'Functional but not optimal', 'Strained and watchful', 'Compromised — need care']
    }
  ],

  // Category: Anticipation/Threat Assessment
  anticipation: [
    {
      question: 'What is the shape of the day ahead?',
      options: ['Mostly mine to direct', 'Mixed — some autonomy', 'Mostly reactive/scheduled', 'Wall-to-wall obligations']
    },
    {
      question: 'Where will the highest drain come from today?',
      options: ['Holding space for others', 'High-stakes decisions', 'Conflict or difficult conversations', 'Sheer volume of demands']
    },
    {
      question: 'Is there anything I\'m dreading?',
      options: ['No — day feels manageable', 'Yes — but I can handle it', 'Yes — and it\'s consuming mental space', 'Yes — considering avoidance']
    },
    {
      question: 'How much "holding" will be required today?',
      options: ['Minimal — mostly solo work', 'Some — a few meetings', 'Significant — people need me', 'Constant — I am the container today']
    },
    {
      question: 'What is the threat level?',
      options: ['Low — space to breathe', 'Moderate — manageable pressure', 'High — will require vigilance', 'Critical — already in defense mode']
    }
  ],

  // Category: Intention Setting
  intention: [
    {
      question: 'What is the ONE thing that matters most today?',
      type: 'text',
      placeholder: 'The single most important thing...'
    },
    {
      question: 'What would make today feel complete?',
      type: 'text',
      placeholder: 'Completion looks like...'
    },
    {
      question: 'What is the architectural work today? (design, not execution)',
      type: 'text',
      placeholder: 'Strategic/creative work, not tasks...'
    },
    {
      question: 'What needs to be protected today?',
      type: 'text',
      placeholder: 'Time, energy, boundaries...'
    },
    {
      question: 'What am I NOT going to do today?',
      type: 'text',
      placeholder: 'Intentional nos...'
    }
  ],

  // Category: Shadow Check
  shadowCheck: [
    {
      question: 'Is the Protector already activated?',
      options: ['No — relaxed and open', 'Slightly — some vigilance', 'Yes — gripping on control', 'Fully — everything feels like threat']
    },
    {
      question: 'Am I already withdrawing?',
      options: ['No — connected and present', 'Slightly — preferring solitude', 'Yes — avoiding contact', 'Fully — isolation feels necessary']
    },
    {
      question: 'Am I seeking intensity to feel alive?',
      options: ['No — calm feels okay', 'Slightly — restless', 'Yes — looking for drama', 'Fully — manufacturing crisis']
    },
    {
      question: 'Am I carrying things that aren\'t mine?',
      options: ['No — clear on boundaries', 'Maybe — need to check', 'Yes — picked up someone else\'s weight', 'Fully — can\'t distinguish mine from others\'']
    }
  ]
}

// ============================================
// AFTERNOON QUESTIONS
// ============================================

export const afternoonQuestions = {
  // Category: Resource Shift
  resourceShift: [
    {
      question: 'How has Sovereignty shifted since morning?',
      options: ['Increased — restored somehow', 'Stable — holding steady', 'Decreased — spending faster than expected', 'Depleted — need immediate restoration']
    },
    {
      question: 'Compare now to how you started. What happened?',
      options: ['Better than expected', 'About as expected', 'Worse than expected', 'Much worse — something went wrong']
    },
    {
      question: 'If the day were a battery, what\'s the charge now?',
      options: ['Still strong', 'Adequate for the rest', 'Low — need to conserve', 'Critical — emergency mode']
    },
    {
      question: 'What\'s the honest read on your reserves right now?',
      options: ['Plenty left', 'Enough if careful', 'Running low', 'Already empty']
    }
  ],

  // Category: Boundary Check
  boundaryCheck: [
    {
      question: 'Have I picked up anything that isn\'t mine today?',
      options: ['No — boundaries held', 'Yes, but I can put it down', 'Yes, and it\'s accumulating', 'Yes, and I\'m drowning in it']
    },
    {
      question: 'Whose problems have I been solving?',
      options: ['My own — appropriate focus', 'Some others\' — but manageable', 'Mostly others\' — pattern emerging', 'Everyone\'s except my own']
    },
    {
      question: 'Have I said yes to things I should have declined?',
      options: ['No — held the line', 'One or two small ones', 'Several — pattern emerging', 'I\'ve been saying yes to everything']
    },
    {
      question: 'Am I carrying emotional weight that isn\'t mine?',
      options: ['No — clear boundaries', 'Some — but aware of it', 'Yes — others\' feelings are my problem', 'Overwhelmed by others\' states']
    }
  ],

  // Category: Pattern Detection
  patternDetection: [
    {
      question: 'What pattern is running right now?',
      options: ['Healthy flow — in the work', 'Grinding — pushing through', 'Escaping — seeking distraction', 'Spiraling — something\'s wrong']
    },
    {
      question: 'Am I in my body or just in my head?',
      options: ['Present — embodied', 'Mostly head — some tension', 'Disconnected — running on autopilot', 'Dissociated — checked out']
    },
    {
      question: 'Is intensity addiction active?',
      options: ['No — calm is acceptable', 'Slightly — seeking stimulation', 'Yes — bored by normal', 'Fully — only chaos feels real']
    },
    {
      question: 'How am I relating to others today?',
      options: ['Connected — present with people', 'Functional — doing my job', 'Withdrawn — avoiding contact', 'Hostile — people feel like threats']
    }
  ],

  // Category: Mid-Day Recalibration
  recalibration: [
    {
      question: 'What needs to change for the second half?',
      type: 'text',
      placeholder: 'Adjustments needed...'
    },
    {
      question: 'What should I cancel or postpone?',
      type: 'text',
      placeholder: 'Things to remove from today...'
    },
    {
      question: 'What do I need right now that I\'m not getting?',
      type: 'text',
      placeholder: 'Unmet need...'
    },
    {
      question: 'If I could only do one more thing today, what would it be?',
      type: 'text',
      placeholder: 'The essential thing...'
    }
  ]
}

// ============================================
// EVENING QUESTIONS
// ============================================

export const eveningQuestions = {
  // Category: Completion Recognition
  completion: [
    {
      question: 'What was completed today?',
      type: 'text',
      placeholder: 'Acknowledge completions, even small ones...'
    },
    {
      question: 'What moved forward, even if not finished?',
      type: 'text',
      placeholder: 'Progress made...'
    },
    {
      question: 'What can I acknowledge as done?',
      type: 'text',
      placeholder: 'Let yourself see what was accomplished...'
    },
    {
      question: 'Where did I show up well today?',
      type: 'text',
      placeholder: 'Moments of presence or skill...'
    }
  ],

  // Category: Incompletion Assessment
  incompletion: [
    {
      question: 'What remains unfinished?',
      options: ['Nothing significant — good closure', 'Some things — but they\'ll keep', 'Too much — tomorrow starts behind', 'Everything — day was a write-off']
    },
    {
      question: 'How do I feel about what\'s incomplete?',
      options: ['At peace — appropriate stopping point', 'Okay — can resume tomorrow', 'Frustrated — wanted more done', 'Defeated — couldn\'t get traction']
    },
    {
      question: 'Is there anything I abandoned (not paused, abandoned)?',
      options: ['No — intentional stops only', 'Maybe one thing', 'Yes — gave up on something', 'Multiple abandonments today']
    },
    {
      question: 'What\'s the story I\'m telling about today?',
      options: ['Productive — things got done', 'Okay — did what I could', 'Disappointing — fell short', 'Failure — nothing went right']
    }
  ],

  // Category: Release Planning
  releasePlanning: [
    {
      question: 'What will restore Sovereignty tonight?',
      type: 'text',
      placeholder: 'Specific choice for release...'
    },
    {
      question: 'What is the chosen surrender for this evening?',
      type: 'text',
      placeholder: 'Play, rest, connection, pleasure...'
    },
    {
      question: 'How will I mark the end of work today?',
      type: 'text',
      placeholder: 'Ritual or transition...'
    },
    {
      question: 'What would actual rest look like tonight?',
      type: 'text',
      placeholder: 'Not scrolling — real rest...'
    }
  ],

  // Category: Surrender Readiness
  surrenderReadiness: [
    {
      question: 'Can I put it down?',
      options: ['Yes — ready to release', 'Mostly — a few threads', 'Struggling — mind still working', 'No — can\'t let go']
    },
    {
      question: 'Is the Protector willing to release control?',
      options: ['Yes — can surrender', 'Reluctantly — with effort', 'Fighting it — wants to grip', 'No — everything feels unsafe']
    },
    {
      question: 'What\'s between me and rest?',
      options: ['Nothing — ready now', 'Just transition time needed', 'Unfinished business pulling at me', 'Unable to stop the mental churn']
    },
    {
      question: 'Am I avoiding release by staying busy?',
      options: ['No — genuinely finishing up', 'Maybe — checking "one more thing"', 'Yes — finding reasons to keep going', 'Definitely — rest feels dangerous']
    }
  ]
}

// ============================================
// NIGHT QUESTIONS
// ============================================

export const nightQuestions = {
  // Category: Release Assessment
  releaseAssessment: [
    {
      question: 'Has Release occurred today?',
      options: ['Yes — chosen surrender happened', 'Partial — some release', 'No — still holding', 'Forced rest only — no real release']
    },
    {
      question: 'Did I actually stop working?',
      options: ['Yes — clean break', 'Mostly — a few mental threads', 'Not really — kept thinking about it', 'No — worked until collapse']
    },
    {
      question: 'Was there any play, pleasure, or genuine rest?',
      options: ['Yes — real restoration', 'Some — but not enough', 'Just consumption — no real rest', 'Nothing — went straight to crash']
    },
    {
      question: 'Did I choose my evening or did it happen to me?',
      options: ['Chose — intentional time', 'Mostly chose — some drift', 'Drifted — passive consumption', 'Collapsed — no agency']
    }
  ],

  // Category: Tomorrow Forecast
  tomorrowForecast: [
    {
      question: 'Will tomorrow start depleted?',
      options: ['No — resources restored', 'Possibly — not fully recovered', 'Probably — running on fumes', 'Definitely — already behind']
    },
    {
      question: 'What\'s the honest forecast for tomorrow\'s capacity?',
      options: ['Strong — ready for challenge', 'Adequate — can manage normal load', 'Limited — need to protect', 'Compromised — survival mode']
    },
    {
      question: 'Is the loop completing?',
      options: ['Yes — Release happening', 'Partially — some phases stuck', 'No — skipping Release again', 'Loop is broken — can\'t complete']
    },
    {
      question: 'What do I need to wake up to tomorrow?',
      options: ['Normal day — can handle it', 'Light day — need recovery time', 'Protected day — boundaries essential', 'Nothing — need true rest day']
    }
  ],

  // Category: Pattern Recognition
  nightPatternRecognition: [
    {
      question: 'What pattern repeated today?',
      type: 'text',
      placeholder: 'Recurring theme or behavior...'
    },
    {
      question: 'What triggered depletion today?',
      type: 'text',
      placeholder: 'Identify the drain source...'
    },
    {
      question: 'What would I do differently?',
      type: 'text',
      placeholder: 'Learning for next time...'
    },
    {
      question: 'What am I grateful for despite the difficulty?',
      type: 'text',
      placeholder: 'Something that worked...'
    }
  ],

  // Category: Final Release
  finalRelease: [
    {
      question: 'Can I sleep without solving anything?',
      options: ['Yes — letting it be', 'Working on it — releasing gradually', 'Struggling — mind won\'t stop', 'No — will be up thinking about it']
    },
    {
      question: 'What do I need to put down to sleep?',
      type: 'text',
      placeholder: 'Things to consciously release...'
    },
    {
      question: 'Is there anyone I need to forgive (including myself)?',
      type: 'text',
      placeholder: 'Resentment to release...'
    },
    {
      question: 'What am I carrying into sleep?',
      options: ['Peace — day is resolved', 'Tiredness — but okay', 'Weight — something unprocessed', 'Dread — tomorrow feels heavy']
    }
  ]
}

// ============================================
// HELPER: Get Today's Questions for Time Period
// ============================================

export const getTodaysQuestions = (timeOfDay) => {
  const pools = {
    morning: morningQuestions,
    afternoon: afternoonQuestions,
    evening: eveningQuestions,
    night: nightQuestions
  }

  const pool = pools[timeOfDay] || pools.morning
  const categories = Object.keys(pool)

  // Select one question from each category using daily rotation
  return categories.map(category => {
    const questions = pool[category]
    const index = getDailyIndex(category, questions.length)
    const selected = questions[index]

    return {
      id: category,
      category,
      question: selected.question,
      type: selected.type || 'choice',
      options: selected.options,
      placeholder: selected.placeholder
    }
  })
}

// ============================================
// TIME-SPECIFIC INSTRUCTIONS (unchanged)
// ============================================

export const instructions = {
  morning: {
    title: 'Morning Protocol Complete',
    actions: [
      'Protect time for architectural work',
      'Do not allow calendar to fill with only execution tasks',
      'If Sovereignty is low, adjust expectations downward',
      'Check for active shadow mechanics before engaging'
    ],
    reminder: 'Design work > Execution work. Protect this ratio.'
  },
  afternoon: {
    title: 'Mid-Day Recalibration Complete',
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
    actions: [
      'If no Release occurred, system will start tomorrow depleted',
      'Chosen surrender restores Sovereignty (play, intimacy, rest)',
      'Forced rest does NOT restore - choice is essential',
      'Loop completion requires this phase'
    ],
    reminder: 'Release is not optional. The loop requires all phases.'
  }
}
