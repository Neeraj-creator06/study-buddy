const StudyMaterial = require('../models/StudyMaterial');
const Summary = require('../models/Summary');
const Flashcard = require('../models/Flashcard');
const Quiz = require('../models/Quiz');
const StudyPlan = require('../models/StudyPlan');
const Chat = require('../models/Chat');
const ApiResponse = require('../utils/apiResponse');
const geminiService = require('../services/geminiService');

/**
 * @route   POST /api/ai/summary
 * @desc    Generate and save comprehensive study summary
 * @access  Private
 */
const generateSummaryController = async (req, res, next) => {
  try {
    const { materialId, text } = req.body;
    let documentText = text;

    let material = null;
    if (materialId) {
      material = await StudyMaterial.findById(materialId);
      if (!material) {
        return ApiResponse.error(res, 'Study material not found', 404);
      }
      documentText = material.extractedText;
    }

    if (!documentText || documentText.trim().length === 0) {
      return ApiResponse.error(res, 'Please provide text or a valid study material ID', 400);
    }

    const summaryData = await geminiService.generateSummary(documentText);

    // Persist to database if linked to material
    let savedSummary = null;
    if (materialId) {
      savedSummary = await Summary.create({
        materialId,
        userId: req.user._id,
        overview: summaryData.overview,
        keyConcepts: summaryData.keyConcepts || [],
        importantPoints: summaryData.importantPoints || [],
        definitions: summaryData.definitions || [],
        examples: summaryData.examples || [],
        examPoints: summaryData.examPoints || [],
        rawContent: JSON.stringify(summaryData),
      });
    }

    return ApiResponse.success(
      res,
      {
        summary: summaryData,
        summaryId: savedSummary ? savedSummary._id : null,
        materialTitle: material ? material.title : 'Direct Input',
      },
      'Summary generated successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/ai/flashcards
 * @desc    Generate and save flashcards deck
 * @access  Private
 */
const generateFlashcardsController = async (req, res, next) => {
  try {
    const { materialId, text, count = 10, difficulty = 'medium', deckTitle } = req.body;
    let documentText = text;

    let material = null;
    if (materialId) {
      material = await StudyMaterial.findById(materialId);
      if (!material) {
        return ApiResponse.error(res, 'Study material not found', 404);
      }
      documentText = material.extractedText;
    }

    if (!documentText || documentText.trim().length === 0) {
      return ApiResponse.error(res, 'Please provide text or a valid study material ID', 400);
    }

    const cards = await geminiService.generateFlashcards(documentText, count, difficulty);

    // Save flashcards to DB
    const flashcardsToInsert = cards.map((card) => ({
      materialId: materialId || null,
      userId: req.user._id,
      deckTitle: deckTitle || (material ? `${material.title} Deck` : 'Quick Study Deck'),
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty || difficulty,
      mastered: false,
    }));

    const savedCards = await Flashcard.insertMany(flashcardsToInsert);

    return ApiResponse.success(
      res,
      {
        count: savedCards.length,
        flashcards: savedCards,
      },
      'Flashcards generated and saved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/ai/quiz
 * @desc    Generate and save quiz
 * @access  Private
 */
const generateQuizController = async (req, res, next) => {
  try {
    const {
      materialId,
      text,
      count = 10,
      difficulty = 'medium',
      questionType = 'multiple_choice',
      title,
    } = req.body;
    let documentText = text;

    let material = null;
    if (materialId) {
      material = await StudyMaterial.findById(materialId);
      if (!material) {
        return ApiResponse.error(res, 'Study material not found', 404);
      }
      documentText = material.extractedText;
    }

    if (!documentText || documentText.trim().length === 0) {
      return ApiResponse.error(res, 'Please provide text or a valid study material ID', 400);
    }

    const rawQuestions = await geminiService.generateQuiz(documentText, count, difficulty, questionType);

    // Create Quiz in MongoDB
    const quizTitle = title || (material ? `Quiz: ${material.title}` : 'AI Generated Quiz');
    const quiz = await Quiz.create({
      materialId: materialId || null,
      userId: req.user._id,
      title: quizTitle,
      topic: material ? material.title : 'Study Topic',
      difficulty,
      questionType,
      questions: rawQuestions,
      totalQuestions: rawQuestions.length,
    });

    // Sanitized questions for client (strip correct answer for cheating prevention)
    const sanitizedQuestions = quiz.questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    return ApiResponse.success(
      res,
      {
        quizId: quiz._id,
        title: quiz.title,
        difficulty: quiz.difficulty,
        totalQuestions: quiz.totalQuestions,
        questions: sanitizedQuestions,
      },
      'Quiz generated successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/ai/study-plan
 * @desc    Generate personalized day-by-day study roadmap
 * @access  Private
 */
const generateStudyPlanController = async (req, res, next) => {
  try {
    const { subject, examDate, dailyHours, currentKnowledgeLevel, topics, preferredStudyTime } = req.body;

    if (!subject || !examDate || !dailyHours) {
      return ApiResponse.error(res, 'Please provide subject, exam date, and daily available study hours', 400);
    }

    const planData = await geminiService.generateStudyPlan({
      subject,
      examDate,
      dailyHours: Number(dailyHours),
      currentLevel: currentKnowledgeLevel || 'intermediate',
      topics: topics || [subject],
      preferredTime: preferredStudyTime,
    });

    const studyPlan = await StudyPlan.create({
      userId: req.user._id,
      subject,
      examDate: new Date(examDate),
      dailyHours: Number(dailyHours),
      currentKnowledgeLevel: currentKnowledgeLevel || 'intermediate',
      topics: Array.isArray(topics) ? topics : [topics],
      preferredStudyTime: preferredStudyTime || 'Evening',
      tasks: planData.tasks || [],
      progress: 0,
    });

    return ApiResponse.success(
      res,
      { studyPlan, overview: planData.overview },
      'Study plan created successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/ai/ask
 * @desc    Grounded conversational Q&A against study material
 * @access  Private
 */
const askAiController = async (req, res, next) => {
  try {
    const { materialId, question, chatId } = req.body;

    if (!question || question.trim() === '') {
      return ApiResponse.error(res, 'Please provide a question', 400);
    }

    let documentText = '';
    let materialTitle = 'General Study';

    if (materialId) {
      const material = await StudyMaterial.findById(materialId);
      if (material) {
        documentText = material.extractedText;
        materialTitle = material.title;
      }
    }

    // Retrieve or initialize chat
    let chat = null;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId: req.user._id });
    }

    if (!chat) {
      chat = await Chat.create({
        userId: req.user._id,
        materialId: materialId || null,
        title: `Q&A: ${question.slice(0, 30)}...`,
        messages: [],
      });
    }

    // Add user question
    chat.messages.push({
      sender: 'user',
      text: question,
      timestamp: new Date(),
    });

    // Query Gemini
    const aiResult = await geminiService.askQuestion(documentText, chat.messages, question);

    // Append AI response
    chat.messages.push({
      sender: 'ai',
      text: aiResult.answer,
      timestamp: new Date(),
      citedSections: aiResult.citedSections || [],
    });

    await chat.save();

    return ApiResponse.success(
      res,
      {
        chatId: chat._id,
        question,
        answer: aiResult.answer,
        citedSections: aiResult.citedSections,
        materialTitle,
        messages: chat.messages,
      },
      'Response generated successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/ai/important-questions
 * @desc    Analyze study material for high-yield exam questions
 * @access  Private
 */
const importantQuestionsController = async (req, res, next) => {
  try {
    const { materialId, text, difficulty = 'all' } = req.body;
    let documentText = text;

    if (materialId) {
      const material = await StudyMaterial.findById(materialId);
      if (!material) {
        return ApiResponse.error(res, 'Study material not found', 404);
      }
      documentText = material.extractedText;
    }

    if (!documentText) {
      return ApiResponse.error(res, 'Please provide materialId or text', 400);
    }

    const questionsData = await geminiService.generateImportantQuestions(documentText, difficulty);

    return ApiResponse.success(res, { questions: questionsData }, 'Important questions generated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/ai/explain
 * @desc    Concept explainer with beginner or advanced mode
 * @access  Private
 */
const explainConceptController = async (req, res, next) => {
  try {
    const { concept, isBeginner = true } = req.body;

    if (!concept || concept.trim() === '') {
      return ApiResponse.error(res, 'Please specify a concept to explain', 400);
    }

    const explanation = await geminiService.explainConcept(concept, isBeginner);

    return ApiResponse.success(res, { explanation }, 'Concept explanation generated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateSummaryController,
  generateFlashcardsController,
  generateQuizController,
  generateStudyPlanController,
  askAiController,
  importantQuestionsController,
  explainConceptController,
};
