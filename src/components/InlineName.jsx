import { useState, useRef, useEffect } from 'react'

// Finder-style two-phase rename: click to select, click again to edit
const InlineName = ({ name, onRename, className = '' }) => {
  const [phase, setPhase] = useState('idle') // idle | selected | editing
  const [editValue, setEditValue] = useState(name)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (phase === 'editing' && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [phase])

  // Click outside → idle
  useEffect(() => {
    if (phase === 'idle') return
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (phase === 'editing') {
          commitRename()
        }
        setPhase('idle')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [phase, editValue])

  const commitRename = () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== name) {
      onRename(trimmed)
    } else {
      setEditValue(name)
    }
    setPhase('idle')
  }

  const handleClick = (e) => {
    e.stopPropagation()
    if (phase === 'idle') {
      setPhase('selected')
    } else if (phase === 'selected') {
      setEditValue(name)
      setPhase('editing')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      commitRename()
    } else if (e.key === 'Escape') {
      setEditValue(name)
      setPhase('idle')
    }
  }

  if (phase === 'editing') {
    return (
      <span ref={containerRef}>
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitRename}
          className="bg-game-dark border border-game-gold/50 text-game-text px-1.5 py-0.5 rounded text-sm font-game outline-none focus:border-game-gold w-full"
        />
      </span>
    )
  }

  return (
    <span
      ref={containerRef}
      onClick={handleClick}
      className={`cursor-default select-none ${phase === 'selected' ? 'ring-1 ring-game-gold/50 rounded px-1' : ''} ${className}`}
    >
      {name}
    </span>
  )
}

export default InlineName
