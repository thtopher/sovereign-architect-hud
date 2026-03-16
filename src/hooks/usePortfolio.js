import { useState, useEffect, useCallback, useRef } from 'react'
import storageAdapter, { STORAGE_KEY_PORTFOLIO as STORAGE_KEY } from '../storage/storageAdapter'
const SPOTLIGHT_CAP = 8

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function loadProjects() {
  const parsed = storageAdapter.getItem(STORAGE_KEY)
  return Array.isArray(parsed) ? parsed : []
}

function saveProjects(projects) {
  storageAdapter.setItem(STORAGE_KEY, projects)
}

// Freshness tiers based on last_activity_at
export function getFreshnessTier(lastActivityAt) {
  if (!lastActivityAt) return 'stale'
  const daysSince = (Date.now() - new Date(lastActivityAt).getTime()) / 86_400_000
  if (daysSince <= 7) return 'fresh'
  if (daysSince <= 14) return 'warning'
  return 'stale'
}

// Effort score for ranking
function getEffortScore(project) {
  if (project.status === 'pencils_down') return 0

  const freshness = getFreshnessTier(project.last_activity_at)
  let score = freshness === 'fresh' ? 10 : freshness === 'warning' ? 4 : 0

  if (project.pinned) score += 20
  if (project.target_date) {
    score += 5
    const daysUntil = (new Date(project.target_date).getTime() - Date.now()) / 86_400_000
    if (daysUntil < 0) score += 10 // overdue
  }

  return score
}

// Partition into spotlight / roster / archive
function partitionProjects(projects) {
  const active = projects.filter(p => p.status !== 'archived')
  const archived = projects
    .filter(p => p.status === 'archived')
    .sort((a, b) => new Date(b.archived_at) - new Date(a.archived_at))
    .slice(0, 50)

  // Separate manual-ranked from auto-ranked
  const manual = active
    .filter(p => p.manual_rank != null)
    .sort((a, b) => a.manual_rank - b.manual_rank)

  const auto = active
    .filter(p => p.manual_rank == null && p.status !== 'on_hold')
    .map(p => ({ ...p, _effort: getEffortScore(p) }))
    .sort((a, b) => {
      if (b._effort !== a._effort) return b._effort - a._effort
      return new Date(b.last_activity_at) - new Date(a.last_activity_at)
    })

  const onHold = active.filter(p => p.status === 'on_hold' && p.manual_rank == null)

  const spotlightAuto = auto.slice(0, Math.max(0, SPOTLIGHT_CAP - manual.length))
  const rosterAuto = auto.slice(Math.max(0, SPOTLIGHT_CAP - manual.length))

  const spotlight = [...manual, ...spotlightAuto]
  const roster = [...rosterAuto, ...onHold]

  return { spotlight, roster, archive: archived }
}

