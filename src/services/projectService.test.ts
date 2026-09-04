import { beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteProject, updateProject } from './projectService'
import { httpClient } from './httpClient'

vi.mock('./httpClient', () => ({
  httpClient: {
    delete: vi.fn(),
    put: vi.fn(),
  },
}))

describe('projectService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes a project by id', async () => {
    vi.mocked(httpClient.delete).mockResolvedValue({ data: undefined } as never)

    await deleteProject(42)

    expect(httpClient.delete).toHaveBeenCalledWith('/projects/42')
  })

  it('updates a project by id with PUT', async () => {
    const project = { id: 42, name: 'Updated project' }
    vi.mocked(httpClient.put).mockResolvedValue({ data: project } as never)

    const result = await updateProject(42, {
      name: 'Updated project',
      description: 'Updated description',
    })

    expect(httpClient.put).toHaveBeenCalledWith('/projects/42', {
      name: 'Updated project',
      description: 'Updated description',
    })
    expect(result).toEqual(project)
  })
})
