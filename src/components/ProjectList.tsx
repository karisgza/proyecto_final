import Alert from '@mui/material/Alert'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DeleteOutline from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import { Link as RouterLink } from 'react-router-dom'
import type { Project } from '../types'

interface ProjectListProps {
  projects: Project[]
  loading: boolean
  error: string | null
  onEdit?: (project: Project) => void
  onDelete?: (project: Project) => void
  deletingProjectId?: number | null
}

export function ProjectList({
  projects,
  loading,
  error,
  onEdit,
  onDelete,
  deletingProjectId,
}: ProjectListProps) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (projects.length === 0) {
    return <Typography color="text.secondary">No hay proyectos.</Typography>
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {projects.map((project) => (
          <Card
            key={project.id}
            component={RouterLink}
            to={`/projects/${project.id}`}
            variant="outlined"
            sx={{
              backgroundColor: 'background.paper',
              borderColor: 'rgba(199, 183, 255, 0.55)',
              color: 'inherit',
              textDecoration: 'none',
              transition: 'background-color 180ms ease, transform 180ms ease, box-shadow 180ms ease',
              '&:hover': {
                backgroundColor: '#f8d9e7',
                borderColor: '#e7b8cf',
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 24px rgba(42, 45, 52, 0.14)',
                '& .project-label': {
                  color: 'text.primary',
                },
              },
            }}
          >
            <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                  {project.name}
                </Typography>
                <Box sx={{ display: 'flex' }}>
                  <IconButton
                    size="small"
                    aria-label={`Editar ${project.name}`}
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      onEdit?.(project)
                    }}
                  >
                    <EditOutlined fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="secondary"
                    aria-label={`Eliminar ${project.name}`}
                    disabled={deletingProjectId === project.id}
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      onDelete?.(project)
                    }}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Typography color="text.secondary">
                {project.description || 'Sin descripción'}
                {project.createdAt && ` · ${new Date(project.createdAt).toLocaleDateString()}`}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  )
}

