import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

export const getSessionFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  if (!session) {
    throw redirect({ to: '/login' })
  }
  return session
})
