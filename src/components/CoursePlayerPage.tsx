import React, { useState, useEffect, useCallback, useMemo } from 'react';

// =============================================================================
// 1. TYPESCRIPT INTERFACES AND TYPES
// =============================================================================

/**
 * Represents the status of a lesson or module.
 */
type ProgressStatus = 'completed' | 'in-progress' | 'not-started';

/**
 * Represents a single lesson, which can be a video, quiz, or content.
 */
interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'content';
  duration: number; // in minutes
  contentUrl: string; // URL for video, quiz, or content
  status: ProgressStatus;
  userProgress: number; // 0 to 100 for video time, quiz score, etc.
}

/**
 * Represents a module (section) of the course.
 */
interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  status: ProgressStatus;
}

/**
 * Represents a course.
 */
interface Course {
  id: string;
  title: string;
  author: string;
  description: string;
  modules: Module[];
  totalProgress: number; // 0 to 100
  certificateNftId: string | null; // AETHERIAL: ID of the NFT certificate if earned
  discussionForumId: string; // BuddyBoss-style integration
}

/**
 * Props for the CoursePlayerPage component.
 * In a real application, this might take a courseId to fetch data.
 */
interface CoursePlayerPageProps {
  courseId: string;
}

// =============================================================================
// 2. SAMPLE DATA (MOCK API RESPONSE)
// =============================================================================

const mockCourseData: Course = {
  id: 'aeth-course-001',
  title: 'Mastering Aetherial Platform Development',
  author: 'Dr. Elara Vance',
  description: 'A comprehensive guide to building on the AETHERIAL platform, covering AI, Blockchain, and DeFi integrations.',
  totalProgress: 45,
  certificateNftId: null,
  discussionForumId: 'aeth-forum-dev-001',
  modules: [
    {
      id: 'mod-01',
      title: 'Introduction to AETHERIAL & Web3',
      status: 'completed',
      lessons: [
        { id: 'les-01-01', title: 'Welcome & Setup', type: 'video', duration: 10, contentUrl: 'https://video.aeth.com/01-01', status: 'completed', userProgress: 100 },
        { id: 'les-01-02', title: 'Blockchain Fundamentals', type: 'content', duration: 15, contentUrl: 'https://content.aeth.com/01-02', status: 'completed', userProgress: 100 },
        { id: 'les-01-03', title: 'Quiz: Web3 Concepts', type: 'quiz', duration: 5, contentUrl: 'https://quiz.aeth.com/01-03', status: 'completed', userProgress: 90 },
      ],
    },
    {
      id: 'mod-02',
      title: 'AI-Powered Development Tools',
      status: 'in-progress',
      lessons: [
        { id: 'les-02-01', title: 'AI Code Generation (Video)', type: 'video', duration: 25, contentUrl: 'https://video.aeth.com/02-01', status: 'in-progress', userProgress: 60 },
        { id: 'les-02-02', title: 'Using the AETHERIAL AI Assistant', type: 'content', duration: 20, contentUrl: 'https://content.aeth.com/02-02', status: 'not-started', userProgress: 0 },
      ],
    },
    {
      id: 'mod-03',
      title: 'DeFi & Smart Contract Integration',
      status: 'not-started',
      lessons: [
        { id: 'les-03-01', title: 'DeFi Staking for Course Rewards', type: 'video', duration: 30, contentUrl: 'https://video.aeth.com/03-01', status: 'not-started', userProgress: 0 },
        { id: 'les-03-02', title: 'Final Assessment', type: 'quiz', duration: 15, contentUrl: 'https://quiz.aeth.com/03-02', status: 'not-started', userProgress: 0 },
      ],
    },
  ],
};

// =============================================================================
// 3. HELPER COMPONENTS (Simplified for this example)
// =============================================================================

/** A placeholder for the video player component. */
const VideoPlayer: React.FC<{ url: string; onProgress: (p: number) => void }> = ({ url, onProgress }) => {
  useEffect(() => {
    // Simulate video playing and progress update
    const interval = setInterval(() => {
      // In a real app, this would be tied to the video element's timeupdate event
      // For now, we simulate a small progress increment
      onProgress(Math.random() * 5);
    }, 5000);
    return () => clearInterval(interval);
  }, [onProgress]);

  return (
    <div className="video-player-container bg-black aspect-video flex items-center justify-center text-white">
      <p>Playing Video: {url}</p>
    </div>
  );
};

