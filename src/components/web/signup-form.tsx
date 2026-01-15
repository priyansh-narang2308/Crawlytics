import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import React from 'react'

import { CrawlyticsIcon } from '../icons/logo'
import { useForm } from '@tanstack/react-form'
import { signUpSchema } from '@/schemas/auth'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'

export function SignupForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      await authClient.signUp.email({
        name: value.fullName,
        email: value.email,
        password: value.password,
        fetchOptions: {
          onSuccess: () => {
            navigate({ to: '/dashboard' })
            toast.success('Account created successfully.')
          },
          onError: ({ error }) => {
            toast.error(error.message)
            setIsLoading(false)
          },
        },
      })
    },
  })

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl  mb-2">
            <CrawlyticsIcon className="h-8 w-8 text-orange-500" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Create an account
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Join us today and start your journey
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup className="gap-4">
              <Field>
                <form.Field
                  name="fullName"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Sample Name"
                          autoComplete="off"
                          disabled={isLoading}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />

                <form.Field
                  name="email"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="sample@example.com"
                          autoComplete="off"
                          type="email"
                          disabled={isLoading}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
                <form.Field
                  name="password"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="*******"
                          autoComplete="off"
                          type="password"
                          disabled={isLoading}
                        />

                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              className="w-full h-11 text-base cursor-pointer font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-white hover:text-primary transition-colors underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-xs text-zinc-500">
        By creating an account, you agree to our{' '}
        <a href="#" className="underline hover:text-zinc-300 transition-colors">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="underline hover:text-zinc-300 transition-colors">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  )
}
