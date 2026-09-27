const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const ApiResponse = require('../utils/apiResponse');

/**
 * @route   GET /api/quizzes
 * @desc    Get user's available quizzes
 * @access  Private
 */
const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user._id })
      .select('-questions.correctAnswer -questions.explanation')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, { quizzes }, 'Quizzes retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/quizzes/:id
 * @desc    Get single quiz to take (without revealing answers)
 * @access  Private
 */
const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return ApiResponse.error(res, 'Quiz not found', 404);
    }

    if (quiz.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return ApiResponse.error(res, 'Access denied to this quiz', 403);
    }

    // Sanitize questions: do not expose answers before submission
    const sanitizedQuestions = quiz.questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    return ApiResponse.success(
      res,
      {
        quiz: {
          _id: quiz._id,
          title: quiz.title,
          topic: quiz.topic,
          difficulty: quiz.difficulty,
          totalQuestions: quiz.totalQuestions,
          questions: sanitizedQuestions,
        },
      },
      'Quiz retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/quizzes/:id/submit
 * @desc    Submit quiz answers and evaluate score
 * @access  Private
 */
const submitQuiz = async (req, res, next) => {
  try {
    const { answers, timeSpentSeconds = 0 } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return ApiResponse.error(res, 'Quiz not found', 404);
    }

    let correctCount = 0;
    const evaluatedAnswers = [];

    quiz.questions.forEach((q, index) => {
      const submittedOption = answers ? answers[q._id.toString()] || answers[index] : null;
      const isCorrect = submittedOption && submittedOption.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

      if (isCorrect) {
        correctCount++;
      }

      evaluatedAnswers.push({
        questionIndex: index,
        question: q.question,
        selectedOption: submittedOption || 'No answer selected',
        correctAnswer: q.correctAnswer,
        isCorrect: !!isCorrect,
        explanation: q.explanation || 'Review the study material notes for this section.',
      });
    });

    const percentage = Math.round((correctCount / quiz.totalQuestions) * 100);

    let feedback = '';
    if (percentage >= 90) {
      feedback = 'Outstanding mastery! You have exceptional command over this material.';
    } else if (percentage >= 70) {
      feedback = 'Great job! A solid understanding with a few areas for targeted review.';
    } else if (percentage >= 50) {
      feedback = 'Good effort. Review the explanations below and replay with flashcards to boost retention.';
    } else {
      feedback = 'Needs review. We recommend reading through the generated summary before re-attempting.';
    }

    const quizResult = await QuizResult.create({
      quizId: quiz._id,
      userId: req.user._id,
      score: correctCount,
      totalQuestions: quiz.totalQuestions,
      percentage,
      timeSpentSeconds,
      userAnswers: evaluatedAnswers,
      feedback,
    });

    return ApiResponse.success(
      res,
      {
        resultId: quizResult._id,
        score: correctCount,
        totalQuestions: quiz.totalQuestions,
        percentage,
        timeSpentSeconds,
        feedback,
        answers: evaluatedAnswers,
      },
      'Quiz evaluated successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/quizzes/results/history
 * @desc    Get user's past quiz results
 * @access  Private
 */
const getQuizResults = async (req, res, next) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id })
      .populate('quizId', 'title difficulty topic')
      .sort({ createdAt: -1 })
      .limit(30);

    return ApiResponse.success(res, { results }, 'Quiz results retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuizzes,
  getQuizById,
  submitQuiz,
  getQuizResults,
};
