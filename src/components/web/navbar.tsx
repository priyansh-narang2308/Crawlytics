'use client'

import React from 'react'
import { Menu, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { CrawlyticsIcon } from '../icons/logo'
import { authClient } from '@/lib/auth-client'

import { LogOut, LayoutDashboard, Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

export const Navbar = () => {
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  const { isPending, data: session } = authClient.useSession()

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Signed out successfully.')
          setIsDialogOpen(false)
        },
        onError: ({ error }) => {
          toast.error(error.message)
          setIsLoggingOut(false)
        },
      },
    })
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav data-state={menuState && 'active'} className="px-3">
        <div
          className={cn(
            'mx-auto mt-3 max-w-6xl rounded-2xl transition-all duration-300',
            isScrolled
              ? 'bg-zinc-950/70 backdrop-blur-xl border border-white/10'
              : 'bg-transparent',
          )}
        >
          <div className="relative flex items-center justify-between px-5 py-3 lg:px-6">
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold tracking-tight text-white"
            >
              <CrawlyticsIcon className="h-8 w-8 text-orange-500" />
              <span className="text-lg">Crawlytics</span>
            </Link>

            <div className="hidden items-center gap-3 lg:flex">
              {isPending ? null : session ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className={buttonVariants({
                      variant: 'default',
                      size: 'sm',

                    })}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>

                  <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-400 cursor-pointer hover:text-red-500"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Log out?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You'll be signed out of your account. You can log back
                          in anytime.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault()
                            handleLogout()
                          }}
                          disabled={isLoggingOut}
                        >
                          {isLoggingOut ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
                              Logging out...
                            </span>
                          ) : (
                            'Log out'
                          )}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'sm',
                    })}
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className={buttonVariants({
                      variant: 'default',
                      size: 'sm',
                    })}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={() => setMenuState(!menuState)}
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              {!menuState ? (
                <Menu className="size-6 text-zinc-200" />
              ) : (
                <X className="size-6 text-zinc-200" />
              )}
            </button>
          </div>

          {menuState && (
            <div className="lg:hidden px-5 py-6">
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/login"
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={buttonVariants({ variant: 'default', size: 'sm' })}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
