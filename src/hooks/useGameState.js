// Persists sovereignty level, loop phase, and shadow intensities to localStorage.
// These previously reset to defaults on every page load.

import { useState, useEffect, useRef, useCallback } from 'react'
import storageAdapter, { STORAGE_KEY_GAME_STATE } from '../storage/storageAdapter'

const DEFAULTS = {
  sovereigntyLevel: 50,
  currentPhase: null,
  shadows: {
    over_control: null,
    isolation_spiral: null,
    intensity_addiction: null,
    false_responsibility: null,
  },
}

export default function useGameState() {
  const [gameState, setGameState] = useState(() => {
    const stored = storageAdapter.getItem(STORAGE_KEY_GAME_STATE)
    if (stored && typeof stored === 'object') {
      return { ...DEFAULTS, ...stored }
    }
    return { ...DEFAULTS }
  })
  const isLoaded = useRef(true)

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded.current) {
      storageAdapter.setItem(STORAGE_KEY_GAME_STATE, {
        ...gameState,
        lastModified: new Date().toISOString(),
      })
    }
  }, [gameState])

  const setSovereigntyLevel = useCallback((value) => {
    const level = typeof value === 'function'
      ? value(gameState.sovereigntyLevel)
      : value
    setGameState(prev => ({ ...prev, sovereigntyLevel: level }))
  }, [gameState.sovereigntyLevel])

  const setCurrentPhase = useCallback((phase) => {
    setGameState(prev => ({ ...prev, currentPhase: phase }))
  }, [])

  const setShadows = useCallback((shadows) => {
    setGameState(prev => ({ ...prev, shadows }))
  }, [])

  // Hydrate from remote data (called after sync pull)
  const hydrateFromRemote = useCallback((remoteGameState) => {
    if (remoteGameState && typeof remoteGameState === 'object') {
      setGameState(prev => ({ ...prev, ...remoteGameState }))
    }
  }, [])

  return {
    sovereigntyLevel: gameState.sovereigntyLevel,
    currentPhase: gameState.currentPhase,
    shadows: gameState.shadows,
    setSovereigntyLevel,
    setCurrentPhase,
    setShadows,
    hydrateFromRemote,
  }
}
