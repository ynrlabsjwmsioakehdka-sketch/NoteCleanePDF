import React, { useState, useCallback } from 'react';
import { UploadZone } from './components/UploadZone';
import { ProcessingView } from './components/ProcessingView';
import { ResultsView } from './components/ResultsView';
import { extractImagesFromPdf } from './services/pdfService';
import { removeWatermark } from './services/watermarkService';
import { createAndDownloadPPT } from './services/pptService';
import { ProcessedImage, AppState } from './types';
import { Layout } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      setAppState('extracting');
      setCurrentStatus('Parsing PDF and extracting pages...');
      setError(null);

      // 1. Extract images from PDF
      const originalImages = await extractImagesFromPdf(file);
      
      setAppState('processing');
      setCurrentStatus('Initializing image processing...');
      
      const total = originalImages.length;
      const results: ProcessedImage[] = [];

      // 2. Process each image with local algorithm
      for (let i = 0; i < total; i++) {
        setCurrentStatus(`Cleaning slide ${i + 1} of ${total}...`);
        setProgress(((i) / total) * 100);

        try {
          const cleanedBase64 = await removeWatermark(originalImages[i]);
          results.push({
            id: i,
            original: originalImages[i],
            cleaned: cleanedBase64,
            status: 'success'
          });
        } catch (err) {
          console.error(`Failed to process page ${i + 1}`, err);
          results.push({
            id: i,
            original: originalImages[i],
            cleaned: originalImages[i], // Fallback to original
            status: 'error'
          });
        }
        
        // Update state progressively
        setProcessedImages([...results]);
        // Small delay to allow UI to update if processing is too fast
        await new Promise(r => setTimeout(r, 50));
      }

      setProgress(100);
      setAppState('completed');
      setCurrentStatus('All slides processed!');

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
      setAppState('idle');
    }
  }, []);

  const handleDownloadPPT = async () => {
    if (processedImages.length === 0) return;
    await createAndDownloadPPT(processedImages);
  };

  const handleReset = () => {
    setAppState('idle');
    setProcessedImages([]);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              NoteCleaner
            </h1>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Fast Local Processing
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          {appState === 'idle' && (
            <div className="max-w-2xl mx-auto mt-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Remove NotebookLM Watermarks
                </h2>
                <p className="text-lg text-slate-600">
                  Upload your NotebookLM-generated PDF. We'll use smart algorithms to clean the slides and convert them back to PowerPoint.
                </p>
              </div>
              <UploadZone onFileSelect={handleFileSelect} />
            </div>
          )}

          {(appState === 'extracting' || appState === 'processing') && (
            <ProcessingView 
              status={currentStatus} 
              progress={progress} 
              processedCount={processedImages.length}
              currentImage={processedImages.length > 0 ? processedImages[processedImages.length - 1].original : undefined}
            />
          )}

          {appState === 'completed' && (
            <ResultsView 
              images={processedImages} 
              onDownload={handleDownloadPPT}
              onReset={handleReset}
            />
          )}

        </div>
      </main>
    </div>
  );
};

export default App;