
import React from "react";
import { MapPin } from "lucide-react";

interface MapVisualizationProps {
  data: any[];
}

export function MapVisualization({ data }: MapVisualizationProps) {
  // Mock geographic visualization
  const locations = data.slice(0, 5).map((item, index) => ({
    name: item.name,
    value: item.value,
    lat: 40.7128 + (index - 2) * 2, // Mock coordinates around NYC
    lng: -74.0060 + (index - 2) * 3,
  }));

  return (
    <div className="relative h-64 bg-gradient-to-b from-blue-100 to-green-100 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-800">Interactive Map</h3>
          <p className="text-sm text-gray-600">Geographic data visualization</p>
        </div>
      </div>
      
      {/* Mock data points */}
      {locations.map((location, index) => (
        <div
          key={index}
          className="absolute w-3 h-3 bg-red-500 rounded-full animate-pulse"
          style={{
            left: `${20 + index * 15}%`,
            top: `${30 + index * 10}%`,
          }}
          title={`${location.name}: ${location.value}`}
        />
      ))}
      
      <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 rounded px-2 py-1">
        <p className="text-xs text-gray-600">
          {locations.length} data points visualized
        </p>
      </div>
    </div>
  );
}
