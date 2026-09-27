const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    userAnswers: [
      {
        questionIndex: Number,
        question: String,
        selectedOption: String,
        correctAnswer: String,
        isCorrect: Boolean,
        explanation: String,
      },
    ],
    feedback: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

quizResultSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);
