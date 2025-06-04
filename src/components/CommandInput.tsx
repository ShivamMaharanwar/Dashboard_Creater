
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Sparkles, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommandInputProps {
  onDataGeneration: (data: any) => void;
}

export function CommandInput({ onDataGeneration }: CommandInputProps) {
  const [command, setCommand] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const exampleCommands = [
    "Create a sales dashboard with monthly revenue data",
    "Generate customer analytics with pie charts",
    "Show financial KPIs with trend analysis",
    "Build a marketing performance dashboard"
  ];

  const generateVisualization = () => {
    if (!command.trim()) {
      toast({
        title: "Command Required",
        description: "Please enter a command to generate visualization",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI processing and generate sample data based on command
    setTimeout(() => {
      let generatedData;

      if (command.toLowerCase().includes("sales") || command.toLowerCase().includes("revenue")) {
        generatedData = [
          { month: "Jan", revenue: 45000, profit: 12000, customers: 120 },
          { month: "Feb", revenue: 52000, profit: 15000, customers: 135 },
          { month: "Mar", revenue: 48000, profit: 13500, customers: 128 },
          { month: "Apr", revenue: 61000, profit: 18500, customers: 155 },
          { month: "May", revenue: 55000, profit: 16000, customers: 142 },
          { month: "Jun", revenue: 67000, profit: 21000, customers: 168 },
        ];
      } else if (command.toLowerCase().includes("customer") || command.toLowerCase().includes("analytics")) {
        generatedData = [
          { segment: "Enterprise", count: 450, value: 2500000 },
          { segment: "SMB", count: 1200, value: 850000 },
          { segment: "Startup", count: 800, value: 320000 },
          { segment: "Individual", count: 2000, value: 180000 },
        ];
      } else if (command.toLowerCase().includes("financial") || command.toLowerCase().includes("kpi")) {
        generatedData = [
          { metric: "Revenue", current: 450000, target: 500000, growth: 12.5 },
          { metric: "Profit Margin", current: 18.5, target: 20.0, growth: 2.1 },
          { metric: "Customer Acquisition", current: 1250, target: 1500, growth: 8.3 },
          { metric: "Churn Rate", current: 2.1, target: 1.5, growth: -15.2 },
        ];
      } else if (command.toLowerCase().includes("marketing") || command.toLowerCase().includes("performance")) {
        generatedData = [
          { channel: "Email", impressions: 125000, clicks: 3750, conversions: 187, cost: 2500 },
          { channel: "Social Media", impressions: 89000, clicks: 2670, conversions: 134, cost: 1800 },
          { channel: "PPC", impressions: 156000, clicks: 4680, conversions: 234, cost: 5200 },
          { channel: "Content", impressions: 67000, clicks: 2010, conversions: 101, cost: 1200 },
        ];
      } else {
        // Default sample data
        generatedData = [
          { name: "Category A", value: 400, trend: 12.5 },
          { name: "Category B", value: 300, trend: -5.2 },
          { name: "Category C", value: 200, trend: 8.7 },
          { name: "Category D", value: 150, trend: 15.3 },
          { name: "Category E", value: 100, trend: -2.1 },
        ];
      }

      onDataGeneration(generatedData);
      toast({
        title: "Visualization Generated!",
        description: "Your dashboard has been created based on your command.",
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Dashboard Generator</h3>
              <p className="text-gray-600">Describe what visualization you want to create</p>
            </div>
          </div>

          <Textarea
            placeholder="Example: Create a sales dashboard showing monthly revenue, profit margins, and customer growth trends..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            rows={4}
            className="w-full"
          />

          <Button 
            onClick={generateVisualization} 
            disabled={isGenerating}
            className="w-full gap-2"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                Generating Dashboard...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Generate Visualization
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-gray-900 mb-3">Example Commands:</h4>
          <div className="space-y-2">
            {exampleCommands.map((example, index) => (
              <button
                key={index}
                onClick={() => setCommand(example)}
                className="text-left text-sm text-blue-600 hover:text-blue-800 hover:underline block"
              >
                "{example}"
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
