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
import { Link } from '@tanstack/react-router'

import { CrawlyticsIcon } from '../icons/logo'
import { useForm } from '@tanstack/react-form'
import { signUpSchema } from '@/schemas/auth'

export function SignupForm() {
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
      console.log('Values: ', value)
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
                          placeholder="John Doe"
                          autoComplete="off"
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
                          placeholder="johndoe@example.com"
                          autoComplete="off"
                          type="email"
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
            >
              Create account
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
