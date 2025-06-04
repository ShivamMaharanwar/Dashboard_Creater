
import React from "react";
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  Map, 
  Upload,
  Download,
  Share2,
  Settings
} from "lucide-react";
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

const navigationItems = [
  { title: "Upload Data", icon: Upload, id: "upload" },
  { title: "Bar Charts", icon: BarChart3, id: "bar-charts" },
  { title: "Pie Charts", icon: PieChart, id: "pie-charts" },
  { title: "Line Charts", icon: LineChart, id: "line-charts" },
  { title: "KPI Indicators", icon: TrendingUp, id: "kpi" },
  { title: "Maps", icon: Map, id: "maps" },
  { title: "Export", icon: Download, id: "export" },
  { title: "Share", icon: Share2, id: "share" },
];

interface AppSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function AppSidebar({ activeSection = "upload", onSectionChange }: AppSidebarProps) {
  const { collapsed } = useSidebar();

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible>
      <SidebarContent className="bg-white border-r">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold text-gray-900 mb-4">
            {!collapsed && "Analytics Dashboard"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange?.(item.id)}
                    className={`w-full justify-start px-3 py-2 rounded-lg transition-colors ${
                      activeSection === item.id 
                        ? "bg-blue-100 text-blue-700 font-medium" 
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span className="ml-3">{item.title}</span>}
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
