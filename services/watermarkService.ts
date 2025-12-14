/**
 * Removes the NotebookLM watermark from the image using Canvas manipulation.
 * Optimized for NotebookLM's specific watermark position and size.
 * 
 * @param base64Image The source image in base64 format (data URL).
 * @returns The cleaned image in base64 format.
 */
export const removeWatermark = async (base64Image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(base64Image);
        return;
      }

      // 1. Draw the original image
      ctx.drawImage(img, 0, 0);

      // 2. Define the Watermark Region of Interest (ROI)
      // ADJUSTMENT: We have tightened these values significantly to avoid "tearing" 
      // or "smearing" the actual slide content (like the blue content boxes).
      //
      // Width: 0.125 (12.5%) - Covers "NotebookLM" text + logo without extending too far left.
      // Height: 0.035 (3.5%) - The watermark is very short and sits at the absolute bottom. 
      // By reducing height, the top edge of our box (y) sits lower, in the safe whitespace margin
      // rather than cutting into slide content.
      const wmWidth = Math.floor(img.width * 0.125); 
      const wmHeight = Math.floor(img.height * 0.035);
      
      const x = img.width - wmWidth;
      const y = img.height - wmHeight;

      // 3. Algorithmic Removal (Smart Smear)
      // We extract the color/pattern from immediately outside the watermark area (top edge) to fill it in.
      // This is effectively a "clone stamp" operation where we take the 1px line just above the watermark
      // and drag it down.
      
      // Safety check to ensure we have pixels to sample
      if (y > 1) {
        // We take a 1-pixel high strip from 1 pixel above the watermark area (y-1).
        // Since we reduced wmHeight, (y-1) is now safely below the main slide content.
        const sourceY = y - 1;
        
        // Draw this 1-pixel strip stretched vertically over the watermark area.
        ctx.drawImage(
          canvas,           // Source: the canvas itself
          x, sourceY, wmWidth, 1, // Source Rect: 1px line above
          x, y, wmWidth, wmHeight // Dest Rect: The full watermark area
        );
      }
      
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };

    img.onerror = () => reject(new Error("Failed to load image for processing"));
    img.src = base64Image;
  });
};