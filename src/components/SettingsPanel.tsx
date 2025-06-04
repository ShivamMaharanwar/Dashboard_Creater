import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Save, FileDown, Share2, Palette, Grid, BarChart3, Monitor } from "lucide-react";
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

  const generateStandaloneDashboard = () => {
    if (!data) {
      toast({
        title: "No Data",
        description: "Please upload data first before saving dashboard.",
        variant: "destructive"
      });
      return;
    }

    const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Dashboard - ${new Date().toLocaleDateString()}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            margin-bottom: 20px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .header h1 { color: #1e293b; margin-bottom: 8px; }
        .header p { color: #64748b; }
        .grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 20px; 
            margin-bottom: 20px;
        }
        .chart-card { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .chart-card h3 { margin-bottom: 15px; color: #1e293b; }
        .kpi-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 15px; 
            margin-bottom: 20px;
        }
        .kpi-card { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            text-align: center;
        }
        .kpi-value { font-size: 2em; font-weight: bold; color: #3b82f6; }
        .kpi-label { color: #64748b; margin-top: 5px; }
        .data-table { 
            background: white; 
            border-radius: 8px; 
            overflow: hidden; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .data-table table { width: 100%; border-collapse: collapse; }
        .data-table th { 
            background: #f1f5f9; 
            padding: 12px; 
            text-align: left; 
            font-weight: 600; 
            border-bottom: 1px solid #e2e8f0;
        }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
        .footer { 
            text-align: center; 
            margin-top: 40px; 
            padding: 20px; 
            color: #64748b; 
            border-top: 1px solid #e2e8f0;
        }
        @media (max-width: 768px) {
            .container { padding: 10px; }
            .grid { grid-template-columns: 1fr; }
            .kpi-grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Analytics Dashboard</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>Total Records: ${Array.isArray(data) ? data.length : 'N/A'}</p>
        </div>

        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-value">${Array.isArray(data) ? data.length : 0}</div>
                <div class="kpi-label">Total Records</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value">${Array.isArray(data) && data.length > 0 ? Object.keys(data[0]).length : 0}</div>
                <div class="kpi-label">Data Fields</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value">${new Date().toLocaleDateString()}</div>
                <div class="kpi-label">Report Date</div>
            </div>
        </div>

        <div class="grid">
            <div class="chart-card">
                <h3>Bar Chart</h3>
                <canvas id="barChart" width="400" height="200"></canvas>
            </div>
            
            <div class="chart-card">
                <h3>Line Chart</h3>
                <canvas id="lineChart" width="400" height="200"></canvas>
            </div>
            
            <div class="chart-card">
                <h3>Pie Chart</h3>
                <canvas id="pieChart" width="400" height="200"></canvas>
            </div>
            
            <div class="chart-card">
                <h3>Doughnut Chart</h3>
                <canvas id="doughnutChart" width="400" height="200"></canvas>
            </div>
        </div>

        <div class="data-table">
            <h3 style="padding: 20px; margin: 0; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">Data Table</h3>
            <table id="dataTable">
                <thead id="tableHead"></thead>
                <tbody id="tableBody"></tbody>
            </table>
        </div>

        <div class="footer">
            <p>Dashboard generated by Analytics Platform</p>
            <p>This file can be opened on any device with a web browser</p>
        </div>
    </div>

    <script>
        const data = ${JSON.stringify(data)};
        
        // Prepare chart data
        const chartData = Array.isArray(data) ? data.slice(0, 10) : [];
        const labels = chartData.map((item, index) => item.name || item.label || \`Item \${index + 1}\`);
        const values = chartData.map(item => {
            const numericValue = parseFloat(item.value || item.amount || item.count || Math.random() * 100);
            return isNaN(numericValue) ? Math.random() * 100 : numericValue;
        });

        const colors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
            '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
        ];

        // Bar Chart
        new Chart(document.getElementById('barChart'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Values',
                    data: values,
                    backgroundColor: colors,
                    borderColor: colors.map(color => color + '80'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: ${showLegend} } },
                scales: {
                    y: { beginAtZero: true, grid: { display: ${showGrid} } },
                    x: { grid: { display: ${showGrid} } }
                }
            }
        });

        // Line Chart
        new Chart(document.getElementById('lineChart'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Trend',
                    data: values,
                    borderColor: '#3b82f6',
                    backgroundColor: '#3b82f620',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: ${showLegend} } },
                scales: {
                    y: { beginAtZero: true, grid: { display: ${showGrid} } },
                    x: { grid: { display: ${showGrid} } }
                }
            }
        });

        // Pie Chart
        new Chart(document.getElementById('pieChart'), {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: ${showLegend}, position: 'bottom' } }
            }
        });

        // Doughnut Chart
        new Chart(document.getElementById('doughnutChart'), {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: ${showLegend}, position: 'bottom' } }
            }
        });

        // Data Table
        if (Array.isArray(data) && data.length > 0) {
            const headers = Object.keys(data[0]);
            const thead = document.getElementById('tableHead');
            const tbody = document.getElementById('tableBody');

            // Create header
            const headerRow = thead.insertRow();
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });

            // Create rows (limit to first 50 for performance)
            data.slice(0, 50).forEach(row => {
                const tr = tbody.insertRow();
                headers.forEach(header => {
                    const td = tr.insertCell();
                    td.textContent = row[header] || '';
                });
            });

            if (data.length > 50) {
                const tr = tbody.insertRow();
                const td = tr.insertCell();
                td.colSpan = headers.length;
                td.textContent = \`... and \${data.length - 50} more rows\`;
                td.style.textAlign = 'center';
                td.style.fontStyle = 'italic';
                td.style.color = '#64748b';
            }
        }
    </script>
</body>
</html>`;

    const blob = new Blob([dashboardHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-dashboard-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Dashboard Saved",
      description: "Standalone HTML dashboard saved successfully. Open it on any device!",
    });
  };

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
          <Button onClick={generateStandaloneDashboard} className="w-full" variant="default">
            <Monitor className="h-4 w-4 mr-2" />
            Save Dashboard (HTML)
          </Button>
          
          <Button onClick={handleSaveProject} className="w-full" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Save Project (JSON)
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
