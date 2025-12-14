// We access the global pdfjsLib loaded via script tag in index.html
// This avoids complex bundler configuration for the worker
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export const extractImagesFromPdf = async (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
        const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
        const totalPages = pdf.numPages;
        const images: string[] = [];

        // Canvas for rendering
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
          reject(new Error("Could not create canvas context"));
          return;
        }

        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          
          // Render at a high enough scale for quality
          const viewport = page.getViewport({ scale: 2.0 });
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;
          
          // Convert to JPEG for slightly smaller payload than PNG, keeping high quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
          images.push(dataUrl);
        }

        resolve(images);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
};