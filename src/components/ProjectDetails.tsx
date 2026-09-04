import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import { getTasks } from '../services/taskService'
import type { Task } from '../types'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const numericId = id ? Number(id) : NaN
  const projectId = Number.isFinite(numericId) ? numericId : undefined
  const navigate = useNavigate()
  const { projects, loading: projectsLoading, error: projectsError } = useProjects()
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(false)
  const [tasksError, setTasksError] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) return

    let cancelled = false
    setTasksLoading(true)
    setTasksError(null)

    getTasks(projectId)
      .then((data) => {
        if (!cancelled) setTasks(data)
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setTasksError(error instanceof Error ? error.message : 'Error al cargar tareas')
        }
      })
      .finally(() => {
        if (!cancelled) setTasksLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [projectId])

  if (projectsLoading || tasksLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (projectsError || !projectId) {
    return <Alert severity="error">{projectsError ?? 'No encontrado'}</Alert>
  }

  const project = projects.find((item) => item.id === projectId)

  if (!project) {
    return <Alert severity="error">No encontrado</Alert>
  }

  if (tasksError) {
    return <Alert severity="error">{tasksError}</Alert>
  }

  return (
    <Stack spacing={2} maxWidth={640}>
      <Button onClick={() => navigate(-1)} aria-label="Volver atrás">
        ← Volver
      </Button>
      <Typography variant="h5">{project.name}</Typography>
      <Typography color="text.secondary">{project.description}</Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Tareas ({tasks.length})</Typography>
        <Button
          component={RouterLink}
          to={`/tasks/new?projectId=${project.id}`}
          variant="outlined"
        >
          Nueva tarea
        </Button>
      </Stack>
      {!tasks.length && (
        <Typography color="text.secondary">Este proyecto no tiene tareas.</Typography>
      )}
      {tasks.map((task) => (
        <Card
          key={task.id}
          component={RouterLink}
          to={`/tasks/${task.id}`}
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                {task.title}
              </Typography>
              <Chip label={task.status} size="small" />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}