import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createProject, deleteProject, getProjects, updateProject } from './projectService'
import { httpClient } from './httpClient'

vi.mock('./httpClient', () => ({
  httpClient: {
    delete: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
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

  it('gets all projects', async () => {
    const projects = [{ id: 1, name: 'Project one' }]
    vi.mocked(httpClient.get).mockResolvedValue({ data: projects } as never)

    const result = await getProjects()

    expect(httpClient.get).toHaveBeenCalledWith('/projects')
    expect(result).toEqual(projects)
  })

  it('creates a project', async () => {
    const project = { id: 1, name: 'New project' }
    const body = { name: 'New project', description: 'Description' }
    vi.mocked(httpClient.post).mockResolvedValue({ data: project } as never)

    const result = await createProject(body)

    expect(httpClient.post).toHaveBeenCalledWith('/projects', body)
    expect(result).toEqual(project)
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
