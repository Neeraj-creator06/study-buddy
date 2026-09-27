const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts raw textual content from uploaded PDF, DOCX, or TXT files.
 * @param {string} filePath - Absolute or relative path to the file.
 * @param {string} fileType - One of 'pdf', 'docx', 'txt'.
 * @returns {Promise<string>} Extracted normalized text.
 */
async function extractTextFromFile(filePath, fileType) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found at path: ${filePath}`);
  }

  const normalizedType = fileType.toLowerCase().replace('.', '');
  let extracted = '';

  try {
    if (normalizedType === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extracted = pdfData.text || '';
    } else if (normalizedType === 'docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      extracted = result.value || '';
    } else if (normalizedType === 'txt') {
      extracted = fs.readFileSync(filePath, 'utf-8');
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    // Clean up excessive whitespace and non-printable control characters
    extracted = extracted
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!extracted || extracted.length < 10) {
      throw new Error(
        'The uploaded document contains insufficient or unreadable text. Please ensure the document is not an image-only scan.'
      );
    }

    return extracted;
  } catch (error) {
    console.error(`[TextExtractor Error] Failed extracting from ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Splits large document texts into manageable overlapping segments
 * so that Gemini requests stay well within token bounds.
 */
function chunkText(text, maxChars = 15000, overlap = 800) {
  if (!text || text.length <= maxChars) {
    return [text];
  }

  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + maxChars;

    if (endIndex < text.length) {
      // Find a clean sentence or paragraph break near the cut-off
      const nextNewline = text.lastIndexOf('\n', endIndex);
      const nextPeriod = text.lastIndexOf('. ', endIndex);
      const splitPoint = Math.max(nextNewline, nextPeriod);

      if (splitPoint > startIndex + maxChars * 0.7) {
        endIndex = splitPoint + 1;
      }
    } else {
      endIndex = text.length;
    }

    chunks.push(text.slice(startIndex, endIndex).trim());
    startIndex = endIndex - overlap;
    if (startIndex >= text.length || endIndex >= text.length) break;
  }

  return chunks;
}

module.exports = {
  extractTextFromFile,
  chunkText,
};
