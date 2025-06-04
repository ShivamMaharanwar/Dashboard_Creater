
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  Upload,
  Settings,
  Home
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "#dashboard"
  },
  {
    title: "Charts",
    icon: BarChart3,
    url: "#charts"
  },
  {
    title: "Analytics",
    icon: TrendingUp,
    url: "#analytics"
  },
  {
    title: "Upload Data",
    icon: Upload,
    url: "#upload"
  },
  {
    title: "Settings",
    icon: Settings,
    url: "#settings"
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-gray-700">
            Analytics Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
