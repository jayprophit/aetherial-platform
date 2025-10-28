import React, { useState } from 'react';
import './QuizAssessment.css';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // minutes
  passingScore: number; // percentage
  questions: Question[];
}

const QuizAssessment: React.FC = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Mock quiz data
  const quiz: Quiz = {
    id: 'quiz-1',
    title: 'HTML5 Fundamentals Quiz',
    description: 'Test your knowledge of HTML5 basics, semantic elements, and best practices.',
    timeLimit: 30,
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlinks and Text Markup Language'
        ],
        correctAnswer: 0,
        explanation: 'HTML stands for Hyper Text Markup Language. It is the standard markup language for creating web pages.',
        points: 10
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'Which HTML5 element is used for navigation links?',
        options: ['<navigation>', '<nav>', '<navigate>', '<links>'],
        correctAnswer: 1,
        explanation: 'The <nav> element is used to define a set of navigation links in HTML5.',
        points: 10
      },
      {
        id: 'q3',
        type: 'true-false',
        question: 'HTML5 introduced semantic elements like <header>, <footer>, and <article>.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. HTML5 introduced many semantic elements to better describe the content structure.',
        points: 10
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'Which attribute is used to provide alternative text for an image?',
        options: ['title', 'alt', 'src', 'description'],
        correctAnswer: 1,
        explanation: 'The "alt" attribute provides alternative text for images, important for accessibility.',
        points: 10
      },
      {
        id: 'q5',
        type: 'short-answer',
        question: 'What is the purpose of the DOCTYPE declaration in HTML?',
        correctAnswer: 'document type',
        explanation: 'The DOCTYPE declaration tells the browser which version of HTML the page is using.',
        points: 15
      },
      {
        id: 'q6',
        type: 'multiple-choice',
        question: 'Which HTML5 element is used for independent, self-contained content?',
        options: ['<section>', '<article>', '<div>', '<content>'],
        correctAnswer: 1,
        explanation: 'The <article> element represents independent, self-contained content.',
        points: 10
      },
      {
        id: 'q7',
        type: 'true-false',
        question: 'The <canvas> element is used to draw graphics via JavaScript.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. The <canvas> element provides a drawing surface for graphics via JavaScript.',
        points: 10
      },
      {
        id: 'q8',
        type: 'multiple-choice',
        question: 'Which input type is new in HTML5?',
        options: ['text', 'email', 'submit', 'button'],
        correctAnswer: 1,
        explanation: 'The "email" input type is new in HTML5 and provides built-in validation.',
        points: 10
      },
      {
        id: 'q9',
        type: 'true-false',
        question: 'HTML5 requires all tags to be closed.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. HTML5 allows some void elements (like <img>, <br>) to be self-closing or not closed.',
        points: 10
      },
      {
        id: 'q10',
        type: 'multiple-choice',
        question: 'What is the correct HTML5 element for playing video files?',
        options: ['<movie>', '<video>', '<media>', '<film>'],
        correctAnswer: 1,
        explanation: 'The <video> element is used to embed video content in HTML5.',
        points: 15
      }
    ]
  };

  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
  const currentQuestion = quiz.questions[currentQuestionIndex];

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeRemaining(quiz.timeLimit * 60); // Convert to seconds
    // Start timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswerSelect = (answer: string | number) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate score
    let earnedPoints = 0;
    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (question.type === 'short-answer') {
        // Simple string matching for short answer
        if (typeof userAnswer === 'string' && 
            userAnswer.toLowerCase().includes(question.correctAnswer.toString().toLowerCase())) {
          earnedPoints += question.points;
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          earnedPoints += question.points;
        }
      }
    });
    
    const percentage = (earnedPoints / totalPoints) * 100;
    setScore(percentage);
    setQuizCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const isPassed = score >= quiz.passingScore;

  if (!quizStarted) {
    return (
      <div className="quiz-assessment">
        <div className="quiz-start-screen">
          <h1>{quiz.title}</h1>
          <p className="quiz-description">{quiz.description}</p>
          
          <div className="quiz-info">
            <div className="info-card">
              <span className="info-icon">📝</span>
              <div>
                <h3>{quiz.questions.length} Questions</h3>
                <p>{totalPoints} total points</p>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon">⏱️</span>
              <div>
                <h3>{quiz.timeLimit} Minutes</h3>
                <p>Time limit</p>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon">🎯</span>
              <div>
                <h3>{quiz.passingScore}%</h3>
                <p>Passing score</p>
              </div>
            </div>
          </div>

          <div className="quiz-instructions">
            <h3>Instructions:</h3>
            <ul>
              <li>You have {quiz.timeLimit} minutes to complete the quiz</li>
              <li>Each question is worth different points</li>
              <li>You need {quiz.passingScore}% to pass</li>
              <li>You can navigate between questions</li>
              <li>Submit when you're ready or time runs out</li>
            </ul>
          </div>

          <button className="start-quiz-btn" onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="quiz-assessment">
        <div className="quiz-results">
          <div className={`result-badge ${isPassed ? 'passed' : 'failed'}`}>
            {isPassed ? '🎉' : '😔'}
          </div>
          <h1>{isPassed ? 'Congratulations!' : 'Keep Learning!'}</h1>
          <p className="result-message">
            {isPassed 
              ? 'You passed the quiz! Great job!'
              : `You need ${quiz.passingScore}% to pass. Review the material and try again.`
            }
          </p>

          <div className="score-display">
            <div className="score-circle">
              <span className="score-value">{score.toFixed(0)}%</span>
            </div>
          </div>

          <div className="result-stats">
            <div className="stat">
              <span className="stat-label">Questions</span>
              <span className="stat-value">{quiz.questions.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Answered</span>
              <span className="stat-value">{answeredCount}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Score</span>
              <span className="stat-value">{score.toFixed(0)}%</span>
            </div>
          </div>

          <div className="result-actions">
            <button className="review-btn">Review Answers</button>
            <button className="retake-btn" onClick={() => window.location.reload()}>
              Retake Quiz
            </button>
            <button className="continue-btn" onClick={() => window.location.href = '/learning'}>
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-assessment">
      <div className="quiz-header">
        <div className="quiz-progress">
          <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="quiz-timer">
          <span className="timer-icon">⏱️</span>
          <span className={timeRemaining < 300 ? 'timer-warning' : ''}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      <div className="quiz-content">
        <div className="question-card">
          <div className="question-header">
            <span className="question-type">{currentQuestion.type.replace('-', ' ')}</span>
            <span className="question-points">{currentQuestion.points} points</span>
          </div>
          
          <h2 className="question-text">{currentQuestion.question}</h2>

          <div className="answer-options">
            {currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false' ? (
              currentQuestion.options?.map((option, index) => (
                <label key={index} className="option-label">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => handleAnswerSelect(index)}
                  />
                  <span className="option-text">{option}</span>
                </label>
              ))
            ) : (
              <textarea
                className="short-answer-input"
                placeholder="Type your answer here..."
                value={answers[currentQuestion.id] as string || ''}
                onChange={(e) => handleAnswerSelect(e.target.value)}
                rows={4}
              />
            )}
          </div>

          {showExplanation && currentQuestion.explanation && (
            <div className="explanation">
              <h4>Explanation:</h4>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        <div className="quiz-navigation">
          <button 
            className="nav-btn" 
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            ← Previous
          </button>
          
          <div className="question-indicators">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentQuestionIndex ? 'active' : ''} ${answers[quiz.questions[index].id] !== undefined ? 'answered' : ''}`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button className="nav-btn" onClick={handleNext}>
              Next →
            </button>
          ) : (
            <button className="submit-btn" onClick={handleSubmitQuiz}>
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizAssessment;

