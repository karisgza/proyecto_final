import { describe, expect, it } from 'vitest'
import { API_URL } from '../types'
import { getApiBaseUrl } from './apiUrl'

describe('getApiBaseUrl', () => {
  it('removes a trailing slash from the API URL', () => {
    expect(getApiBaseUrl()).toBe(API_URL.replace(/\/$/, ''))
    expect(getApiBaseUrl()).not.toMatch(/\/$/)
  })
})
