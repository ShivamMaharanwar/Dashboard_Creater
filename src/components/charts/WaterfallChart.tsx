
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface WaterfallChartProps {
  data: any[];
}

export function WaterfallChart({ data }: WaterfallChartProps) {
  // Transform data for waterfall visualization
  let cumulativeValue = 0;
  const waterfallData = data.slice(0, 6).map((item, index) => {
    const value = item.value || 0;
    const start = cumulativeValue;
    cumulativeValue += value;
    
    return {
      name: item.name,
      value: value,
      start: start,
      end: cumulativeValue,
      cumulative: cumulativeValue,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={waterfallData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [
            `${name}: ${value}`,
            name === 'cumulative' ? 'Total' : 'Change'
          ]}
        />
        <Bar dataKey="value" fill="#0088FE" />
        <Bar dataKey="cumulative" fill="#00C49F" fillOpacity={0.3} />
      </BarChart>
    </ResponsiveContainer>
  );
}
