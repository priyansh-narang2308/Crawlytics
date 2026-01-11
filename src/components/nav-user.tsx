import { ChevronsUpDown, LogOut, Loader2 } from 'lucide-react'
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
import { Button } from '@/components/ui/button'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import React from 'react'
import { NavUserProps } from '@/lib/types'

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Signed out successfully.')
          setIsDialogOpen(false)
          navigate({ to: '/' })
        },
        onError: ({ error }) => {
          toast.error(error.message)
          setIsLoggingOut(false)
        },
      },
    })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent cursor-pointer data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={
                    user.image ??
                    `https://api.dicebear.com/9.x/personas/svg?seed=${user.name}`
                  }
                  alt={user?.name}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={
                      user.image ??
                      `https://api.dicebear.com/9.x/personas/svg?seed=${user.name}`
                    }
                    alt={user?.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="
        text-red-600
        focus:text-red-600
        hover:text-red-600
        hover:bg-red-500/10
        focus:bg-red-500/10
        cursor-pointer
      "
                  onSelect={(e) => e.preventDefault()}
                >
                  <LogOut className="mr-2 h-4 w-4 text-red-600" />
                  Log out
                </DropdownMenuItem>
              </AlertDialogTrigger>

              <AlertDialogContent
                onEscapeKeyDown={(e) => {
                  if (isLoggingOut) e.preventDefault()
                }}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>Log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You'll be signed out of your account and redirected to
                    login.
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
                      </span>
                    ) : (
                      'Log out'
                    )}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
