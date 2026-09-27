const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Material title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    filename: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      enum: ['pdf', 'docx', 'txt'],
    },
    fileSize: {
      type: Number,
      required: true, // in bytes
    },
    filePath: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

studyMaterialSchema.index({ uploadedBy: 1, createdAt: -1 });

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
