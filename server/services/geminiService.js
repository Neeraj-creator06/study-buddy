const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Initialize Gemini client safely.
 */
function getGeminiModel(modelName = 'gemini-1.5-flash') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}

/**
 * Clean and parse raw JSON text returned by Gemini.
 * Handles ```json ... ``` enclosures, leading/trailing conversational text, and formatting artifacts.
 */
function parseGeminiJson(rawText) {
  if (!rawText) return null;

  try {
    // 1. Direct JSON parse
    return JSON.parse(rawText);
  } catch (e1) {
    // 2. Strip markdown code fences
    let cleaned = rawText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();

    try {
      return JSON.parse(cleaned);
    } catch (e2) {
      // 3. Extract outermost array [ ... ] or object { ... }
      const firstBracket = cleaned.indexOf('[');
      const lastBracket = cleaned.lastIndexOf(']');
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');

      if (firstBracket !== -1 && lastBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
        try {
          return JSON.parse(cleaned.substring(firstBracket, lastBracket + 1));
        } catch (e3) {
          // continue
        }
      }

      if (firstBrace !== -1 && lastBrace !== -1) {
        try {
          return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
        } catch (e4) {
          // continue
        }
      }

      throw new Error(`Unable to parse AI response as JSON: ${e2.message}`);
    }
  }
}

/**
 * AI Summarizer: generates structured educational summary
 */
async function generateSummary(documentText) {
  const model = getGeminiModel();
  const truncatedText = documentText.slice(0, 30000); // stay safe within token bounds

  if (!model) {
    console.warn('[Gemini] GEMINI_API_KEY is not configured. Using high-fidelity content analyzer fallback.');
    return generateFallbackSummary(documentText);
  }

  const prompt = `
You are an expert university professor and learning assistant. Analyze the following study material and generate a comprehensive, high-yield study summary.
Return ONLY valid JSON matching this exact structure, with no conversational filler or extra markdown:
{
  "overview": "A clear, engaging 3-5 sentence executive summary of the entire document.",
  "keyConcepts": [
    {
      "title": "Concept Name",
      "description": "Thorough explanation of this key concept."
    }
  ],
  "importantPoints": [
    "Key high-yield takeaway point 1",
    "Key high-yield takeaway point 2"
  ],
  "definitions": [
    {
      "term": "Key Term",
      "definition": "Precise academic definition"
    }
  ],
  "examples": [
    {
      "concept": "Related Concept",
      "example": "Real-world analogy or practical application example"
    }
  ],
  "examPoints": [
    "High-probability exam question topic or critical formula/rule to remember"
  ]
}

STUDY MATERIAL:
"""
${truncatedText}
"""
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseGeminiJson(text);
  } catch (error) {
    console.error('[Gemini Summary Error]:', error.message);
    return generateFallbackSummary(documentText);
  }
}

/**
 * AI Flashcards: generates question-and-answer pairs
 */
async function generateFlashcards(documentText, count = 10, difficulty = 'medium') {
  const model = getGeminiModel();
  const truncatedText = documentText.slice(0, 25000);

  if (!model) {
    return generateFallbackFlashcards(documentText, count, difficulty);
  }

  const prompt = `
You are an elite tutor. Based strictly on the provided study material, generate ${count} high-retention flashcards.
Target difficulty: ${difficulty}.
Return ONLY a valid JSON array of objects with no extra text or markdown wrapping:
[
  {
    "question": "Front of card: concise, conceptual question, definition query, or scenario",
    "answer": "Back of card: clear, complete, accurate answer explaining the concept",
    "difficulty": "${difficulty}"
  }
]

STUDY MATERIAL:
"""
${truncatedText}
"""
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const flashcards = parseGeminiJson(text);
    return Array.isArray(flashcards) ? flashcards : flashcards.flashcards || [];
  } catch (error) {
    console.error('[Gemini Flashcards Error]:', error.message);
    return generateFallbackFlashcards(documentText, count, difficulty);
  }
}

/**
 * AI Quiz Generator: generates multiple-choice / true-false quizzes
 */
