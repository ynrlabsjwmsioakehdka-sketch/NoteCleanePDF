import React, { useState } from 'react';
import { ProcessedImage } from '../types';
import { Download, ArrowRight, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface ResultsViewProps {
  images: ProcessedImage[];
  onDownload: () => void;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ images, onDownload, onReset }) => {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Conversion Complete!</h2>
          <p className="text-slate-500">{images.length} slides processed successfully.</p>
        </div>
        <div className="flex items-center gap-3">
           <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
          >
            {showOriginal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showOriginal ? "Hide Original" : "Compare Original"}
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Start Over
          </button>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
          >
            <Download className="w-5 h-5" />
            Download PowerPoint
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <div key={img.id} className="group relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
            <div className="aspect-video bg-slate-100 relative overflow-hidden">
              <img 
                src={showOriginal ? img.original : img.cleaned} 
                alt={`Slide ${img.id + 1}`}
                className="w-full h-full object-contain"
              />
              
              {/* Badge */}
              <div className="absolute top-2 right-2">
                 {img.status === 'success' ? (
                   <span className={`px-2 py-1 rounded-md text-xs font-bold shadow-sm ${showOriginal ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                     {showOriginal ? 'ORIGINAL' : 'CLEANED'}
                   </span>
                 ) : (
                   <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold shadow-sm">FAILED</span>
                 )}
              </div>

              {/* Slide Number */}
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                Slide {img.id + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom Action (Call to action repetition for long lists) */}
      {images.length > 6 && (
        <div className="mt-8 text-center">
           <button
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Download PowerPoint Presentation
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};