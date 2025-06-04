
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onDataUpload: (data: any) => void;
}

export function FileUpload({ onDataUpload }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processFile = useCallback((file: File) => {
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let data;
        
        if (file.name.endsWith('.json')) {
          data = JSON.parse(e.target?.result as string);
        } else if (file.name.endsWith('.csv')) {
          // Simple CSV parsing for demo
          const csvText = e.target?.result as string;
          const lines = csvText.split('\n');
          const headers = lines[0].split(',');
          data = lines.slice(1).map(line => {
            const values = line.split(',');
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header.trim()] = values[index]?.trim();
            });
            return obj;
          }).filter(row => Object.values(row).some(val => val));
        } else {
          throw new Error('Unsupported file format');
        }

        onDataUpload(data);
        toast({
          title: "Success!",
          description: "Your data has been uploaded and processed successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process the file. Please check the format.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.readAsText(file);
  }, [onDataUpload, toast]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });

  return (
    <div className="space-y-6">
      <Card 
        {...getRootProps()} 
        className={`cursor-pointer transition-colors border-2 border-dashed p-8 text-center ${
          isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <CardContent className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-blue-600" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isDragActive ? 'Drop your file here' : 'Upload your data file'}
            </h3>
            <p className="text-gray-600 mt-2">
              Drag and drop your file here, or click to browse
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Choose File'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileSpreadsheet className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900">Supported Formats</h4>
            <ul className="text-sm text-gray-600 mt-1 space-y-1">
              <li>• CSV files (.csv)</li>
              <li>• JSON files (.json)</li>
              <li>• Excel files (.xlsx, .xls)</li>
            </ul>
          </div>
        </div>
        
        <div className="flex items-start gap-3 mt-4">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900">Data Requirements</h4>
            <p className="text-sm text-gray-600 mt-1">
              Ensure your data has proper headers and is well-structured for optimal visualization results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
