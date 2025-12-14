import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface ProcessingViewProps {
  status: string;
  progress: number;
  processedCount: number;
  currentImage?: string;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ 
  status, 
  progress, 
  processedCount, 
  currentImage 
}) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
              Processing Slides
            </h3>
            <p className="text-slate-500 mt-1">Removing watermarks...</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-indigo-600">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 mb-8 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status & Preview Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-700 font-medium">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              {status}
            </div>
            <div className="text-sm text-slate-500 pl-8">
              Processed {processedCount} slides so far...
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-800">
              <p>Note: We are analyzing the pixel data to intelligently fill the watermark area with the surrounding background.</p>
            </div>
          </div>

          <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-200 shadow-inner flex items-center justify-center">
            {currentImage ? (
              <>
                <img 
                  src={currentImage} 
                  alt="Processing" 
                  className="w-full h-full object-contain opacity-75 blur-[2px] transition-all" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm font-semibold text-indigo-600 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Processing...
                  </div>
                </div>
              </>
            ) : (
              <div className="text-slate-400 text-sm">Waiting for content...</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};