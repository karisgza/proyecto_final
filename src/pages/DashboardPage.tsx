import AddIcon from '@mui/icons-material/Add'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { ProjectForm } from '../components/ProjectForm'
import { ProjectList } from '../components/ProjectList'
import { useToast } from '../context/ToastContext'
import { useProjectForm } from '../hooks/useProjectForm'
import { useProjects } from '../hooks/useProjects'
import { getApiErrorMessage } from '../services/httpClient'
import { deleteProject, updateProject } from '../services/projectService'
import type { Project } from '../types'

export function DashboardPage() {
  const { showToast } = useToast()
  const { projects, loading, error, refetch } = useProjects()
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingName, setEditingName] = useState('')
  const [editingDescription, setEditingDescription] = useState('')
  const [editError, setEditError] = useState<string | null>(null)
  const [editSaving, setEditSaving] = useState(false)
  const projectForm = useProjectForm({
    onSuccess: () => {
      refetch()
      setIsProjectFormOpen(false)
      showToast('Proyecto creado')
    },
  })

  async function handleDeleteProject(project: Project) {
    if (!window.confirm(`¿Seguro que deseas eliminar el proyecto "${project.name}"? Esta acción no se puede deshacer.`)) return

    setDeleteError(null)
    setDeletingProjectId(project.id)

    try {
      await deleteProject(project.id)
      refetch()
      showToast('Proyecto eliminado')
    } catch (err) {
      setDeleteError(getApiErrorMessage(err))
    } finally {
      setDeletingProjectId(null)
    }
  }

  function handleEditProject(project: Project) {
    setEditingProject(project)
    setEditingName(project.name)
    setEditingDescription(project.description ?? '')
    setEditError(null)
  }

  async function handleUpdateProject(event: React.FormEvent) {
    event.preventDefault()
    if (!editingProject || editingName.trim().length < 3 || editSaving) return

    setEditSaving(true)
    setEditError(null)

    try {
      await updateProject(editingProject.id, {
        name: editingName.trim(),
        description: editingDescription.trim() || undefined,
      })
      setEditingProject(null)
      refetch()
      showToast('Proyecto actualizado')
    } catch (err) {
      setEditError(getApiErrorMessage(err))
    } finally {
      setEditSaving(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Box sx={{ maxWidth: 960, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 4, sm: 6 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Proyectos
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setIsProjectFormOpen(true)}
          >
            Nuevo
          </Button>
        </Box>
        {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
        <ProjectList
          projects={projects}
          loading={loading}
          error={error}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          deletingProjectId={deletingProjectId}
        />
      </Box>

      <Dialog
        open={isProjectFormOpen}
        onClose={() => !projectForm.submitting && setIsProjectFormOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Nuevo proyecto</DialogTitle>
        <DialogContent>
          <ProjectForm {...projectForm} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsProjectFormOpen(false)}
            variant="outlined"
            disabled={projectForm.submitting}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editingProject !== null}
        onClose={() => !editSaving && setEditingProject(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar proyecto</DialogTitle>
        <DialogContent>
          <Stack component="form" spacing={2} onSubmit={handleUpdateProject} sx={{ pt: 1 }}>
            {editError && <Alert severity="error">{editError}</Alert>}
            <TextField
              label="Nombre"
              value={editingName}
              onChange={(event) => setEditingName(event.target.value)}
              required
              fullWidth
              helperText="Mínimo 3 caracteres"
            />
            <TextField
              label="Descripción"
              value={editingDescription}
              onChange={(event) => setEditingDescription(event.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            <DialogActions sx={{ px: 0 }}>
              <Button
                onClick={() => setEditingProject(null)}
                variant="outlined"
                disabled={editSaving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={editingName.trim().length < 3 || editSaving}
              >
                {editSaving ? 'Guardando…' : 'Guardar cambios'}
              </Button>
            </DialogActions>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  )
}