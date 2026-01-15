import { auth } from '@/lib/auth'
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'

// As server funciton its a function middlware and not request
export const authFnMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) {
      throw redirect({ to: '/login' })
    }
    return next({ context: { session } })
  },
)

export const authMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next, request }) => {
    const url = new URL(request.url)
    // fix for incongnitor
    if (
      !url.password.startsWith('/dashboard') &&
      !url.password.startsWith('/api')
    ) {
      return next()
    }

    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) {
      throw redirect({ to: '/login' })
    }
    return next({ context: { session } })
  },
)
