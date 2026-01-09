import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Link } from '@tanstack/react-router'
import { User, Mail, Lock } from 'lucide-react'
import { CrawlyticsIcon } from '../icons/logo'

export function SignupForm() {
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
          <form className="grid gap-4">
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="name" className="text-zinc-300">
                  Full Name
                </FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 text-white h-11 transition-all"
                    required
                  />
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="email" className="text-zinc-300">
                  Email address
                </FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 text-white h-11 transition-all"
                    required
                  />
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="password" className="text-zinc-300">
                  Password
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 text-white h-11 transition-all"
                    required
                  />
                </div>
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
