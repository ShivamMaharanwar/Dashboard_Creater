
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, AlertCircle, FileText, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onDataUpload: (data: any) => void;
}

export function FileUpload({ onDataUpload }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const processFile = useCallback((file: File) => {
    console.log('Processing file:', file.name, 'Size:', file.size, 'bytes');
    
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);
    
    const reader = new FileReader();
    
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 100;
        setUploadProgress(progress);
      }
    };
    
    reader.onload = (e) => {
      try {
        let data;
        const result = e.target?.result as string;
        
        if (file.name.endsWith('.json')) {
          data = JSON.parse(result);
        } else if (file.name.endsWith('.csv') || file.name.endsWith('.tsv')) {
          // Enhanced CSV/TSV parsing
          const delimiter = file.name.endsWith('.tsv') ? '\t' : ',';
          const lines = result.split('\n').filter(line => line.trim());
          
          if (lines.length === 0) {
            throw new Error('Empty file');
          }
          
          const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''));
          data = lines.slice(1).map(line => {
            const values = line.split(delimiter).map(v => v.trim().replace(/"/g, ''));
            const obj: any = {};
            headers.forEach((header, index) => {
              let value = values[index] || '';
              // Try to parse numbers
              if (!isNaN(Number(value)) && value !== '') {
                value = Number(value);
              }
              obj[header] = value;
            });
            return obj;
          }).filter(row => Object.values(row).some(val => val !== '' && val !== null && val !== undefined));
          
        } else if (file.name.endsWith('.txt')) {
          // Handle structured text files
          const lines = result.split('\n').filter(line => line.trim());
          data = lines.map((line, index) => ({
            id: index + 1,
            content: line.trim(),
            length: line.length
          }));
          
        } else if (file.name.endsWith('.xml')) {
          // Basic XML parsing (convert to JSON structure)
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(result, "text/xml");
          
          const xmlToJson = (node: any): any => {
            const obj: any = {};
            
            if (node.nodeType === 1) { // Element node
              if (node.attributes) {
                for (let i = 0; i < node.attributes.length; i++) {
                  const attr = node.attributes[i];
                  obj[`@${attr.nodeName}`] = attr.nodeValue;
                }
              }
              
              if (node.childNodes) {
                for (let i = 0; i < node.childNodes.length; i++) {
                  const child = node.childNodes[i];
                  
                  if (child.nodeType === 3) { // Text node
                    const text = child.nodeValue?.trim();
                    if (text) obj['#text'] = text;
                  } else if (child.nodeType === 1) { // Element node
                    const childObj = xmlToJson(child);
                    if (obj[child.nodeName]) {
                      if (!Array.isArray(obj[child.nodeName])) {
                        obj[child.nodeName] = [obj[child.nodeName]];
                      }
                      obj[child.nodeName].push(childObj);
                    } else {
                      obj[child.nodeName] = childObj;
                    }
                  }
                }
              }
            }
            
            return obj;
          };
          
          data = xmlToJson(xmlDoc.documentElement);
          
        } else {
          throw new Error('Unsupported file format. Please upload CSV, JSON, TSV, TXT, or XML files.');
        }

        console.log('Processed data:', data);
        onDataUpload(data);
        
        toast({
          title: "Success!",
          description: `Your ${file.name} has been uploaded and processed successfully.`,
        });
        
      } catch (error) {
        console.error('File processing error:', error);
        toast({
          title: "Error",
          description: "Failed to process the file. Please check the format and try again.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
        setUploadProgress(0);
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
      'text/tab-separated-values': ['.tsv'],
      'text/plain': ['.txt'],
      'application/xml': ['.xml'],
      'text/xml': ['.xml'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024 // 50MB
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
            <p className="text-sm text-gray-500 mt-1">
              Maximum file size: 50MB
            </p>
          </div>
          
          {isProcessing && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          
          <div className="flex justify-center">
            <Button variant="outline" disabled={isProcessing}>
              {isProcessing ? `Processing... ${Math.round(uploadProgress)}%` : 'Choose File'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Structured Data</h4>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• CSV files (.csv)</li>
                <li>• TSV files (.tsv)</li>
                <li>• JSON files (.json)</li>
                <li>• Excel files (.xlsx, .xls)</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Text & Markup</h4>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Plain text (.txt)</li>
                <li>• XML files (.xml)</li>
                <li>• Log files</li>
                <li>• Structured text data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900">File Requirements</h4>
            <ul className="text-sm text-gray-600 mt-1 space-y-1">
              <li>• Maximum file size: 50MB</li>
              <li>• Ensure data has proper headers for best results</li>
              <li>• Well-structured data creates better visualizations</li>
              <li>• Large files may take longer to process</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
