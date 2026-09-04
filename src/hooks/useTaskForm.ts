import { useState } from 'react'
import { createTask } from '../services/taskService'
import type { TaskStatus } from '../types'

interface UseTaskFormOptions {
  projectId?: number
  onSuccess?: () => void
}

export function useTaskForm({ projectId, onSuccess }: UseTaskFormOptions = {}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('TODO')
  const [priority, setPriority] = useState('MED')
  const [assigneeID, setAssignee] = useState('')
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const valid = title.trim().length >= 3

  function reset() {
    setTitle('')
    setDescription('')
    setStatus('TODO')
    setPriority('MED')
    setAssignee('')
    setDueDate(new Date().toISOString().slice(0, 10))
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || submitting || !projectId) return

    setSubmitting(true)
    setError(null)

    try {
      const assigneeId = assigneeID.trim() ? Number(assigneeID) : null
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority: priority.trim() || 'MED',
        assigneeId: Number.isInteger(assigneeId) ? assigneeId : null,
        dueDate: dueDate.trim() || new Date().toISOString().slice(0, 10),
      }

      await createTask(projectId, payload)
      reset()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el proyecto')
    } finally {
      setSubmitting(false)
    }
  }

  return {
    title,
    setTitle,
    description,
    setDescription,
    status,
    setStatus,
    priority,
    setPriority,
    assigneeID,
    setAssignee,
    dueDate,
    setDueDate,
    submitting,
    error,
    valid,
    handleSubmit,
  }
}