/** A placeholder for the Quiz component. */
const QuizComponent: React.FC<{ url: string; onComplete: (score: number) => void }> = ({ url, onComplete }) => {
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleStartQuiz = () => {
    // AETHERIAL Enhancement: AI-powered quiz generation/adaptation
    // In a real app, this would call an AI service to generate a personalized quiz
    setIsAiGenerated(true);
    console.log('AI is generating a personalized quiz...');
  };

  const handleSubmitQuiz = () => {
    const finalScore = Math.floor(Math.random() * 100); // Mock score
    setScore(finalScore);
    onComplete(finalScore);
  };

  return (
    <div className="quiz-container p-4 bg-gray-100 rounded">
      <h3 className="text-xl font-semibold mb-3">Lesson Quiz</h3>
      <p className="mb-4">Source: {url}</p>
      {!score ? (
        <>
          <button onClick={handleStartQuiz} className="bg-purple-600 text-white px-4 py-2 rounded mr-2 hover:bg-purple-700">
            {isAiGenerated ? 'Start AI Quiz' : 'Generate & Start Quiz'}
          </button>
          {isAiGenerated && (
            <button onClick={handleSubmitQuiz} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Submit Quiz (Mock)
            </button>
          )}
        </>
      ) : (
        <p className="text-lg font-bold text-green-600">Quiz Completed! Score: {score}%</p>
      )}
    </div>
  );
};

// =============================================================================
// 4. MAIN COURSE PLAYER COMPONENT
// =============================================================================

