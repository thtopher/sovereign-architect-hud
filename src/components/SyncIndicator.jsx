import { Cloud, CloudOff, Loader, AlertTriangle, Settings } from 'lucide-react'

const SyncIndicator = ({ status, isConnected, onClick }) => {
  if (!isConnected) {
    return (
      <button
        onClick={onClick}
        className="flex-shrink-0 text-game-text-dim hover:text-game-text-muted transition-colors"
        title="Cloud sync settings"
      >
        <Settings size={14} />
      </button>
    )
  }

  const config = {
    synced: { icon: Cloud, color: 'text-game-green', title: 'Synced' },
    syncing: { icon: Loader, color: 'text-game-blue', title: 'Syncing...', spin: true },
    dirty: { icon: Cloud, color: 'text-game-gold', title: 'Changes pending' },
    error: { icon: AlertTriangle, color: 'text-game-red', title: 'Sync error — tap to view' },
    offline: { icon: CloudOff, color: 'text-yellow-500', title: 'Offline — will sync when connected' },
  }

  const c = config[status] || config.synced
  const Icon = c.icon

  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 ${c.color} hover:opacity-80 transition-opacity`}
      title={c.title}
    >
      <Icon size={14} className={c.spin ? 'animate-spin' : ''} />
    </button>
  )
}

export default SyncIndicator
