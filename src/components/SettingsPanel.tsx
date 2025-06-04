
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Save, FileDown, Share2, Palette, Grid, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsPanelProps {
  data: any;
  onClose: () => void;
}

export function SettingsPanel({ data, onClose }: SettingsPanelProps) {
  const { toast } = useToast();
  const [theme, setTheme] = useState("light");
  const [chartType, setChartType] = useState("auto");
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [exportFormat, setExportFormat] = useState("json");

  const handleSaveProject = () => {
    const projectData = {
      data,
      settings: {
        theme,
        chartType,
        showGrid,
        showLegend
      },
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-project-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Project Saved",
      description: "Your dashboard project has been saved successfully.",
    });
  };

  const handleExportData = () => {
    if (!data) {
      toast({
        title: "No Data",
        description: "Please upload data first before exporting.",
        variant: "destructive"
      });
      return;
    }

    let blob;
    let filename;
    let mimeType;

    switch (exportFormat) {
      case "csv":
        const csvContent = convertToCSV(data);
        blob = new Blob([csvContent], { type: 'text/csv' });
        filename = `dashboard-data-${Date.now()}.csv`;
        mimeType = 'text/csv';
        break;
      case "json":
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        filename = `dashboard-data-${Date.now()}.json`;
        mimeType = 'application/json';
        break;
      case "xlsx":
        // For Excel export, we'll use JSON for now
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        filename = `dashboard-data-${Date.now()}.json`;
        mimeType = 'application/json';
        break;
      default:
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        filename = `dashboard-data-${Date.now()}.json`;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: `Data exported as ${exportFormat.toUpperCase()} successfully.`,
    });
  };

  const convertToCSV = (data: any): string => {
    if (!Array.isArray(data) || data.length === 0) return "";
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  const handleShareDashboard = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Analytics Dashboard',
        text: 'Check out this analytics dashboard I created',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Dashboard link copied to clipboard.",
      });
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Dashboard Settings</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>

      {/* Save & Export Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Save className="h-4 w-4" />
            Save & Export
          </CardTitle>
          <CardDescription>Save your project and export data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleSaveProject} className="w-full" variant="default">
            <Download className="h-4 w-4 mr-2" />
            Save Project
          </Button>
          
          <div className="space-y-2">
            <Label htmlFor="export-format">Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleExportData} className="w-full" variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Export Data
          </Button>

          <Button onClick={handleShareDashboard} className="w-full" variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Dashboard
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Palette className="h-4 w-4" />
            Appearance
          </CardTitle>
          <CardDescription>Customize dashboard appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-grid" className="text-sm">Show Grid</Label>
            <Switch
              id="show-grid"
              checked={showGrid}
              onCheckedChange={setShowGrid}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-legend" className="text-sm">Show Legend</Label>
            <Switch
              id="show-legend"
              checked={showLegend}
              onCheckedChange={setShowLegend}
            />
          </div>
        </CardContent>
      </Card>

      {/* Chart Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4" />
            Chart Settings
          </CardTitle>
          <CardDescription>Configure chart behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chart-type">Default Chart Type</Label>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto Select</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