const CoursePlayerPage: React.FC<CoursePlayerPageProps> = ({ courseId }) => {
  // State to hold the course data
  const [course, setCourse] = useState<Course | null>(null);
  // State for the currently active lesson
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  // State for the currently active tab (Lesson, Discussion, Certificate)
  const [activeTab, setActiveTab] = useState<'lesson' | 'discussion' | 'certificate'>('lesson');
  // State to track if data is loading
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Simulate fetching course data from an API.
   */
  useEffect(() => {
    // In a production environment, this would be an actual API call
    setIsLoading(true);
    const fetchCourse = () => {
      return new Promise<Course>((resolve) => {
        setTimeout(() => {
          resolve(mockCourseData);
        }, 500); // Simulate network delay
      });
    };

    fetchCourse().then((data) => {
      setCourse(data);
      // Set the first 'in-progress' or 'not-started' lesson as active initially
      const firstActiveLesson = data.modules
        .flatMap(m => m.lessons)
        .find(l => l.status !== 'completed') || data.modules[0]?.lessons[0] || null;
      setActiveLesson(firstActiveLesson);
      setIsLoading(false);
    });
  }, [courseId]);

  /**
   * Handler for when a lesson is clicked in the sidebar.
   * @param lesson The lesson object to set as active.
   */
  const handleLessonClick = useCallback((lesson: Lesson) => {
    setActiveLesson(lesson);
    setActiveTab('lesson'); // Always switch to the lesson tab when a new lesson is selected
  }, []);

  /**
   * Handler for progress updates (e.g., from the video player).
   * @param newProgress The new progress value (0-100).
   */
  const handleLessonProgress = useCallback((newProgress: number) => {
    if (!course || !activeLesson) return;

    // Update the active lesson's progress
    const updatedCourse = { ...course };
    let totalCompletedLessons = 0;
    let totalLessons = 0;

    updatedCourse.modules = updatedCourse.modules.map(module => ({
      ...module,
      lessons: module.lessons.map(lesson => {
        totalLessons++;
        if (lesson.id === activeLesson.id) {
          const newStatus = newProgress >= 100 ? 'completed' : 'in-progress';
          if (newStatus === 'completed') totalCompletedLessons++;
          return { ...lesson, userProgress: Math.min(100, lesson.userProgress + newProgress), status: newStatus };
        }
        if (lesson.status === 'completed') totalCompletedLessons++;
        return lesson;
      }),
    }));

    // Recalculate total course progress
    updatedCourse.totalProgress = Math.floor((totalCompletedLessons / totalLessons) * 100);

    setCourse(updatedCourse);
  }, [course, activeLesson]);

  /**
   * AETHERIAL Enhancement: Handler for minting the NFT certificate.
   */
  const handleMintCertificate = useCallback(() => {
    if (!course || course.totalProgress < 100 || course.certificateNftId) return;

    // In a real app, this would interact with a smart contract
    console.log('Minting NFT Certificate via Smart Contract...');

    // Simulate successful minting
    setCourse(prev => prev ? { ...prev, certificateNftId: `aeth-nft-cert-${prev.id}-${Date.now()}` } : null);
    alert('Congratulations! Your NFT Certificate has been minted and added to your wallet.');
  }, [course]);

  /**
   * AETHERIAL Enhancement: Handler for staking rewards upon course completion.
   */
  const handleClaimDeFiStake = useCallback(() => {
    if (!course || course.totalProgress < 100) return;

    // In a real app, this would interact with a DeFi smart contract
    console.log('Claiming DeFi Staking Rewards...');

    // Simulate transaction
    alert('DeFi staking rewards claimed! 50 AETH deposited to your account.');
  }, [course]);


  // Memoized sidebar content for performance
  const sidebar = useMemo(() => {
    if (!course) return null;
    return (
      <div className="course-sidebar w-full md:w-1/4 bg-gray-50 p-4 overflow-y-auto h-full shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
        <div className="mb-4">
          <p className="text-sm text-gray-500">Progress: {course.totalProgress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${course.totalProgress}%` }}
            ></div>
          </div>
        </div>
        {course.modules.map(module => (
          <div key={module.id} className="mb-4">
            <h3 className="font-semibold text-lg border-b pb-1 mb-2 flex justify-between items-center">
              {module.title}
              <span className={`text-sm ${module.status === 'completed' ? 'text-green-500' : module.status === 'in-progress' ? 'text-yellow-500' : 'text-gray-400'}`}>
                ({module.status.replace('-', ' ')})
              </span>
            </h3>
            <ul className="space-y-1">
              {module.lessons.map(lesson => (
                <li
                  key={lesson.id}
                  className={`cursor-pointer p-2 rounded transition duration-150 ease-in-out ${
                    activeLesson?.id === lesson.id ? 'bg-blue-100 font-medium' : 'hover:bg-gray-200'
                  }`}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <span className="flex justify-between items-center text-sm">
                    {lesson.title} ({lesson.type})
                    {lesson.status === 'completed' && <span className="text-green-500">✓</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }, [course, activeLesson, handleLessonClick]);

  if (isLoading) {
    return <div className="p-8 text-center text-xl">Loading Course Data...</div>;
  }

  if (!course) {
    return <div className="p-8 text-center text-xl text-red-500">Error: Course not found or data failed to load.</div>;
  }

  return (
    // Responsive container with a main content area and a sidebar
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Sidebar for course content navigation */}
      {sidebar}

      {/* Main content area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h1 className="text-3xl font-extrabold mb-4 text-gray-800">{course.title}</h1>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('lesson')}
              className={`py-2 px-4 text-lg font-medium ${activeTab === 'lesson' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Lesson Player
            </button>
            <button
              onClick={() => setActiveTab('discussion')}
              className={`py-2 px-4 text-lg font-medium ${activeTab === 'discussion' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Discussion ({course.discussionForumId})
            </button>
            <button
              onClick={() => setActiveTab('certificate')}
              className={`py-2 px-4 text-lg font-medium ${activeTab === 'certificate' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Certificate & Rewards
            </button>
          </nav>
        </div>

        {/* =============================================================================
            TAB CONTENT: LESSON PLAYER
            ============================================================================= */}
        {activeTab === 'lesson' && activeLesson && (
          <div className="lesson-player-tab">
            <h2 className="text-2xl font-bold mb-4">{activeLesson.title}</h2>
            <p className="text-gray-600 mb-4">Type: <span className="capitalize">{activeLesson.type}</span> | Progress: {activeLesson.userProgress}%</p>

            {/* Content Display Area */}
            <div className="content-area mb-8">
              {activeLesson.type === 'video' && (
                <VideoPlayer
                  url={activeLesson.contentUrl}
                  onProgress={(p) => handleLessonProgress(p)}
                />
              )}
              {activeLesson.type === 'quiz' && (
                <QuizComponent
                  url={activeLesson.contentUrl}
                  onComplete={(score) => handleLessonProgress(score)} // Use score as progress
                />
              )}
              {activeLesson.type === 'content' && (
                <div className="p-6 bg-white border rounded shadow-sm">
                  <p className="text-lg">This is the static content for the lesson. (Source: {activeLesson.contentUrl})</p>
                  <p className="mt-4 text-sm text-gray-500">
                    <span className="font-semibold">BuddyBoss Abstraction:</span> This area would typically embed a rich content editor or a custom HTML block, similar to how BuddyBoss handles lesson content.
                  </p>
                </div>
              )}
            </div>

            {/* Interactive Features: Mark Complete Button */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => handleLessonProgress(100)}
                disabled={activeLesson.status === 'completed'}
                className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                  activeLesson.status === 'completed'
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {activeLesson.status === 'completed' ? 'Completed' : 'Mark as Complete'}
              </button>

              {/* AETHERIAL Enhancement: AI-Powered Q&A Button */}
              <button
                className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition duration-200"
                onClick={() => alert('AETHERIAL AI: Opening AI-powered Q&A for this lesson. Ask any question!')}
              >
                Ask AI Assistant
              </button>
            </div>
          </div>
        )}

        {/* =============================================================================
            TAB CONTENT: DISCUSSION (BuddyBoss Abstraction)
            ============================================================================= */}
        {activeTab === 'discussion' && (
          <div className="discussion-tab">
            <h2 className="text-2xl font-bold mb-4">Course Discussion Forum</h2>
            <div className="p-6 bg-gray-50 border rounded">
              <p className="text-lg text-gray-700">
                <span className="font-semibold">BuddyBoss Abstraction:</span> This area seamlessly embeds the discussion forum (Group ID: {course.discussionForumId}) for this course.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Users can post questions, share insights, and interact with the instructor and other students, leveraging the platform's social features.
              </p>
              {/* Placeholder for discussion component */}
              <div className="mt-4 h-64 bg-white border border-dashed flex items-center justify-center">
                [Embedded Discussion Component Here]
              </div>
            </div>
          </div>
        )}

        {/* =============================================================================
            TAB CONTENT: CERTIFICATE & REWARDS (AETHERIAL Enhancements)
            ============================================================================= */}
        {activeTab === 'certificate' && (
          <div className="certificate-rewards-tab">
            <h2 className="text-2xl font-bold mb-4">Course Certificate & AETHERIAL Rewards</h2>

            <div className="p-6 bg-green-50 border border-green-200 rounded mb-6">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Course Completion Status</h3>
              <p className="text-lg">Total Progress: <span className="font-bold">{course.totalProgress}%</span></p>

              {course.totalProgress === 100 ? (
                <>
                  <p className="text-green-700 font-bold mt-3">Congratulations! You have completed the course.</p>

                  {/* NFT Certificate Minting */}
                  <div className="mt-4 p-4 bg-white rounded shadow-md">
                    <h4 className="font-bold text-blue-700">AETHERIAL Enhancement: NFT Certificate</h4>
                    {course.certificateNftId ? (
                      <p className="text-green-600">Certificate Minted! NFT ID: <span className="font-mono">{course.certificateNftId}</span></p>
                    ) : (
                      <button
                        onClick={handleMintCertificate}
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Mint Your NFT Certificate (Blockchain)
                      </button>
                    )}
                  </div>

                  {/* DeFi Staking Rewards */}
                  <div className="mt-4 p-4 bg-white rounded shadow-md">
                    <h4 className="font-bold text-purple-700">AETHERIAL Enhancement: DeFi Staking Rewards</h4>
                    <p className="text-gray-700">Claim your DeFi staking rewards for successful course completion.</p>
                    <button
                      onClick={handleClaimDeFiStake}
                      className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                      Claim 50 AETH Rewards (DeFi)
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-red-700 mt-3">Keep going! Complete all lessons to unlock your certificate and rewards.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// 7. EXPORT DEFAULT
// =============================================================================
export default CoursePlayerPage;
