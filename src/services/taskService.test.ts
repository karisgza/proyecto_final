import { beforeEach, describe, expect, it, vi } from 'vitest'
import { httpClient } from './httpClient'
import { updateTask, updateTaskStatus } from './taskService'

vi.mock('./httpClient', () => ({
  httpClient: {
    patch: vi.fn(),
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

  it('updates only task status with PATCH', async () => {
    vi.mocked(httpClient.patch).mockResolvedValue({ data: undefined } as never)

    await updateTaskStatus(42, 'IN_PROGRESS')

    expect(httpClient.patch).toHaveBeenCalledWith('/tasks/42/status', {
      status: 'IN_PROGRESS',
    })
  })
})