export default function usePortfolio() {
  const [projects, setProjects] = useState(loadProjects)
  const saveTimeout = useRef(null)

  // Debounced save to localStorage
  useEffect(() => {
    clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => saveProjects(projects), 100)
    return () => clearTimeout(saveTimeout.current)
  }, [projects])

  const touchActivity = (project) => ({
    ...project,
    last_activity_at: new Date().toISOString()
  })

  const createProject = useCallback(({ name, category, priority = 'medium', target_date = null, tags = [] }) => {
    const now = new Date().toISOString()
    const project = {
      id: generateId(),
      name,
      status: 'active',
      category,
      priority,
      pinned: false,
      manual_rank: null,
      last_activity_at: now,
      created_at: now,
      target_date,
      tags,
      client_name: null,
      archived_at: null,
    }
    setProjects(prev => [...prev, project])
    return project
  }, [])

  const updateProject = useCallback((id, updates) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== id) return p
      const updated = { ...p, ...updates, last_activity_at: new Date().toISOString() }
      if (updates.status === 'archived') {
        updated.archived_at = new Date().toISOString()
      }
      return updated
    }))
  }, [])

  const deleteProject = useCallback((id) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }, [])

  const pinProject = useCallback((id) => {
    setProjects(prev => prev.map(p => ({
      ...p,
      pinned: p.id === id ? !p.pinned : false,
      last_activity_at: p.id === id ? new Date().toISOString() : p.last_activity_at
    })))
  }, [])

  const reorderSpotlight = useCallback((orderedIds) => {
    setProjects(prev => {
      const updated = [...prev]
      orderedIds.forEach((id, index) => {
        const idx = updated.findIndex(p => p.id === id)
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], manual_rank: index + 1 }
        }
      })
      return updated
    })
  }, [])

  const promoteToSpotlight = useCallback((id) => {
    setProjects(prev => {
      const maxRank = Math.max(0, ...prev.filter(p => p.manual_rank != null).map(p => p.manual_rank))
      return prev.map(p => {
        if (p.id !== id) return p
        return { ...p, manual_rank: maxRank + 1, status: 'active', last_activity_at: new Date().toISOString() }
      })
    })
  }, [])

  const exportToMarkdown = useCallback(() => {
    const { spotlight, roster, archive } = partitionProjects(projects)
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const lines = [`# Portfolio Export`, `> ${date}`, '']

    const renderProject = (p) => {
      const freshness = getFreshnessTier(p.last_activity_at)
      const tasks = p.tasks || []
      const notes = p.notes || []
      const links = p.links || []
      const done = tasks.filter(t => t.done).length
      const total = tasks.length

      lines.push(`### ${p.name}`)
      lines.push('')

      const meta = []
      if (p.category) meta.push(`**Category:** ${p.category}`)
      meta.push(`**Priority:** ${p.priority}`)
      meta.push(`**Status:** ${p.status.replace('_', ' ')}`)
      meta.push(`**Freshness:** ${freshness}`)
      if (p.pinned) meta.push(`**Pinned**`)
      if (p.target_date) {
        const days = Math.ceil((new Date(p.target_date).getTime() - Date.now()) / 86_400_000)
        meta.push(`**Deadline:** ${p.target_date} (${days < 0 ? `overdue ${Math.abs(days)}d` : `${days}d remaining`})`)
      }
      if (p.tags?.length) meta.push(`**Tags:** ${p.tags.join(', ')}`)
      lines.push(meta.join(' · '))
      lines.push('')

      if (links.length > 0) {
        lines.push('**Links:**')
        links.forEach(l => lines.push(`- [${l.label}](${l.url})`))
        lines.push('')
      }

      if (total > 0) {
        lines.push(`**Tasks** (${done}/${total}):`)
        tasks.forEach(t => lines.push(`- [${t.done ? 'x' : ' '}] ${t.text}`))
        lines.push('')
      }

      if (notes.length > 0) {
        lines.push('**Notes:**')
        notes.forEach(n => {
          const ts = new Date(n.created_at).toLocaleDateString()
          lines.push(`- _${ts}_ — ${n.text}`)
        })
        lines.push('')
      }

      lines.push('---')
      lines.push('')
    }

    if (spotlight.length > 0) {
      lines.push('## Spotlight')
      lines.push('')
      spotlight.forEach(renderProject)
    }

    if (roster.length > 0) {
      lines.push('## Roster')
      lines.push('')
      roster.forEach(renderProject)
    }

    if (archive.length > 0) {
      lines.push('## Archive')
      lines.push('')
      archive.forEach(p => {
        lines.push(`- **${p.name}** — ${p.category || ''} — archived ${new Date(p.archived_at).toLocaleDateString()}`)
      })
      lines.push('')
    }

    const md = lines.join('\n')
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `portfolio-${new Date().toISOString().slice(0, 10)}.md`
    a.click()
    URL.revokeObjectURL(url)
  }, [projects])

  const { spotlight, roster, archive } = partitionProjects(projects)

  return {
    projects,
    spotlight,
    roster,
    archive,
    createProject,
    updateProject,
    deleteProject,
    pinProject,
    reorderSpotlight,
    promoteToSpotlight,
    exportToMarkdown,
  }
}
