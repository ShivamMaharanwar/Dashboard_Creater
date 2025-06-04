
import React, { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Download, Share2, Settings } from "lucide-react";
import { SettingsPanel } from "./SettingsPanel";

interface DashboardHeaderProps {
  data?: any;
}

export function DashboardHeader({ data }: DashboardHeaderProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 relative">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h1>
            <p className="text-sm text-gray-600">Professional Data Visualization Tool</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className={showSettings ? "bg-gray-100" : ""}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] z-50 shadow-lg">
          <SettingsPanel 
            data={data} 
            onClose={() => setShowSettings(false)} 
          />
        </div>
      )}
    </>
  );
}
