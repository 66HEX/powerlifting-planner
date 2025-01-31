import React from 'react';

import {
  Home,
  LayoutDashboard,
  Users,
  ClipboardList,
  LineChart,
  Calendar,
  FileText,
  GalleryVerticalEnd,
  Command
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

import { NavUser } from '@/components/nav-user';

const data = {
  teams: [
    {
      name: 'Evil Corp.',
      logo: Command
    }
  ],
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  mainNavigation: [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard
    }
  ],
  secondaryNavigation: [
    {
      title: 'Clients',
      url: '/clients',
      icon: Users
    },
    {
      title: 'Plans',
      url: '/plans',
      icon: ClipboardList
    },
    {
      title: 'Tracking',
      url: '/tracking',
      icon: LineChart
    },
    {
      title: 'Schedule',
      url: '/schedule',
      icon: Calendar
    }
  ],
  tertiaryNavigation: [
    {
      title: 'Documentation',
      url: '/docs',
      icon: FileText
    }
  ]
};

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-white/10 bg-background">
      <SidebarContent className="bg-gradient-to-tr from-transparent to-gray-300/5">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="/" className="hover:bg-gray-300/5 rounded-lg transition-colors">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold text-gray-300">Nexus</span>
                    <span className="text-sm text-gray-400">v1.0.0</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Core Views */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Core Views</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.mainNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="text-gray-300">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management & Monitoring */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Management & Monitoring</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.secondaryNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="text-gray-300">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.tertiaryNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="text-gray-300">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User */}
      <SidebarFooter className="bg-gradient-to-tr from-transparent to-gray-300/5 border-t border-white/10">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
