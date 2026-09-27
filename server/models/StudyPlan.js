const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  dayLabel: {
    type: String,
    default: '',
  },
  topic: {
    type: String,
    required: true,
  },
  durationMinutes: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  actionItems: [String],
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

const studyPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
    },
    examDate: {
      type: Date,
      required: true,
    },
    dailyHours: {
      type: Number,
      required: true,
    },
    currentKnowledgeLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    topics: {
      type: [String],
      default: [],
    },
    preferredStudyTime: {
      type: String,
      default: 'Evening',
    },
    tasks: [taskSchema],
    progress: {
      type: Number,
      default: 0, // percentage 0-100
    },
  },
  {
    timestamps: true,
  }
);

studyPlanSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
