'use client'

import { BookmarkIcon, CompassIcon, Import } from 'lucide-react'

import { NavPrimary } from '@/components/nav-primary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Link, linkOptions } from '@tanstack/react-router'
import { CrawlyticsIcon } from './icons/logo'
import { NavPrimaryProps, NavUserProps } from '@/lib/types'

const navItems: NavPrimaryProps['items'] = linkOptions([
  {
    title: 'Items',
    icon: BookmarkIcon,
    to: '/dashboard/items',
  },
  {
    title: 'Import',
    icon: Import,
    to: '/dashboard/import',
  },
  {
    title: 'Discover',
    icon: CompassIcon,
    to: '/dashboard/discover',
  },
])

export function AppSidebar({ user }: NavUserProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="
          justify-start
          group-data-[collapsible=icon]:justify-center
        "
            >
              <Link to="/dashboard" className="flex items-center gap-3">
                <div
                  className="
              flex h-10 w-10 items-center justify-center
              rounded-lg
              text-orange-500
              transition-all
              group-data-[collapsible=icon]:h-11
              group-data-[collapsible=icon]:w-11
            "
                >
                  <CrawlyticsIcon className="h-6 w-6" />
                </div>

                <div
                  className="
              grid text-left text-sm leading-tight
              transition-all
              group-data-[collapsible=icon]:hidden
            "
                >
                  <span className="font-semibold tracking-tight">
                    Crawlytics
                  </span>
                  <span className="text-xs text-muted-foreground">
                    AI Knowledge Base
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavPrimary items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
