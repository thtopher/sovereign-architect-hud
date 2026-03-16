import { useState, useEffect } from 'react'
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { Plus, ChevronDown, ChevronRight, Download } from 'lucide-react'
import usePortfolio from '../hooks/usePortfolio'
import ProjectCard from './ProjectCard'
import RosterRow from './RosterRow'
import CreateProjectModal from './CreateProjectModal'
import ProjectDetail from './ProjectDetail'

const PortfolioPage = ({ sync }) => {
  const {
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
    hydrateFromRemote,
  } = usePortfolio()

  // Hydrate portfolio from remote data when sync pulls
  useEffect(() => {
    if (sync?.remoteData?.portfolio) {
      hydrateFromRemote(sync.remoteData.portfolio)
    }
  }, [sync?.remoteData, hydrateFromRemote])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [detailProjectId, setDetailProjectId] = useState(null)
  const [archiveOpen, setArchiveOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = spotlight.findIndex(p => p.id === active.id)
    const newIndex = spotlight.findIndex(p => p.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(spotlight, oldIndex, newIndex)
    reorderSpotlight(reordered.map(p => p.id))
  }

  // If viewing a project detail
  const detailProject = detailProjectId
    ? [...spotlight, ...roster, ...archive].find(p => p.id === detailProjectId)
    : null

  if (detailProject) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <ProjectDetail
          project={detailProject}
          onUpdate={updateProject}
          onPin={pinProject}
          onBack={() => setDetailProjectId(null)}
        />
      </div>
    )
  }

  // Group archive by month
  const archiveByMonth = archive.reduce((acc, project) => {
    const date = new Date(project.archived_at)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!acc[key]) acc[key] = { label, projects: [] }
    acc[key].projects.push(project)
    return acc
  }, {})

  const isEmpty = spotlight.length === 0 && roster.length === 0

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-game text-lg text-game-gold tracking-wider uppercase">Portfolio</h1>
          <p className="text-[10px] font-mono text-game-text-dim mt-0.5">
            {spotlight.length + roster.length} active project{spotlight.length + roster.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToMarkdown}
            className="flex items-center gap-2 px-3 py-2 rounded border border-game-border text-game-text-dim text-xs font-mono hover:text-game-gold hover:border-game-gold/30 transition-colors"
            title="Export portfolio to Markdown"
          >
            <Download size={14} /> Export .md
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded bg-game-gold/20 border border-game-gold/40 text-game-gold text-xs font-mono hover:bg-game-gold/30 transition-colors"
          >
            <Plus size={14} /> Add Project
          </button>
        </div>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="bg-game-panel border border-game-border border-dashed rounded-lg p-12 text-center">
          <p className="font-game text-game-text-muted text-sm mb-2">No projects yet</p>
          <p className="text-game-text-dim text-xs font-mono mb-4">Add your first project to start tracking.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded bg-game-gold/20 border border-game-gold/40 text-game-gold text-sm font-mono hover:bg-game-gold/30 transition-colors"
          >
            <Plus size={14} className="inline mr-1" /> Add your first project
          </button>
        </div>
      )}

      {/* Spotlight Grid */}
      {spotlight.length > 0 && (
        <section>
          <h2 className="font-game text-xs text-game-text-muted uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-game-gold" />
            Spotlight
            <span className="text-game-text-dim">({spotlight.length})</span>
          </h2>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={spotlight.map(p => p.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {spotlight.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onUpdate={updateProject}
                    onPin={pinProject}
                    onNavigate={setDetailProjectId}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>
      )}

      {/* Roster List */}
      {roster.length > 0 && (
        <section>
          <h2 className="font-game text-xs text-game-text-muted uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-game-text-dim" />
            Roster
            <span className="text-game-text-dim">({roster.length})</span>
          </h2>
          <div className="bg-game-panel/30 border border-game-border/50 rounded-lg overflow-hidden">
            {roster.map(project => (
              <RosterRow
                key={project.id}
                project={project}
                onUpdate={updateProject}
                onPin={pinProject}
                onPromote={promoteToSpotlight}
                onNavigate={setDetailProjectId}
              />
            ))}
          </div>
        </section>
      )}

      {/* Completed Archive */}
      {archive.length > 0 && (
        <section>
          <button
            onClick={() => setArchiveOpen(!archiveOpen)}
            className="font-game text-xs text-game-text-dim uppercase tracking-[0.2em] mb-3 flex items-center gap-2 hover:text-game-text-muted transition-colors"
          >
            {archiveOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            Completed Archive
            <span>({archive.length})</span>
          </button>
          {archiveOpen && (
            <div className="space-y-4">
              {Object.entries(archiveByMonth).map(([key, { label, projects }]) => (
                <div key={key}>
                  <h3 className="text-[10px] font-mono text-game-text-dim uppercase tracking-wider mb-2">{label}</h3>
                  <div className="bg-game-panel/20 border border-game-border/30 rounded-lg overflow-hidden">
                    {projects.map(project => (
                      <div
                        key={project.id}
                        className="flex items-center gap-3 px-3 py-2 border-b border-game-border/20 last:border-0 opacity-50"
                      >
                        <span className="font-game text-sm text-game-text-muted flex-1 truncate">{project.name}</span>
                        {project.category && (
                          <span className="text-[10px] px-2 py-0.5 rounded border border-game-border/30 text-game-text-dim font-mono">
                            {project.category}
                          </span>
                        )}
                        <button
                          onClick={() => setDetailProjectId(project.id)}
                          className="text-game-text-dim hover:text-game-gold text-[10px] font-mono transition-colors"
                        >
                          view
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={createProject}
      />
    </div>
  )
}

export default PortfolioPage
