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
  Command,
  AudioWaveform, ChevronsUpDown
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";

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
      title: 'Home',
      url: '/',
      icon: Home
    },
    {
      title: 'Dashboard',
      url: '/dashboard',
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
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Nexus</span>
                    <span className="">v1.0.0</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Core Views</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.mainNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Management & Monitoring</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.secondaryNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.tertiaryNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
