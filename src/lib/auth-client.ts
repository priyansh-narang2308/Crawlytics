import { createAuthClient } from 'better-auth/react'

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.BETTER_AUTH_URL || 'https://crawlytics.vercel.app'
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
})

