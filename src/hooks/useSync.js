// React hook wrapping the sync engine.
// Provides sync status, controls, and hydrated remote data to components.

import { useState, useEffect, useRef, useCallback } from 'react'
import { createSyncEngine, SyncStatus } from '../storage/syncEngine'
import { validateToken, createGist } from '../storage/gistSync'

export { SyncStatus }

export default function useSync() {
  const engineRef = useRef(null)
  const [syncState, setSyncState] = useState({
    status: SyncStatus.DISCONNECTED,
    lastSyncAt: null,
    error: null,
    gistId: null,
    token: null,
  })
  // Data returned from initial sync (Gist data that should hydrate React state)
  const [remoteData, setRemoteData] = useState(null)

  useEffect(() => {
    const engine = createSyncEngine()
    engineRef.current = engine

    // Subscribe to status changes
    const unsub = engine.onStatusChange(setSyncState)

    // Start the engine (will check for existing credentials)
    engine.start()

    // If credentials exist, do initial pull
    const creds = engine.getCredentials()
    if (creds) {
      engine.initialSync().then((data) => {
        if (data) setRemoteData(data)
      })
    }

    return () => {
      unsub()
      engine.stop()
    }
  }, [])

  const connect = useCallback(async (token) => {
    const engine = engineRef.current
    if (!engine) return

    // Validate token first
    await validateToken(token)

    // Create a new Gist
    const gistId = await createGist(token)

    // Connect the sync engine (saves credentials + does initial sync)
    const data = await engine.connect(gistId, token)
    if (data) setRemoteData(data)
  }, [])

  const connectWithGistId = useCallback(async (token, gistId) => {
    const engine = engineRef.current
    if (!engine) return

    // Validate token first
    await validateToken(token)

    // Connect with existing Gist ID
    const data = await engine.connect(gistId, token)
    if (data) setRemoteData(data)
  }, [])

  const disconnect = useCallback(() => {
    engineRef.current?.disconnect()
    setRemoteData(null)
  }, [])

  const forcePush = useCallback(() => {
    return engineRef.current?.pushToGist()
  }, [])

  const isConnected = syncState.status !== SyncStatus.DISCONNECTED

  return {
    ...syncState,
    isConnected,
    remoteData,
    connect,
    connectWithGistId,
    disconnect,
    forcePush,
  }
}
