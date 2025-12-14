import React, { useCallback, useState } from 'react';
import { UploadCloud, FileType } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Use FileList directly which is properly typed, instead of Array.from which may infer unknown[]
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      onFileSelect(files[0]);
    } else {
      alert("Please upload a PDF file.");
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ease-in-out cursor-pointer group
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-[1.01]' 
          : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'
        }
      `}
    >
      <input
        type="file"
        accept=".pdf"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleFileInput}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`
          p-4 rounded-full transition-colors duration-200
          ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}
        `}>
          {isDragging ? <UploadCloud className="w-10 h-10" /> : <FileType className="w-10 h-10" />}
        </div>
        
        <div>
          <p className="text-xl font-semibold text-slate-700 mb-1">
            Drag & Drop your PDF here
          </p>
          <p className="text-sm text-slate-500">
            or click to browse files
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
          <span>Supported Format: PDF</span>
        </div>
      </div>
    </div>
  );
};