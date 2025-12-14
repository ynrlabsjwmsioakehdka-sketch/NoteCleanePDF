import pptxgen from "pptxgenjs";
import { ProcessedImage } from "../types";

export const createAndDownloadPPT = async (images: ProcessedImage[]) => {
  const pres = new pptxgen();

  // Sort by ID to ensure correct order
  const sortedImages = [...images].sort((a, b) => a.id - b.id);

  sortedImages.forEach((img) => {
    const slide = pres.addSlide();
    
    // Determine which image to use (cleaned if success, original if error)
    const imageSource = img.status === 'success' ? img.cleaned : img.original;

    // Add image to slide, fitting it to cover the slide
    slide.addImage({
      data: imageSource,
      x: 0,
      y: 0,
      w: "100%",
      h: "100%",
      sizing: { type: "contain", align: "center" }
    });
  });

  await pres.writeFile({ fileName: "Cleaned_NotebookLM_Presentation.pptx" });
};