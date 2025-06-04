
import React, { useState } from "react";
import { FileUpload } from "./FileUpload";
import { ChartGrid } from "./ChartGrid";
import { CommandInput } from "./CommandInput";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardContent() {
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [commandData, setCommandData] = useState<any>(null);

  const handleDataUpload = (data: any) => {
    setUploadedData(data);
  };

  const handleCommandGeneration = (data: any) => {
    setCommandData(data);
  };

  const displayData = commandData || uploadedData;

  if (!displayData) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-dashed border-2 border-gray-300">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to Analytics Dashboard</CardTitle>
            <CardDescription className="text-lg">
              Upload your data file or use AI commands to create professional visualizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload File</TabsTrigger>
                <TabsTrigger value="command">AI Command</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-6">
                <FileUpload onDataUpload={handleDataUpload} />
              </TabsContent>
              <TabsContent value="command" className="mt-6">
                <CommandInput onDataGeneration={handleCommandGeneration} />
              </TabsContent>
            </Tabs>
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
      
      <ChartGrid data={displayData} />
    </div>
  );
}
