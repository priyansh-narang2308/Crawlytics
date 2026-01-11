import { createAuthClient } from 'better-auth/react'

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.BETTER_AUTH_URL || 'http://127.0.0.1:3000'
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
})

