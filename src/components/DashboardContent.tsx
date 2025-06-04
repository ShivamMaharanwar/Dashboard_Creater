
import React, { useState } from "react";
import { FileUpload } from "./FileUpload";
import { ChartGrid } from "./ChartGrid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardContent() {
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("upload");

  const handleDataUpload = (data: any) => {
    setUploadedData(data);
    setActiveSection("dashboard");
  };

  if (!uploadedData) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-dashed border-2 border-gray-300">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to Analytics Dashboard</CardTitle>
            <CardDescription className="text-lg">
              Upload your data file to get started with professional visualizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload onDataUpload={handleDataUpload} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600">Comprehensive data visualization and analytics</p>
        </div>
      </div>
      
      <ChartGrid data={uploadedData} />
    </div>
  );
}
