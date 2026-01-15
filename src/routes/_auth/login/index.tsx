import { LoginForm } from '@/components/web/login-form'
import { createFileRoute } from '@tanstack/react-router'
import Plasma from '@/components/Plasma'

export const Route = createFileRoute('/_auth/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-black overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Plasma
          color="#10b981"
          speed={0.4}
          direction="forward"
          scale={1.2}
          opacity={0.6}
          mouseInteractive={true}
        />
      </div>

      <div className="absolute inset-0 z-1 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.9)_100%)]" />

      {/* Form Container */}
      <div className="relative z-10 w-full flex justify-center py-12">
        <LoginForm />
      </div>
    </div>
  )
}
