const fs = require('fs');
const path = require('path');
const StudyMaterial = require('../models/StudyMaterial');
const Summary = require('../models/Summary');
const Flashcard = require('../models/Flashcard');
const Quiz = require('../models/Quiz');
const ApiResponse = require('../utils/apiResponse');
const { extractTextFromFile } = require('../services/textExtractor');

/**
 * @route   POST /api/materials
 * @desc    Upload study material (PDF, DOCX, TXT) and extract text
 * @access  Private
 */
const uploadMaterial = async (req, res, next) => {
  try {
    if (!req.file) {
      return ApiResponse.error(res, 'Please select a PDF, DOCX, or TXT file to upload', 400);
    }

    const { title, tags } = req.body;
    const originalExt = path.extname(req.file.originalname).toLowerCase().replace('.', '');
    const materialTitle = title && title.trim() !== '' ? title.trim() : req.file.originalname.replace(/\.[^/.]+$/, '');

    // Extract text from the uploaded document
    let extractedText = '';
    try {
      extractedText = await extractTextFromFile(req.file.path, originalExt);
    } catch (parseError) {
      // Clean up uploaded file if extraction fails
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return ApiResponse.error(
        res,
        `Document processing failed: ${parseError.message}`,
        422
      );
    }

    const material = await StudyMaterial.create({
      title: materialTitle,
      filename: req.file.filename,
      originalFilename: req.file.originalname,
      fileType: originalExt,
      fileSize: req.file.size,
      filePath: req.file.path,
      extractedText,
      uploadedBy: req.user._id,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
    });

    return ApiResponse.success(
      res,
      {
        material: {
          id: material._id,
          title: material.title,
          originalFilename: material.originalFilename,
          fileType: material.fileType,
          fileSize: material.fileSize,
          characterCount: extractedText.length,
          createdAt: material.createdAt,
        },
      },
      'Study material uploaded and processed successfully',
      201
    );
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // ignore
      }
    }
    next(error);
  }
};

/**
 * @route   GET /api/materials
 * @desc    Get user's uploaded materials
 * @access  Private
 */
const getMaterials = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { uploadedBy: req.user._id };
    const materials = await StudyMaterial.find(filter)
      .select('-extractedText') // exclude full text for list view efficiency
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, { materials }, 'Materials retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/materials/:id
 * @desc    Get a single study material with extracted text
 * @access  Private
 */
const getMaterialById = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

    if (!material) {
      return ApiResponse.error(res, 'Study material not found', 404);
    }

    // RBAC check: only owner or admin can view
    if (material.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return ApiResponse.error(res, 'You do not have permission to view this material', 403);
    }

    return ApiResponse.success(res, { material }, 'Material retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/materials/:id
 * @desc    Delete a study material and linked items
 * @access  Private
 */
const deleteMaterial = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

    if (!material) {
      return ApiResponse.error(res, 'Study material not found', 404);
    }

    if (material.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return ApiResponse.error(res, 'You do not have permission to delete this material', 403);
    }

    // Remove file from disk
    if (fs.existsSync(material.filePath)) {
      try {
        fs.unlinkSync(material.filePath);
      } catch (err) {
        console.warn(`[Delete File Error] Could not unlink ${material.filePath}:`, err.message);
      }
    }

    // Cascade delete linked summaries, flashcards, quizzes
    await Promise.all([
      Summary.deleteMany({ materialId: material._id }),
      Flashcard.deleteMany({ materialId: material._id }),
      Quiz.deleteMany({ materialId: material._id }),
      material.deleteOne(),
    ]);

    return ApiResponse.success(res, {}, 'Study material and associated items deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadMaterial,
  getMaterials,
  getMaterialById,
  deleteMaterial,
};
