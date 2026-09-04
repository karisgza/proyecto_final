import LogoutIcon from '@mui/icons-material/Logout'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

export function Layout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: 960,
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            py: 2,
            boxSizing: 'border-box',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            TaskFlow
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <Button startIcon={<LogoutIcon />} onClick={handleLogout} color="inherit">
              Log Out
            </Button>
          </Box>
        </Box>
      </Box>
      <Outlet />
    </Box>
  )
}
