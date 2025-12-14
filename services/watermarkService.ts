/**
 * Removes the NotebookLM watermark from the image using Canvas manipulation.
 * It identifies the bottom-right corner area and 'smears' the pixels from just above it
 * downwards to cover the watermark text.
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
        // Fail safe: return original if canvas fails
        resolve(base64Image);
        return;
      }

      // 1. Draw original image
      ctx.drawImage(img, 0, 0);

      // 2. Define Watermark Area (Bottom Right)
      // NotebookLM watermark is in the bottom right corner.
      // We calculate a bounding box relative to the image size.
      // Typically it occupies the last ~15-20% width and ~10% height.
      const wmWidth = Math.floor(img.width * 0.20); 
      const wmHeight = Math.floor(img.height * 0.10);
      
      const x = img.width - wmWidth;
      const y = img.height - wmHeight;

      // 3. Smear Logic
      // We take a thin strip of pixels immediately ABOVE the watermark region
      // and stretch it vertically to cover the watermark.
      // This is effective because slides usually have solid or vertically consistent backgrounds (gradients).
      
      // Source strip: Start at X, slightly above Y (y - 3), width wmWidth, height 2px
      const stripHeight = 3;
      
      try {
        // Draw the strip over the watermark area
        ctx.drawImage(
          canvas,           // Source: the canvas itself (which has the image)
          x, y - stripHeight, wmWidth, stripHeight, // Source Rect: strip above watermark
          x, y, wmWidth, wmHeight // Dest Rect: the watermark area
        );
        
        // Export result
        resolve(canvas.toDataURL('image/jpeg', 0.95));
      } catch (e) {
        console.error("Error processing image canvas:", e);
        resolve(base64Image);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image for processing"));
    img.src = base64Image;
  });
};