import { ArrowUpRight, Pin } from 'lucide-react'
import InlineName from './InlineName'
import { getFreshnessTier } from '../hooks/usePortfolio'

const PRIORITY_CYCLE = ['low', 'medium', 'high', 'urgent']
const PRIORITY_COLORS = {
  low: 'text-game-text-muted border-game-text-muted/30',
  medium: 'text-game-blue border-game-blue/30',
  high: 'text-game-gold border-game-gold/30',
  urgent: 'text-game-red border-game-red/30',
}
const FRESHNESS_COLORS = {
  fresh: 'bg-game-green',
  warning: 'bg-yellow-500',
  stale: 'bg-game-text-dim',
}

const RosterRow = ({ project, onUpdate, onPin, onPromote, onNavigate }) => {
  const freshness = getFreshnessTier(project.last_activity_at)
  const isPencilsDown = project.status === 'pencils_down'
  const isOnHold = project.status === 'on_hold'

  const rowOpacity = isPencilsDown ? 'opacity-35 grayscale' :
    freshness === 'stale' ? 'opacity-45 grayscale-[0.8]' : ''

  const cyclePriority = () => {
    const idx = PRIORITY_CYCLE.indexOf(project.priority)
    const next = PRIORITY_CYCLE[(idx + 1) % PRIORITY_CYCLE.length]
    onUpdate(project.id, { priority: next })
  }

  const daysUntilDeadline = project.target_date
    ? Math.ceil((new Date(project.target_date).getTime() - Date.now()) / 86_400_000)
    : null

  return (
    <div className={`flex items-center gap-3 px-3 py-2 border-b border-game-border/30 hover:bg-game-panel/50 transition-colors group ${rowOpacity}`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${FRESHNESS_COLORS[freshness]}`} />

      <span className="font-game text-sm text-game-text truncate min-w-0 flex-1">
        <InlineName
          name={project.name}
          onRename={(name) => onUpdate(project.id, { name })}
        />
      </span>

      {project.category && (
        <span className="text-[10px] px-2 py-0.5 rounded border border-game-blue/30 text-game-blue font-mono uppercase tracking-wider flex-shrink-0">
          {project.category}
        </span>
      )}

      <button
        onClick={cyclePriority}
        className={`text-[10px] px-2 py-0.5 rounded border font-mono uppercase tracking-wider flex-shrink-0 hover:brightness-125 transition-all ${PRIORITY_COLORS[project.priority]}`}
      >
        {project.priority}
      </button>

      {daysUntilDeadline !== null && (
        <span className={`text-[10px] font-mono flex-shrink-0 ${daysUntilDeadline < 0 ? 'text-game-red' : 'text-game-text-muted'}`}>
          {daysUntilDeadline < 0 ? `overdue ${Math.abs(daysUntilDeadline)}d` : `due ${new Date(project.target_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
        </span>
      )}

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {project.status === 'active' && (
          <RowAction onClick={() => onUpdate(project.id, { status: 'on_hold', manual_rank: null })}>Pause</RowAction>
        )}
        {isOnHold && (
          <RowAction onClick={() => onUpdate(project.id, { status: 'active' })}>Resume</RowAction>
        )}
        <RowAction onClick={() => onPromote(project.id)}>Spotlight</RowAction>
        <RowAction onClick={() => onUpdate(project.id, { status: 'archived' })}>Archive</RowAction>
        <RowAction onClick={() => onPin(project.id)}>
          <Pin size={10} className={project.pinned ? 'fill-current text-game-gold' : ''} />
        </RowAction>
        <RowAction onClick={() => onNavigate(project.id)}>
          <ArrowUpRight size={10} />
        </RowAction>
      </div>
    </div>
  )
}

const RowAction = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="px-1.5 py-0.5 rounded border border-game-border text-[10px] text-game-text-dim hover:text-game-gold hover:border-game-gold/30 transition-colors font-mono"
  >
    {children}
  </button>
)

export default RosterRow
