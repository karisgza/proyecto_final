import { Component, type ErrorInfo, type ReactNode } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Render error', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <Stack spacing={2} alignItems="center" sx={{ p: 4 }}>
        <Typography variant="h5">Algo salió mal</Typography>
        <Alert severity="error">No se pudo mostrar esta pantalla.</Alert>
        <Button variant="contained" onClick={this.handleReset}>
          Intentar de nuevo
        </Button>
      </Stack>
    )
  }
}
