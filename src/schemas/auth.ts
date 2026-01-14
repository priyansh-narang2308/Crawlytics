import z from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const signUpSchema = z.object({
  fullName: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(8),
})
