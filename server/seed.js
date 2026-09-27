const User = require('./models/User');
const StudyMaterial = require('./models/StudyMaterial');
const Summary = require('./models/Summary');
const Flashcard = require('./models/Flashcard');
const Quiz = require('./models/Quiz');
const QuizResult = require('./models/QuizResult');
const StudyPlan = require('./models/StudyPlan');

const sampleDocumentText = `
Object-Oriented Programming (OOP) and Software Architecture Principles

1. Introduction to Object-Oriented Programming
Object-Oriented Programming is a paradigm based on the concept of 'objects', which can contain data in the form of fields (attributes) and code in the form of procedures (methods).
The primary four pillars of OOP are:
1. Encapsulation: Bundling data and methods that manipulate that data into a single unit (class), and restricting direct access to internal state via access modifiers (private, protected, public).
2. Abstraction: Hiding internal implementation complexities and exposing only essential interface functionalities.
3. Inheritance: Mechanism where a child class acquires properties and behaviors of a parent class, promoting code reuse.
4. Polymorphism: The ability of different classes to respond to the same message or method call in their own specific ways (method overloading and overriding).

2. SOLID Design Principles
SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable:
- Single Responsibility Principle (SRP): A class should have one, and only one, reason to change.
- Open/Closed Principle (OCP): Software entities should be open for extension, but closed for modification.
- Liskov Substitution Principle (LSP): Subtypes must be substitutable for their base types without altering program correctness.
- Interface Segregation Principle (ISP): Clients should not be forced to depend upon interfaces that they do not use.
- Dependency Inversion Principle (DIP): High-level modules should not depend on low-level modules; both should depend on abstractions.

3. Asynchronous Programming and Concurrency
Asynchronous programming allows long-running operations (such as I/O, network requests, database queries) to execute in the background without blocking the main execution thread. In modern runtime environments like Node.js, this is achieved via the Event Loop, Libuv thread pool, Promises, and async/await syntax.

4. Exam Preparation Takeaways
- Understand how Polymorphism differs between Compile-time (Overloading) and Runtime (Overriding).
- Be prepared to identify SOLID principle violations in code snippets during exam evaluations.
- Understand how Encapsulation safeguards data integrity.
`;

