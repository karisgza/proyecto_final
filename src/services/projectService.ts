
import { httpClient } from './httpClient'
import type { NewProject, Project, UpdateProjectRequest } from '../types'

export async function getProjects(): Promise<Project[]> {
  const { data } = await httpClient.get<Project[]>('/projects')
  return data
}

export async function createProject(body: NewProject): Promise<Project> {
  const { data } = await httpClient.post<Project>('/projects', body)
  return data
}

export async function updateProject(
  projectId: number,
  body: UpdateProjectRequest,
): Promise<Project> {
  const { data } = await httpClient.put<Project>(`/projects/${projectId}`, body)
  return data
}

export async function deleteProject(projectId: number): Promise<void> {
  await httpClient.delete(`/projects/${projectId}`)
}