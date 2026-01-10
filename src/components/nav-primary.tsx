'use client'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { NavPrimaryProps } from '@/lib/types'
import { Link, useMatchRoute } from '@tanstack/react-router'

export function NavPrimary({ items }: NavPrimaryProps) {
  const matchRoute = useMatchRoute()
  const { isMobile, setOpen } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = matchRoute({ to: item.to, fuzzy: true })

            return (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  asChild
                  isActive={!!isActive}
                  onClick={() => {
                    if (isMobile) {
                      setOpen(false)
                    }
                  }}
                >
                  <Link to={item.to}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
