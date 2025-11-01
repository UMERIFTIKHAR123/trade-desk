"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Box,
  Boxes,
  Command,
  Frame,
  GalleryVerticalEnd,
  HandCoins,
  Map,
  PieChart,
  ReceiptText,
  Settings2,
  SquareTerminal,
  Store,
  Users,
  Users2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  masterData: [
    {
      title: "Product's Categories",
      url: '/dashboard/categories',
      icon: Boxes,
    },
    {
      title: "Products",
      url: '/dashboard/products',
      icon: Box
    },
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: Users
    },
    {
      title: "Purchase Orders",
      url: "#",
      icon: ReceiptText,
      items: [
        {
          title: "New PO",
          url: "/dashboard/purchase-orders/new",
        },
        {
          title: "History",
          url: "/dashboard/purchase-orders",
        }
      ]
    },
    {
      title: "Vendors",
      url: "/dashboard/vendors",
      icon: Store
    },
    {
      title: "Vendor Rates",
      url: "/dashboard/vendor-rates/management",
      icon: HandCoins
    },
  ],
  procurement: [

    // {
    //   title: "Playground",
    //   url: "#",
    //   icon: SquareTerminal,
    //   isActive: true,
    //   items: [
    //     {
    //       title: "History",
    //       url: "#",
    //     },
    //     {
    //       title: "Starred",
    //       url: "#",
    //     },
    //     {
    //       title: "Settings",
    //       url: "#",
    //     },
    //   ],
    // },

  ],
  projects: [
    // {
    //   name: "Design Engineering",
    //   url: "#",
    //   icon: Frame,
    // },

  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <div className="px-3 py-4 text-lg font-medium">The Trade Desk</div>
      </SidebarHeader>
      <SidebarContent>

        <NavMain groupTitle="" items={data.masterData} />

        {/* <NavMain groupTitle="Procurement" items={data.procurement} /> */}

        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
