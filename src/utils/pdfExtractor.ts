import * as pdfjsLib from 'pdfjs-dist';

// Set up pdf.js worker URL to reliable CDN matching pdfjs version
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  } catch {
    // Fallback if workerSrc cannot be set
  }
}

interface TextItemWithCoords {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Intelligent Layout-Aware PDF Text Extractor.
 * Solves the critical ATS bug where multi-column layouts interleave lines.
 * Uses coordinate binning (X and Y coordinates) to maintain reading order.
 */
export async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    const pageTexts: string[] = [];
    let totalCharCount = 0;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 });
      const textContent = await page.getTextContent();
      
      const items: TextItemWithCoords[] = [];

      for (const rawItem of textContent.items as any[]) {
        if ('str' in rawItem && rawItem.str.trim().length > 0) {
          items.push({
            str: rawItem.str,
            x: rawItem.transform[4],
            y: rawItem.transform[5],
            width: rawItem.width || 0,
            height: rawItem.height || 0,
          });
          totalCharCount += rawItem.str.length;
        }
      }

      if (items.length === 0) continue;

      // Detect if the page has a two-column layout
      // A two-column layout will typically have a significant cluster of items with x < 45% width
      // and another cluster with x > 45% width that overlap vertically.
      const midX = viewport.width * 0.45;
      const leftColItems = items.filter(it => it.x + it.width <= midX + 20);
      const rightColItems = items.filter(it => it.x > midX - 20);

      // Check if both columns have substantial content (at least 20% of items on each side)
      const isTwoColumn = leftColItems.length > items.length * 0.2 && rightColItems.length > items.length * 0.2;

      let orderedText = '';

      if (isTwoColumn) {
        // Process left column (top-to-bottom: higher Y to lower Y)
        const sortedLeft = [...leftColItems].sort((a, b) => {
          const yDiff = b.y - a.y;
          if (Math.abs(yDiff) > 5) return yDiff;
          return a.x - b.x;
        });

        // Process right column (top-to-bottom: higher Y to lower Y)
        const sortedRight = [...rightColItems].sort((a, b) => {
          const yDiff = b.y - a.y;
          if (Math.abs(yDiff) > 5) return yDiff;
          return a.x - b.x;
        });

        const leftText = assembleTextFromSortedItems(sortedLeft);
        const rightText = assembleTextFromSortedItems(sortedRight);
        orderedText = `${leftText}\n\n${rightText}`;
      } else {
        // Standard single column: sort by Y descending (top to bottom), then X ascending (left to right)
        const sortedSingle = [...items].sort((a, b) => {
          const yDiff = b.y - a.y;
          if (Math.abs(yDiff) > 5) return yDiff;
          return a.x - b.x;
        });

        orderedText = assembleTextFromSortedItems(sortedSingle);
      }

      if (orderedText.trim()) {
        pageTexts.push(orderedText.trim());
      }
    }

    // Edge-case check: Image-only or scanned PDF detection
    if (totalCharCount < 50) {
      throw new Error(
        'Scanned Image PDF Detected: This document does not contain an embedded text layer. ' +
        'Real-world ATS engines (Workday, Taleo, Greenhouse) will reject or fail to parse image-only files. ' +
        'Please export your resume as a text-searchable PDF or paste your resume text directly.'
      );
    }

    return pageTexts.join('\n\n');
  } catch (error: any) {
    console.error('PDF.js text extraction failed:', error);
    if (error.message?.includes('Scanned Image PDF')) {
      throw error;
    }
    throw new Error('Failed to parse PDF binary. Please ensure the file is not password-protected or corrupted.');
  }
}

/**
 * Helper to group sorted text items into lines with appropriate spaces and line breaks.
 */
function assembleTextFromSortedItems(items: TextItemWithCoords[]): string {
  if (items.length === 0) return '';
  let result = '';
  let lastY: number | null = null;
  let lastX: number | null = null;
  let lastWidth: number = 0;

  for (const item of items) {
    if (lastY !== null && Math.abs(item.y - lastY) > 6) {
      result += '\n';
      lastX = null;
    } else if (lastX !== null) {
      // If there's a horizontal gap, insert a space
      const gap = item.x - (lastX + lastWidth);
      if (gap > 2 && !result.endsWith(' ') && !result.endsWith('\n')) {
        result += ' ';
      }
    }

    result += item.str;
    lastY = item.y;
    lastX = item.x;
    lastWidth = item.width;
  }

  return result;
}

/**
 * Universal file text reader: detects PDF vs TXT vs others.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()?.toLowerCase();

  if (fileExt === 'pdf' || file.type === 'application/pdf') {
    const buffer = await file.arrayBuffer();
    return await extractTextFromPdf(buffer);
  }

  // Plaintext, Markdown, RTF fallback
  const text = await file.text();
  return text;
}
