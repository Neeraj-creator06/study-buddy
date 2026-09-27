const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema(
  {
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudyMaterial',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    overview: {
      type: String,
      required: true,
    },
    keyConcepts: [
      {
        title: String,
        description: String,
      },
    ],
    importantPoints: [String],
    definitions: [
      {
        term: String,
        definition: String,
      },
    ],
    examples: [
      {
        concept: String,
        example: String,
      },
    ],
    examPoints: [String],
    rawContent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Summary', summarySchema);
