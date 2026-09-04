import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DeleteOutline from '@mui/icons-material/DeleteOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import { useCallback, useEffect, useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { TaskForm } from '../components/TaskForm'
import { getApiErrorMessage } from '../services/httpClient'
import { useProjects } from '../hooks/useProjects'
import { useTaskForm } from '../hooks/useTaskForm'
import { deleteTask, getTasks, updateTask, updateTaskStatus } from '../services/taskService'
import type { Task, TaskStatus } from '../types'

const SUN_YELLOW = '#F4C430'

function getPriorityColor(priority: string): 'success' | 'warning' | 'error' | 'default' {
  if (priority === 'HIGH') return 'error'
  if (priority === 'MED') return 'warning'
  if (priority === 'LOW') return 'success'
  return 'default'
}

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { projects, loading, error } = useProjects()
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(false)
  const [tasksError, setTasksError] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingStatus, setEditingStatus] = useState<TaskStatus>('TODO')
  const [editingTitle, setEditingTitle] = useState('')
  const [editingDescription, setEditingDescription] = useState('')
  const [editingPriority, setEditingPriority] = useState('MED')
  const [editingAssigneeID, setEditingAssigneeID] = useState('')
  const [editingDueDate, setEditingDueDate] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  const numericId = id ? Number(id) : NaN
  const projectId = Number.isFinite(numericId) ? numericId : undefined

  const refreshTasks = useCallback(() => {
    if (!projectId) return

    let cancelled = false
    setTasksLoading(true)
    setTasksError(null)

    getTasks(projectId)
      .then((data) => {
        if (!cancelled) setTasks(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setTasksError(err instanceof Error ? err.message : 'Error al cargar tareas')
        }
      })
      .finally(() => {
        if (!cancelled) setTasksLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [projectId])

  const taskForm = useTaskForm({
    projectId,
    onSuccess: () => {
      setIsTaskFormOpen(false)
      refreshTasks()
    },
  })

const handleDeleteTask = async (taskId: number) => {
  if (!taskId || !projectId) return

  if (!window.confirm('¿Eliminar esta tarea?')) return

  try {
    await deleteTask(taskId)
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
    setTasksError(null)
  } catch (err) {
    setTasksError(err instanceof Error ? err.message : 'No se pudo eliminar la tarea.')
  }
}
  const openEditTask = (task: Task) => {
    setEditingTask(task)
    setEditingTitle(task.title)
    setEditingDescription(task.description ?? '')
    setEditingPriority(task.priority)
    setEditingAssigneeID(String(task.assigneeID ?? ''))
    setEditingDueDate(task.dueDate ?? '')
    setEditingStatus(task.status ?? 'TODO')
  }

  const saveTask = async () => {
    if (!editingTask) return

    if (editingTitle.trim().length < 3) {
      setTasksError('El título debe tener al menos 3 caracteres.')
      return
    }

    setEditSaving(true)
    setTasksError(null)

    try {
      const assigneeId = editingAssigneeID.trim()
        ? Number(editingAssigneeID.trim())
        : null
      if (assigneeId !== null && !Number.isInteger(assigneeId)) {
        throw new Error('El encargado debe ser un ID numérico.')
      }

      await updateTask(editingTask.id, {
        title: editingTitle.trim(),
        description: editingDescription.trim() || undefined,
        priority: editingPriority,
        assigneeId,
        dueDate: editingDueDate || undefined,
      })

      if (editingStatus !== (editingTask.status ?? 'TODO')) {
        await updateTaskStatus(editingTask.id, editingStatus)
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                title: editingTitle.trim(),
                description: editingDescription.trim() || undefined,
                priority: editingPriority,
                assigneeID: editingAssigneeID.trim(),
                dueDate: editingDueDate,
                status: editingStatus,
              }
            : task,
        ),
      )
      setEditingTask(null)
    } catch (err) {
      setTasksError(getApiErrorMessage(err))
    } finally {
      setEditSaving(false)
    }
  }

  const project = projects.find((p) => p.id === numericId)

  useEffect(() => {
    refreshTasks()
  }, [refreshTasks])

  if (loading) {
    return (
      <Stack alignItems="center" py={4}>
        <CircularProgress />
      </Stack>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  if (!project) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">Proyecto no encontrado.</Alert>
        <Button
          component={RouterLink}
          to="/dashboard"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Volver al Dashboard
        </Button>
      </Container>
    )
  }

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Stack spacing={3}>
          <Button
            component={RouterLink}
            to="/dashboard"
            variant="outlined"
            sx={{
              alignSelf: 'flex-start',
              px: 1.5,
              py: 0.75,
              color: 'text.secondary',
            }}
          >
            ← Dashboard
          </Button>

          <Box
            sx={{
              pb: 3,
              borderBottom: 1,
              borderColor: 'divider',
              textAlign: 'left',
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                mt: 0.5,
                fontWeight: 600,
                lineHeight: 1.1,
                color: 'text.primary',
              }}
            >
              {project.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 680 }}>
              {project.description || 'Sin descripción disponible.'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
              ID del proyecto: {project.id}
            </Typography>
          </Box>

          <Box>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                Tareas
              </Typography>
              <Button
                variant="contained"
                onClick={() => setIsTaskFormOpen(true)}
                sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
              >
                Nueva tarea
              </Button>
            </Stack>

              {tasksLoading ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CircularProgress size={18} />
                  <Typography variant="body2" color="text.secondary">
                    Cargando tareas...
                  </Typography>
                </Stack>
              ) : tasksError ? (
                <Alert severity="error">{tasksError}</Alert>
              ) : tasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No hay tareas para este proyecto aún.
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, minmax(0, 1fr))',
                    },
                    gap: 2,
                    alignItems: 'stretch',
                  }}
                >
                  {tasks.map((task) => (
                    <Card
                      key={task.id}
                      variant="outlined"
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderLeft: 4,
                        borderRadius: 2,
                        boxShadow: 1,
                        borderLeftColor:
                          task.priority === 'HIGH'
                            ? 'error.main'
                            : task.priority === 'MED'
                              ? SUN_YELLOW
                              : task.priority === 'LOW'
                                ? 'success.main'
                                : 'divider',
                        transition: 'box-shadow 160ms ease, transform 160ms ease',
                        '&:hover': {
                          boxShadow: 5,
                          transform: 'translateY(-3px)',
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          p: 2.5,
                          flex: 1,
                          textAlign: 'left',
                          '&:last-child': { pb: 2.5 },
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          spacing={2}
                        >
                          <Box sx={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                            <Typography
                              variant="h6"
                              component="h3"
                              sx={{ lineHeight: 1.2, color: 'text.primary', fontWeight: 600 }}
                            >
                              {task.title}
                            </Typography>
                            <Stack
                              direction="column"
                              spacing={0.75}
                              alignItems="flex-start"
                              sx={{ mt: 1 }}
                            >
                              <Chip
                                label={task.priority || 'Sin prioridad'}
                                size="small"
                                color={getPriorityColor(task.priority)}
                                variant="filled"
                                sx={{
                                  alignSelf: 'flex-start',
                                  width: 'fit-content',
                                  ...(task.priority === 'MED'
                                    ? {
                                        backgroundColor: SUN_YELLOW,
                                        color: '#3d3200',
                                        '&:hover': { backgroundColor: '#E3B51E' },
                                      }
                                    : {}),
                                }}
                              />
                              <Chip
                                label={task.status || 'Sin estado'}
                                size="small"
                                color={
                                  task.status === 'DONE'
                                    ? 'success'
                                    : task.status === 'IN_PROGRESS'
                                      ? 'info'
                                      : 'default'
                                }
                                variant="outlined"
                                sx={{ alignSelf: 'flex-start', width: 'fit-content' }}
                              />
                            </Stack>
                          </Box>

                          <Stack direction="row" spacing={0.5}>
                            <IconButton
                              size="small"
                              color="primary"
                              aria-label="Editar tarea"
                              onClick={() => openEditTask(task)}
                            >
                              <EditOutlined fontSize="small" />
                            </IconButton>

                            <IconButton
                              size="small"
                              color="error"
                              aria-label="Eliminar tarea"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <DeleteOutline fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Stack>

                        {task.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                            {task.description}
                          </Typography>
                        )}

                        <Stack spacing={0.25} sx={{ mt: 1.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Encargado: {task.assigneeID || 'Sin asignar'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Fecha límite: {task.dueDate || 'Sin fecha'}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
          </Box>
        </Stack>
      </Container>

      {isTaskFormOpen && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            px: 2,
          }}
          onClick={() => setIsTaskFormOpen(false)}
        >
          <Paper
            sx={{
              width: '100%',
              maxWidth: 520,
              p: 3,
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <TaskForm {...taskForm} assigneeID={taskForm.assigneeID} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button
                onClick={() => setIsTaskFormOpen(false)}
                disabled={taskForm.submitting}
              >
                Cancelar
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      <Dialog open={editingTask !== null} onClose={() => !editSaving && setEditingTask(null)} fullWidth maxWidth="sm">
        <DialogTitle>Editar tarea</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Título"
              value={editingTitle}
              onChange={(event) => setEditingTitle(event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Descripción"
              value={editingDescription}
              onChange={(event) => setEditingDescription(event.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            <TextField
              select
              label="Prioridad"
              value={editingPriority}
              onChange={(event) => setEditingPriority(event.target.value)}
              fullWidth
            >
              <MenuItem value="LOW">LOW</MenuItem>
              <MenuItem value="MED">MED</MenuItem>
              <MenuItem value="HIGH">HIGH</MenuItem>
            </TextField>
            <TextField
              select
              label="Estado"
              value={editingStatus}
              onChange={(event) => setEditingStatus(event.target.value as TaskStatus)}
              fullWidth
            >
              <MenuItem value="TODO">TODO</MenuItem>
              <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
              <MenuItem value="DONE">DONE</MenuItem>
            </TextField>
            <TextField
              label="Encargado (ID)"
              value={editingAssigneeID}
              onChange={(event) => setEditingAssigneeID(event.target.value)}
              fullWidth
            />
            <TextField
              label="Fecha límite"
              type="date"
              value={editingDueDate}
              onChange={(event) => setEditingDueDate(event.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
              <Button
                onClick={() => setEditingTask(null)}
                variant="outlined"
                disabled={editSaving}
              >
            Cancelar
          </Button>
          <Button onClick={saveTask} variant="contained" disabled={editSaving}>
            {editSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}