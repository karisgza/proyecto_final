import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { register } from './authService'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}))

vi.mock('../config/apiUrl', () => ({
  getApiBaseUrl: () => 'https://api.example.com',
}))

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registers a user with the expected payload', async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: {} } as never)

    await register(' ana ', ' ana@example.com ', 'secret123')

    expect(axios.post).toHaveBeenCalledWith(
      'https://api.example.com/auth/register',
      {
        username: 'ana',
        email: 'ana@example.com',
        password: 'secret123',
      },
    )
  })

})
