const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
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
    deckTitle: {
      type: String,
      default: 'Study Deck',
    },
    question: {
      type: String,
      required: [true, 'Question or concept front is required'],
    },
    answer: {
      type: String,
      required: [true, 'Answer or explanation back is required'],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    mastered: {
      type: Boolean,
      default: false,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    lastReviewed: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

flashcardSchema.index({ userId: 1, materialId: 1 });

module.exports = mongoose.model('Flashcard', flashcardSchema);
