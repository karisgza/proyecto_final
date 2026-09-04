import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { getApiErrorMessage } from '../services/httpClient'
import { register } from '../services/authService'

export function RegisterPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const valid = username.trim().length >= 3 && email.includes('@') && password.length >= 6

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!valid || loading) return

    setLoading(true)
    setError(null)

    try {
      await register(username, email, password)
      showToast('Cuenta creada correctamente')
      navigate('/login')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', maxWidth: 480, mx: 'auto', pt: { xs: 5, sm: 8 }, px: 2, boxSizing: 'border-box' }}>
      <Typography variant="h4" gutterBottom color="text.primary" sx={{ fontWeight: 700 }}>
        Crear cuenta
      </Typography>
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', border: 1, borderColor: 'primary.main', borderRadius: 3 }}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Usuario" value={username} onChange={(event) => setUsername(event.target.value)} required fullWidth autoComplete="username" helperText="Mínimo 3 caracteres" />
          <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required fullWidth autoComplete="email" />
          <TextField label="Contraseña" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required fullWidth autoComplete="new-password" helperText="Mínimo 6 caracteres" />
          <Button type="submit" variant="contained" disabled={!valid || loading}>
            {loading ? 'Creando…' : 'Crear cuenta'}
          </Button>
          <Button component={RouterLink} to="/login" variant="text">
            Volver al inicio de sesión
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
