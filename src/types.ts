export interface AuthResponse {
  token: string
}

export type UserRole = 'USER' | 'ADMIN'

export interface User {
  id: number
  username: string
  email: string
  role: UserRole
}

export interface Project {
  id: number
  name: string
  description?: string
  ownerId: number
  createdAt: string
}

export interface NewProject {
  name: string
  description?: string
}

export interface UpdateProjectRequest {
  name: string
  description?: string
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'LOW' | 'MED' | 'HIGH'

export interface Task {
  id: number
  title: string
  description?: string
  status?: TaskStatus
  priority: TaskPriority
  assigneeId?: number | null
  dueDate: string
}

export interface NewTask {
  title: string
  description?: string
  status: TaskStatus
  priority: string
  assigneeId?: number | null
  dueDate: string
}

export interface UpdateTaskRequest {
  title: string
  description?: string
  priority: string
  assigneeId?: number | null
  dueDate?: string
}

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api' : 'https://d3ujwk09smrk9z.cloudfront.net')

export const TOKEN_KEY = 'jwt-auth-demo-token'