async function generateQuiz(documentText, count = 10, difficulty = 'medium', questionType = 'multiple_choice') {
  const model = getGeminiModel();
  const truncatedText = documentText.slice(0, 25000);

  if (!model) {
    return generateFallbackQuiz(documentText, count, difficulty);
  }

  const prompt = `
You are a university exam creator. Create a rigorous, fair, and educational quiz with ${count} questions based on this study material.
Difficulty: ${difficulty}.
Question style: ${questionType}.
Return ONLY a valid JSON array of question objects with this exact structure:
[
  {
    "question": "Clear question stem?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correctAnswer": "Exact string identical to one of the options above",
    "explanation": "Detailed explanation of why this answer is correct and why other options are incorrect."
  }
]

STUDY MATERIAL:
"""
${truncatedText}
"""
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const quiz = parseGeminiJson(text);
    return Array.isArray(quiz) ? quiz : quiz.questions || [];
  } catch (error) {
    console.error('[Gemini Quiz Error]:', error.message);
    return generateFallbackQuiz(documentText, count, difficulty);
  }
}

/**
 * AI Study Plan Generator: schedules personalized study roadmap
 */
async function generateStudyPlan({ subject, examDate, dailyHours, currentLevel, topics, preferredTime }) {
  const model = getGeminiModel();

  if (!model) {
    return generateFallbackStudyPlan({ subject, examDate, dailyHours, currentLevel, topics });
  }

  const prompt = `
You are an expert academic advisor. Build a structured, realistic study plan for a student with these parameters:
Subject: ${subject}
Target Exam Date: ${examDate}
Available Study Time: ${dailyHours} hours/day
Current Knowledge Level: ${currentLevel}
Key Focus Topics: ${Array.isArray(topics) ? topics.join(', ') : topics}
Preferred Time of Day: ${preferredTime || 'Evening'}

Generate a milestone-driven schedule with 7 to 14 discrete study day entries.
Return ONLY valid JSON matching this exact structure:
{
  "subject": "${subject}",
  "overview": "Short motivational summary and strategy for tackling this syllabus",
  "tasks": [
    {
      "day": 1,
      "dayLabel": "Day 1: Foundation & Core Concepts",
      "topic": "Specific Topic Name",
      "durationMinutes": ${Math.round(dailyHours * 60)},
      "description": "What to master today",
      "actionItems": [
        "Action item 1",
        "Action item 2",
        "Review flashcards"
      ]
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseGeminiJson(text);
  } catch (error) {
    console.error('[Gemini Study Plan Error]:', error.message);
    return generateFallbackStudyPlan({ subject, examDate, dailyHours, currentLevel, topics });
  }
}

/**
 * Ask AI: Grounded Q&A against uploaded study material
 */
async function askQuestion(documentText, conversationHistory = [], userQuestion = '') {
  const model = getGeminiModel();
  const truncatedText = (documentText || '').slice(0, 30000);

  if (!model) {
    return {
      answer: `[AI StudyBuddy]: You asked: "${userQuestion}". (To connect live Gemini AI responses, add your GEMINI_API_KEY to server/.env). Based on your uploaded material, this document covers key concepts and principles relevant to your query.`,
      citedSections: ['Uploaded Document Core Summary'],
    };
  }

  const formattedHistory = conversationHistory
    .slice(-6)
    .map((m) => `${m.sender === 'user' ? 'Student' : 'AI StudyBuddy'}: ${m.text}`)
    .join('\n');

  const prompt = `
You are AI StudyBuddy, a friendly, encouraging, and deeply knowledgeable personal academic tutor.
Your job is to answer the student's question accurately based primarily on the uploaded study material provided below.

RULES:
1. Prioritize facts, definitions, and theories contained in the study material.
2. If the answer cannot be determined or is completely outside the scope of the material, clearly state: "This concept is not explicitly covered in your uploaded study material, but here is general educational context..."
3. Avoid hallucinations and be concise, student-friendly, and clear.
4. Format your answer with clean Markdown headers, bullet points, and code blocks if applicable.

STUDY MATERIAL:
"""
${truncatedText || 'No specific document attached. Answer general academic questions accurately.'}
"""

CONVERSATION HISTORY:
${formattedHistory}

STUDENT QUESTION:
"${userQuestion}"

AI RESPONSE:
`;

  try {
    const result = await model.generateContent(prompt);
    return {
      answer: result.response.text().trim(),
      citedSections: ['Primary Material Content'],
    };
  } catch (error) {
    console.error('[Gemini Ask Error]:', error.message);
    return {
      answer: `Unable to query Gemini API at this moment: ${error.message}. Please check your connection and GEMINI_API_KEY.`,
      citedSections: [],
    };
  }
}

/**
 * Important Questions Generator
 */
async function generateImportantQuestions(documentText, difficulty = 'all') {
  const model = getGeminiModel();
  const truncatedText = documentText.slice(0, 25000);

  if (!model) {
    return generateFallbackImportantQuestions(documentText);
  }

  const prompt = `
Analyze this study material and predict the most important exam questions across multiple tiers.
Filter difficulty: ${difficulty}.
Return ONLY valid JSON matching this structure:
{
  "shortAnswerQuestions": [
    { "question": "...", "marks": 2, "suggestedAnswer": "..." }
  ],
  "longAnswerQuestions": [
    { "question": "...", "marks": 5, "keyPointsToInclude": ["..."] }
  ],
  "practicalQuestions": [
    { "question": "...", "scenario": "...", "guidance": "..." }
  ]
}

STUDY MATERIAL:
"""
${truncatedText}
"""
`;

  try {
    const result = await model.generateContent(prompt);
    return parseGeminiJson(result.response.text());
  } catch (error) {
    console.error('[Gemini Important Questions Error]:', error.message);
    return generateFallbackImportantQuestions(documentText);
  }
}

/**
 * Concept Explainer
 */
async function explainConcept(concept, isBeginner = true) {
  const model = getGeminiModel();

  if (!model) {
    return {
      concept,
      simpleExplanation: `${concept} is a fundamental concept designed to solve core problems efficiently.`,
      detailedExplanation: `In academic and practical contexts, ${concept} represents structured methods and systems used by professionals.`,
      analogy: `Think of ${concept} like a well-organized library where each book has an indexed location.`,
      example: `For instance, using ${concept} in a project ensures predictable and scalable results.`,
      commonMistakes: ['Confusing the terminology with similar sounding concepts', 'Skipping edge case analysis'],
      quickRevisionPoints: [`Review basic definition of ${concept}`, 'Practice 2-3 sample applications'],
    };
  }

  const styleGuide = isBeginner
    ? "Explain like I'm a beginner / high school student: use vivid real-world analogies, zero jargon, and crystal clear examples."
    : 'Provide a rigorous, technical, university-level explanation with nuance, edge-cases, and mathematical/logical depth.';

  const prompt = `
You are an expert tutor. Explain the concept: "${concept}".
Tone & Depth: ${styleGuide}.
Return ONLY valid JSON matching this exact structure:
{
  "concept": "${concept}",
  "simpleExplanation": "Clear, accessible 2-3 sentence explanation",
  "detailedExplanation": "In-depth breakdown of how it works under the hood",
  "analogy": "Vivid, intuitive everyday real-world analogy",
  "example": "Concrete practical code snippet, scenario, or calculation",
  "commonMistakes": [
    "Common misconception or error students make 1",
    "Common misconception 2"
  ],
  "quickRevisionPoints": [
    "Bullet point summary for last-minute exam revision 1",
    "Bullet point summary 2"
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    return parseGeminiJson(result.response.text());
  } catch (error) {
    console.error('[Gemini Explainer Error]:', error.message);
    throw error;
  }
}

/* =========================================================================
   INTELLIGENT DYNAMIC FALLBACK GENERATORS (used when GEMINI_API_KEY is not yet supplied)
   ========================================================================= */

function extractSentences(text) {
  return text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25 && s.length < 220);
}

function generateFallbackSummary(text) {
  const sentences = extractSentences(text);
  const overview = sentences.slice(0, 3).join(' ') || 'Comprehensive study notes on the subject.';
  
  return {
    overview,
    keyConcepts: [
      {
        title: 'Core Fundamentals',
        description: sentences[3] || 'Essential foundational principles and definitions established in this document.',
      },
      {
        title: 'Advanced Methodology',
        description: sentences[4] || 'Practical applications and theoretical frameworks detailed across the material.',
      },
    ],
    importantPoints: sentences.slice(5, 9).length > 0 ? sentences.slice(5, 9) : [
      'Master the definitions and core terminology.',
      'Understand the structural relationships between each component.',
      'Practice applying the principles to real-world scenarios.',
    ],
    definitions: [
      {
        term: 'Primary Concept',
        definition: sentences[1] || 'The central mechanism discussed throughout this chapter.',
      },
    ],
    examples: [
      {
        concept: 'Practical Execution',
        example: sentences[6] || 'Consider a standard use case where this method yields optimal results.',
      },
    ],
    examPoints: [
      'Be prepared to compare and contrast key principles under timed exam conditions.',
      'Review definitions and practical formulas highlighted above.',
    ],
  };
}

function generateFallbackFlashcards(text, count = 10, difficulty = 'medium') {
  const sentences = extractSentences(text);
  const flashcards = [];

  for (let i = 0; i < Math.min(count, Math.max(5, sentences.length - 1)); i++) {
    const s = sentences[i] || `Key Concept #${i + 1}`;
    flashcards.push({
      question: `Explain the significance: "${s.slice(0, 75)}..."?`,
      answer: s,
      difficulty,
    });
  }

  if (flashcards.length === 0) {
    flashcards.push({
      question: 'What is the main objective of this study material?',
      answer: text.slice(0, 150) + '...',
      difficulty: 'easy',
    });
  }

  return flashcards;
}

function generateFallbackQuiz(text, count = 5, difficulty = 'medium') {
  const sentences = extractSentences(text);
  const quiz = [];

  for (let i = 0; i < Math.min(count, 5); i++) {
    const statement = sentences[i] || 'Important concept rule.';
    const snippet = statement.slice(0, 45);
    quiz.push({
      question: `According to the study material, which statement accurately reflects ${snippet}...?`,
      options: [
        statement,
        'It is universally superseded by legacy frameworks without verification.',
        'It applies strictly to theoretical hypotheses with no practical value.',
        'It has no direct relation to the syllabus covered in this document.',
      ],
      correctAnswer: statement,
      explanation: `The uploaded text directly states: "${statement}".`,
    });
  }

  return quiz;
}

function generateFallbackStudyPlan({ subject, examDate, dailyHours, currentLevel, topics }) {
  const days = 7;
  const tasks = [];
  const hours = dailyHours || 2;

  const topicList = Array.isArray(topics) && topics.length > 0 ? topics : [
    'Foundational Principles & Syntax',
    'Core Architecture & Design',
    'Data Structures & Algorithms',
    'Problem Solving & Practice Questions',
    'Edge Cases & Optimization',
    'Comprehensive Review & Mock Exam',
    'Final Revision & Exam Strategy'
  ];

  for (let i = 1; i <= days; i++) {
    const curTopic = topicList[(i - 1) % topicList.length];
    tasks.push({
      day: i,
      dayLabel: `Day ${i}: ${curTopic}`,
      topic: curTopic,
      durationMinutes: Math.round(hours * 60),
      description: `Deep dive into ${curTopic} with active recall and practice problems.`,
      actionItems: [
        `Read and annotate lecture notes for ${curTopic}`,
        'Complete 10 interactive flashcards',
        'Solve 5 practice exam questions',
      ],
      isCompleted: false,
    });
  }

  return {
    subject: subject || 'General Study',
    overview: `A tailored ${days}-day intensive revision schedule engineered for ${currentLevel || 'student'} level readiness.`,
    tasks,
  };
}

function generateFallbackImportantQuestions(text) {
  const sentences = extractSentences(text);
  return {
    shortAnswerQuestions: [
      {
        question: `Define and state the significance of: "${sentences[0]?.slice(0, 60) || 'the primary concept'}"?`,
        marks: 2,
        suggestedAnswer: sentences[0] || 'Core definition extracted from study material.',
      },
      {
        question: `List two essential characteristics highlighted in the introductory section?`,
        marks: 2,
        suggestedAnswer: 'Refer to foundational principles outlined in the lecture notes.',
      },
    ],
    longAnswerQuestions: [
      {
        question: `Critically analyze the theoretical and practical implications of the main chapter topics.`,
        marks: 5,
        keyPointsToInclude: [
          sentences[1] || 'Contextual foundation',
          sentences[2] || 'Mechanisms of action',
          'Comparative advantages',
        ],
      },
    ],
    practicalQuestions: [
      {
        question: `Given a real-world scenario involving this subject, describe how you would apply the concepts to troubleshoot an issue.`,
        scenario: 'A student needs to solve a high-stakes problem under constraints.',
        guidance: 'Break the problem down step-by-step using the formulas and rules provided.',
      },
    ],
  };
}

module.exports = {
  generateSummary,
  generateFlashcards,
  generateQuiz,
  generateStudyPlan,
  askQuestion,
  generateImportantQuestions,
  explainConcept,
};
