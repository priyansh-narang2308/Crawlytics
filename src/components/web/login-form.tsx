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
      <Card className="border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent" />

        <CardHeader className="space-y-4 text-center pb-12 pt-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 border border-white/10 group-hover:scale-110 group-hover:border-emerald-500/30 transition-all duration-700 shadow-2xl">
            <CrawlyticsIcon className="h-10 w-10 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black tracking-tighter text-white">
              System Login
            </CardTitle>
            <CardDescription className="text-zinc-500 font-medium">
              Access your knowledge engine
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup className="space-y-4">
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid} className="space-y-2">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-[11px] font-black uppercase tracking-widest text-zinc-500 ml-1"
                      >
                        Identifier
                      </FieldLabel>
                      <div className="relative group/field">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within/field:text-emerald-400 transition-colors" />
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="sample@example.com"
                          className="pl-12 bg-zinc-950/50 border-white/5 focus:border-emerald-500/50 text-white h-12 rounded-xl transition-all font-medium placeholder:text-zinc-700"
                          aria-invalid={isInvalid}
                          autoComplete="off"
                          disabled={isLoading}
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} className="text-[11px] font-bold text-rose-500 mt-1 ml-1" />
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
                    <Field data-invalid={isInvalid} className="space-y-2">
                      <div className="flex items-center justify-between ml-1">
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-[11px] font-black uppercase tracking-widest text-zinc-500"
                        >
                          Access Key
                        </FieldLabel>
                        <a href="#" className="text-[10px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-tight">
                          Reset key?
                        </a>
                      </div>
                      <div className="relative group/field">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within/field:text-emerald-400 transition-colors" />
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="pl-12 pr-12 bg-zinc-950/50 border-white/5 focus:border-emerald-500/50 text-white h-12 rounded-xl transition-all font-medium placeholder:text-zinc-700"
                          aria-invalid={isInvalid}
                          placeholder="••••••••"
                          autoComplete="off"
                        />
                      </div>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} className="text-[11px] font-bold text-rose-500 mt-1 ml-1" />
                      )}
                    </Field>
                  )
                }}
              />
            </FieldGroup>

            <Button
              type="submit"
              className="w-full h-12 text-sm font-black uppercase tracking-widest bg-white text-black hover:bg-emerald-400 hover:text-black transition-all duration-500 cursor-pointer rounded-xl group/btn overflow-hidden relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                <span className="flex items-center gap-2 relative z-10">
                  Authenticate Account
                </span>
              )}
              <div className="absolute inset-0 bg-emerald-500 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-500" />
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5">
            <p className="text-center text-[12px] font-bold text-zinc-500 uppercase tracking-tight">
              Awaiting entry?{' '}
              <Link
                to="/signup"
                className="text-white hover:text-emerald-400 transition-colors decoration-emerald-500/30 underline decoration-2 underline-offset-4"
              >
                Create new clearance
              </Link>
            </p>
          </div>
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
