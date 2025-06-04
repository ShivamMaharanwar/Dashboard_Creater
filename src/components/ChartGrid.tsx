
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart, ScatterChart, Scatter } from "recharts";
import { KPICard } from "./charts/KPICard";
import { MapVisualization } from "./charts/MapVisualization";
import { WaterfallChart } from "./charts/WaterfallChart";

interface ChartGridProps {
  data: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function ChartGrid({ data }: ChartGridProps) {
  // Sample data processing for demonstration
  const processedData = data.slice(0, 10);
  const numericKeys = Object.keys(data[0] || {}).filter(key => 
    !isNaN(Number(data[0]?.[key])) && data[0]?.[key] !== ''
  );
  const textKeys = Object.keys(data[0] || {}).filter(key => 
    isNaN(Number(data[0]?.[key])) || data[0]?.[key] === ''
  );

  const chartData = processedData.map((item, index) => ({
    name: item[textKeys[0]] || `Item ${index + 1}`,
    value: Number(item[numericKeys[0]]) || 0,
    value2: Number(item[numericKeys[1]]) || 0,
    ...item
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* KPI Cards */}
      <div className="lg:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPICard 
            title="Total Records" 
            value={data.length.toString()} 
            change="+12%" 
            trend="up" 
          />
          <KPICard 
            title="Average Value" 
            value={Math.round(chartData.reduce((acc, item) => acc + item.value, 0) / chartData.length).toString()} 
            change="+5.2%" 
            trend="up" 
          />
          <KPICard 
            title="Max Value" 
            value={Math.max(...chartData.map(item => item.value)).toString()} 
            change="-2.1%" 
            trend="down" 
          />
          <KPICard 
            title="Data Points" 
            value={numericKeys.length.toString()} 
            change="0%" 
            trend="neutral" 
          />
        </div>
      </div>

      {/* Bar Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Bar Chart Analysis</CardTitle>
          <CardDescription>Comparative values across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution Analysis</CardTitle>
          <CardDescription>Proportional breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.slice(0, 6)}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.slice(0, 6).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
          <CardDescription>Data trends over time/categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0088FE" strokeWidth={2} />
              <Line type="monotone" dataKey="value2" stroke="#00C49F" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Area Analysis</CardTitle>
          <CardDescription>Cumulative trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stackId="1" stroke="#0088FE" fill="#0088FE" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Combo Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Combined Analysis</CardTitle>
          <CardDescription>Bar and line combination</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0088FE" />
              <Line type="monotone" dataKey="value2" stroke="#FF8042" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Scatter Plot */}
      <Card>
        <CardHeader>
          <CardTitle>Scatter Analysis</CardTitle>
          <CardDescription>Variable relationships</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="value" />
              <YAxis dataKey="value2" />
              <Tooltip />
              <Scatter dataKey="value" fill="#0088FE" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Map Visualization */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Geographic Visualization</CardTitle>
          <CardDescription>Location-based data mapping</CardDescription>
        </CardHeader>
        <CardContent>
          <MapVisualization data={chartData} />
        </CardContent>
      </Card>

      {/* Waterfall Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Waterfall Analysis</CardTitle>
          <CardDescription>Cumulative effect breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <WaterfallChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
