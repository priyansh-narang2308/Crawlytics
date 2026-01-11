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
import { Mail, Lock, Loader2 } from 'lucide-react'
import { CrawlyticsIcon } from '../icons/logo'
import { useForm } from '@tanstack/react-form'
import { loginSchema } from '@/schemas/auth'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import React from 'react'

export function LoginForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      await authClient.signIn.email({
        email: value.email,
        password: value.password,
        fetchOptions: {
          onSuccess: () => {
            navigate({ to: '/dashboard' })
            toast.success('Logged in successfully.')
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
            Welcome back
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form
            className="grid gap-5"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup className="gap-5">
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-zinc-300"
                      >
                        Email address
                      </FieldLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="sample@example.com"
                          className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 text-white h-11 transition-all"
                          aria-invalid={isInvalid}
                          autoComplete="off"
                          disabled={isLoading}
                        />
                      </div>
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
                      <div className="flex items-center justify-between">
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-zinc-300"
                        >
                          Password
                        </FieldLabel>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />

                        <Input
                          id={field.name}
                          name={field.name}
                          type={'password'}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="pl-10 pr-10 bg-white/5 border-white/10 focus:border-primary/50 text-white h-11 transition-all"
                          aria-invalid={isInvalid}
                          placeholder="••••••••"
                          autoComplete="off"
                        />
                      </div>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </FieldGroup>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-white hover:text-primary transition-colors underline underline-offset-4"
            >
              Get started for free
            </Link>
          </p>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-xs text-zinc-500">
        By continuing, you agree to our{' '}
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