const seedData = async (isStandalone = false) => {
  try {
    const existingCount = await User.countDocuments();
    if (existingCount > 0 && !isStandalone) {
      return;
    }

    console.log('[Seed] Seeding demo student, admin, and study materials...');

    await Promise.all([
      User.deleteMany({ email: { $in: ['student@studybuddy.com', 'admin@studybuddy.com'] } }),
    ]);

    // Create demo student
    const student = await User.create({
      name: 'Alex Johnson',
      email: 'student@studybuddy.com',
      password: 'password123',
      role: 'student',
      streak: 7,
      preferences: {
        preferredSubjects: ['Computer Science', 'Data Structures', 'Software Engineering'],
        dailyStudyGoal: 90,
        theme: 'dark',
      },
    });

    // Create demo admin
    const admin = await User.create({
      name: 'Dr. Sarah Connor (Admin)',
      email: 'admin@studybuddy.com',
      password: 'password123',
      role: 'admin',
      streak: 12,
      preferences: {
        preferredSubjects: ['Administration', 'AI Systems'],
        dailyStudyGoal: 60,
        theme: 'dark',
      },
    });

    // Create demo study material
    const material = await StudyMaterial.create({
      title: 'Object-Oriented Programming & SOLID Architecture',
      filename: 'sample_oop_architecture.txt',
      originalFilename: 'OOP_Architecture_Guide.txt',
      fileType: 'txt',
      fileSize: 4096,
      filePath: 'sample_oop_architecture.txt',
      extractedText: sampleDocumentText,
      uploadedBy: student._id,
      tags: ['Computer Science', 'OOP', 'Software Engineering'],
    });

    // Create demo summary
    await Summary.create({
      materialId: material._id,
      userId: student._id,
      overview: 'Comprehensive overview of Object-Oriented Programming fundamentals, the 4 core pillars, SOLID architectural principles, and asynchronous execution patterns in modern software.',
      keyConcepts: [
        {
          title: 'Four Pillars of OOP',
          description: 'Encapsulation, Abstraction, Inheritance, and Polymorphism form the building blocks of clean modular software design.',
        },
        {
          title: 'SOLID Principles',
          description: 'Five design principles that govern maintainable, decoupled, and extensible object-oriented architectures.',
        },
      ],
      importantPoints: [
        'Encapsulation hides internal state and restricts direct access.',
        'Polymorphism enables dynamic method binding at runtime.',
        'Dependency Inversion decouples high-level business logic from low-level implementations.',
      ],
      definitions: [
        {
          term: 'Polymorphism',
          definition: 'The ability of different objects to respond to the identical method invocation through specialized behaviors.',
        },
        {
          term: 'Encapsulation',
          definition: 'Bundling data and operations into classes while safeguarding attributes from external direct manipulation.',
        },
      ],
      examples: [
        {
          concept: 'Liskov Substitution',
          example: 'A Square inheriting from a Rectangle will violate LSP if resizing width unexpectedly mutates height.',
        },
      ],
      examPoints: [
        'Distinguish between Compile-time polymorphism and Runtime dynamic dispatch.',
        'Provide examples of the Single Responsibility Principle in API controllers.',
      ],
      rawContent: '',
    });

    // Create demo flashcards
    await Flashcard.insertMany([
      {
        materialId: material._id,
        userId: student._id,
        deckTitle: 'OOP Fundamentals',
        question: 'What are the four foundational pillars of Object-Oriented Programming?',
        answer: 'Encapsulation, Abstraction, Inheritance, and Polymorphism.',
        difficulty: 'easy',
        mastered: true,
      },
      {
        materialId: material._id,
        userId: student._id,
        deckTitle: 'OOP Fundamentals',
        question: 'What is the core rule of the Dependency Inversion Principle (DIP)?',
        answer: 'High-level modules should not depend upon low-level modules. Both should depend on abstractions (interfaces).',
        difficulty: 'medium',
        mastered: false,
      },
      {
        materialId: material._id,
        userId: student._id,
        deckTitle: 'OOP Fundamentals',
        question: 'How does runtime polymorphism differ from compile-time polymorphism?',
        answer: 'Compile-time is handled via method overloading; Runtime is resolved dynamically via method overriding and virtual tables.',
        difficulty: 'hard',
        mastered: false,
      },
    ]);

    // Create demo quiz
    const quiz = await Quiz.create({
      materialId: material._id,
      userId: student._id,
      title: 'OOP & SOLID Mastery Assessment',
      topic: 'Software Architecture',
      difficulty: 'medium',
      questionType: 'multiple_choice',
      questions: [
        {
          question: 'Which OOP pillar is primarily concerned with restricting direct access to object state?',
          options: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Abstraction'],
          correctAnswer: 'Encapsulation',
          explanation: 'Encapsulation bundles data and methods while restricting direct external access using private/protected modifiers.',
        },
        {
          question: 'What does the "S" in SOLID design principles represent?',
          options: ['Standardized Interface Protocol', 'Single Responsibility Principle', 'System Optimization Paradigm', 'Sequential Execution Flow'],
          correctAnswer: 'Single Responsibility Principle',
          explanation: 'The Single Responsibility Principle states that a class should have one, and only one, reason to change.',
        },
        {
          question: 'What mechanism allows child classes to override parent class method implementations dynamically?',
          options: ['Static Typing', 'Polymorphism', 'Compilation Inlining', 'Strict Encapsulation'],
          correctAnswer: 'Polymorphism',
          explanation: 'Polymorphism enables specialized derived implementations invoked dynamically through parent references.',
        },
      ],
      totalQuestions: 3,
    });

    // Create demo quiz result
    await QuizResult.create({
      quizId: quiz._id,
      userId: student._id,
      score: 3,
      totalQuestions: 3,
      percentage: 100,
      timeSpentSeconds: 45,
      feedback: 'Outstanding mastery! You have exceptional command over this material.',
      userAnswers: [
        {
          questionIndex: 0,
          question: 'Which OOP pillar is primarily concerned with restricting direct access to object state?',
          selectedOption: 'Encapsulation',
          correctAnswer: 'Encapsulation',
          isCorrect: true,
          explanation: 'Encapsulation bundles data and methods while restricting direct external access.',
        },
        {
          questionIndex: 1,
          question: 'What does the "S" in SOLID design principles represent?',
          selectedOption: 'Single Responsibility Principle',
          correctAnswer: 'Single Responsibility Principle',
          isCorrect: true,
          explanation: 'Single Responsibility Principle specifies one reason to change.',
        },
        {
          questionIndex: 2,
          question: 'What mechanism allows child classes to override parent class method implementations dynamically?',
          selectedOption: 'Polymorphism',
          correctAnswer: 'Polymorphism',
          isCorrect: true,
          explanation: 'Polymorphism allows dynamic runtime method dispatch.',
        },
      ],
    });

    // Create demo study plan
    await StudyPlan.create({
      userId: student._id,
      subject: 'Software Architecture & Design Patterns',
      examDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      dailyHours: 2,
      currentKnowledgeLevel: 'intermediate',
      topics: ['OOP Pillars', 'SOLID Principles', 'Design Patterns', 'Concurrency'],
      tasks: [
        {
          day: 1,
          dayLabel: 'Day 1: OOP Pillars & Encapsulation',
          topic: 'Object-Oriented Fundamentals',
          durationMinutes: 90,
          description: 'Master the 4 core pillars and access modifier conventions.',
          actionItems: ['Read lecture notes', 'Review 10 flashcards', 'Take 5-question check quiz'],
          isCompleted: true,
          completedAt: new Date(),
        },
        {
          day: 2,
          dayLabel: 'Day 2: SOLID Principles in Practice',
          topic: 'Architecture Guidelines',
          durationMinutes: 90,
          description: 'Deep dive into SRP, OCP, and LSP with practical examples.',
          actionItems: ['Refactor sample bad code', 'Summarize key failure modes'],
          isCompleted: true,
          completedAt: new Date(),
        },
        {
          day: 3,
          dayLabel: 'Day 3: Interface Segregation & Dependency Inversion',
          topic: 'Decoupling Architecture',
          durationMinutes: 90,
          description: 'Implement interfaces and mock dependencies.',
          actionItems: ['Write unit test using DIP', 'Generate flashcards on DIP vs ISP'],
          isCompleted: false,
        },
      ],
      progress: 67,
    });

    console.log('[Seed] Database seeded with demo student, admin, and study items.');
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
};

// If executed directly from CLI: node seed.js
if (require.main === module) {
  const dotenv = require('dotenv');
  dotenv.config();
  const { connectDB, disconnectDB } = require('./config/db');
  (async () => {
    await connectDB();
    await seedData(true);
    await disconnectDB();
    process.exit(0);
  })();
}

module.exports = { seedData };
