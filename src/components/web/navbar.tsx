'use client'

import React from 'react'
import { Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { CrawlyticsIcon } from '../icons/logo'

export const Navbar = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
              <Link to="/login" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Login
              </Link>
              <Link to="/signup" className={buttonVariants({ variant: 'default', size: 'sm' })}>
                Get Started
              </Link>
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
                <Link to="/login" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                  Login
                </Link>
                <Link to="/signup" className={buttonVariants({ variant: 'default', size: 'sm' })}>
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
