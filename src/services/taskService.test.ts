import { beforeEach, describe, expect, it, vi } from 'vitest'
import { httpClient } from './httpClient'
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from './taskService'

vi.mock('./httpClient', () => ({
  httpClient: {
    delete: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}))

describe('taskService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates task fields with PUT', async () => {
    const task = { id: 42, title: 'Updated task' }
    vi.mocked(httpClient.put).mockResolvedValue({ data: task } as never)

    const result = await updateTask(42, {
      title: 'Updated task',
      priority: 'MED',
      assigneeId: null,
    })

    expect(httpClient.put).toHaveBeenCalledWith('/tasks/42', {
      title: 'Updated task',
      priority: 'MED',
      assigneeId: null,
    })
    expect(result).toEqual(task)
  })

  it('gets tasks for a project', async () => {
    const tasks = [{ id: 1, title: 'Task one' }]
    vi.mocked(httpClient.get).mockResolvedValue({ data: tasks } as never)

    const result = await getTasks(7)

    expect(httpClient.get).toHaveBeenCalledWith('/projects/7/tasks')
    expect(result).toEqual(tasks)
  })

  it('creates a task for a project', async () => {
    const task = { id: 1, title: 'New task' }
    const body = {
      title: 'New task',
      status: 'TODO' as const,
      priority: 'MED',
      assigneeId: null,
      dueDate: '2026-09-04',
    }
    vi.mocked(httpClient.post).mockResolvedValue({ data: task } as never)

    const result = await createTask(7, body)

    expect(httpClient.post).toHaveBeenCalledWith('/projects/7/tasks', body)
    expect(result).toEqual(task)
  })

  it('deletes a task by id', async () => {
    vi.mocked(httpClient.delete).mockResolvedValue({ data: undefined } as never)

    await deleteTask(42)

    expect(httpClient.delete).toHaveBeenCalledWith('/tasks/42')
  })

  it('updates only task status with PATCH', async () => {
    vi.mocked(httpClient.patch).mockResolvedValue({ data: undefined } as never)

    await updateTaskStatus(42, 'IN_PROGRESS')

    expect(httpClient.patch).toHaveBeenCalledWith('/tasks/42/status', {
      status: 'IN_PROGRESS',
    })
  })
})
