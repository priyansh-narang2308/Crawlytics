import { buttonVariants } from '@/components/ui/button'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden">
      
      <div className="absolute top-8 left-8 z-10">
        <Link
          to="/"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            ' transition-colors',
          )}
        >
          <ArrowLeft className="mr-2 size-4" /> Back to home
        </Link>
      </div>

      <main className="relative z-10 w-full flex items-center justify-center p-4">
        <Outlet />
      </main>
    </div>
  )
}
