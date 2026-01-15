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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { Sparkles } from 'lucide-react'

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
              ? 'bg-zinc-950/80 backdrop-blur-md border border-white/10 will-change-[backdrop-filter]'
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

            <div className="lg:hidden">
              <Sheet open={menuState} onOpenChange={setMenuState}>
                <SheetTrigger asChild>
                  <button
                    className="flex size-10 items-center justify-center rounded-xl bg-zinc-900 border border-white/5 text-zinc-200"
                    aria-label="Toggle menu"
                  >
                    <Menu className="size-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full bg-black border-none p-0 flex flex-col">
                  <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
                    <Link
                      to="/"
                      onClick={() => setMenuState(false)}
                      className="flex items-center gap-2 font-semibold tracking-tight text-white"
                    >
                      <CrawlyticsIcon className="h-8 w-8 text-orange-500" />
                      <span className="text-xl">Crawlytics</span>
                    </Link>

                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
                    {/* Badge from Hero */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                      <Sparkles className="size-3" />
                      The Future of Web Content Discovery
                    </div>

                    <div className="w-full flex flex-col gap-4">
                      {isPending ? null : session ? (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setMenuState(false)}
                            className={cn(
                              buttonVariants({
                                variant: 'outline',
                                size: 'lg',
                              }),
                              'w-full h-14 rounded-2xl border-white/10 text-lg font-bold bg-white/5',
                            )}
                          >
                            <LayoutDashboard className="mr-2 h-5 w-5" />
                            Dashboard
                          </Link>
                          <Button
                            variant="destructive"
                            size="lg"
                            className="w-full h-14 rounded-2xl text-lg font-bold"
                            onClick={() => {
                              setMenuState(false)
                              setIsDialogOpen(true)
                            }}
                          >
                            <LogOut className="mr-2 h-5 w-5" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            onClick={() => setMenuState(false)}
                            className={cn(
                              buttonVariants({
                                variant: 'outline',
                                size: 'lg',
                              }),
                              'w-full h-14 rounded-2xl border-white/10 text-lg font-bold bg-white/5',
                            )}
                          >
                            Login
                          </Link>
                          <Link
                            to="/signup"
                            onClick={() => setMenuState(false)}
                            className={cn(
                              buttonVariants({
                                variant: 'default',
                                size: 'lg',
                              }),
                              'w-full h-14 rounded-2xl text-lg font-bold bg-emerald-600 hover:bg-emerald-500',
                            )}
                          >
                            Get Started
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-8 border-t border-white/5 text-center">
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
                      Version 1.0.4 — System Online
                    </p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
