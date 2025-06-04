
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardContent } from "@/components/DashboardContent";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gray-50">
        <DashboardHeader />
        <div className="flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <DashboardContent />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
