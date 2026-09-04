import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { TaskStatus } from '../types'

interface TaskFormProps {
  title: string
  setTitle: (value: string) => void
  description: string
  setDescription: (value: string) => void
  status: TaskStatus
  setStatus: (value: TaskStatus) => void
  priority: string
  setPriority: (value: string) => void
  assigneeID: string
  setAssignee: (value: string) => void
  dueDate: string
  setDueDate : (value:string) => void
  submitting: boolean
  error: string | null
  valid: boolean
  handleSubmit: (e: React.FormEvent) => void
}

export function TaskForm({
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
}: TaskFormProps) {
  return (
    <Stack spacing={2} component="form" onSubmit={handleSubmit}>
      <Typography variant="h6">Nueva tarea</Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
        helperText="Mínimo 3 caracteres"
      />
      <TextField
        label="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={2}
      />
      <TextField
        select
        label="Prioridad"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        fullWidth
      >
        <MenuItem value="LOW">LOW</MenuItem>
        <MenuItem value="MED">MED</MenuItem>
        <MenuItem value="HIGH">HIGH</MenuItem>
      </TextField>
      <TextField
        select
        label="Estado"
        value={status}
        onChange={(e) => setStatus(e.target.value as TaskStatus)}
        fullWidth
      >
        <MenuItem value="TODO">TODO</MenuItem>
        <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
        <MenuItem value="DONE">DONE</MenuItem>
      </TextField>
      <TextField
        label="Encargado (ID)"
        value={assigneeID}
        onChange={(e) => setAssignee(e.target.value)}
        fullWidth
        placeholder="Opcional"
      />
      <TextField
        label="Fecha límite"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <Button type="submit" variant="contained" disabled={!valid || submitting}>
        {submitting ? 'Creando…' : 'Crear tarea'}
      </Button>
    </Stack>
  )
}