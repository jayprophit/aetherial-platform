import React, { useState, useRef } from 'react';
import './VideoPlayer.css';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'reading';
  completed: boolean;
  videoUrl?: string;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState('lesson-1');

  const course = {
    title: 'Complete Web Development Bootcamp 2025',
    progress: 35,
    sections: [
      {
        id: 'section-1',
        title: 'Introduction to Web Development',
        lessons: [
          { id: 'lesson-1', title: 'Welcome to the Course', duration: '5:30', type: 'video' as const, completed: true, videoUrl: 'https://example.com/video1.mp4' },
          { id: 'lesson-2', title: 'How the Web Works', duration: '12:15', type: 'video' as const, completed: true, videoUrl: 'https://example.com/video2.mp4' },
          { id: 'lesson-3', title: 'Setting Up Your Environment', duration: '18:45', type: 'video' as const, completed: false, videoUrl: 'https://example.com/video3.mp4' },
          { id: 'lesson-4', title: 'Knowledge Check Quiz', duration: '10:00', type: 'quiz' as const, completed: false }
        ]
      },
      {
        id: 'section-2',
        title: 'HTML5 Fundamentals',
        lessons: [
          { id: 'lesson-5', title: 'HTML Basics', duration: '10:30', type: 'video' as const, completed: false, videoUrl: 'https://example.com/video5.mp4' },
          { id: 'lesson-6', title: 'Semantic HTML', duration: '14:45', type: 'video' as const, completed: false, videoUrl: 'https://example.com/video6.mp4' },
          { id: 'lesson-7', title: 'HTML5 Reference Guide', duration: '5:00', type: 'reading' as const, completed: false }
        ]
      }
    ] as Section[]
  };

  const currentLesson = course.sections
    .flatMap(s => s.lessons)
    .find(l => l.id === selectedLessonId);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLessonSelect = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setIsPlaying(false);
  };

  const handleMarkComplete = () => {
    alert('Lesson marked as complete!');
  };

  const handleNextLesson = () => {
    const allLessons = course.sections.flatMap(s => s.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === selectedLessonId);
    if (currentIndex < allLessons.length - 1) {
      setSelectedLessonId(allLessons[currentIndex + 1].id);
      setIsPlaying(false);
    }
  };

  return (
    <div className="video-player-page">
      <div className="player-container">
        {/* Video Player */}
        <div className="video-section">
          <div className="video-wrapper">
            <video
              ref={videoRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              poster="https://picsum.photos/1280/720?random=1"
            >
              <source src={currentLesson?.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="video-controls">
              <div className="progress-bar">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="seek-bar"
                />
              </div>

              <div className="controls-bottom">
                <div className="controls-left">
                  <button onClick={handlePlayPause} className="play-btn">
                    {isPlaying ? '⏸️' : '▶️'}
                  </button>
                  <button className="skip-btn">⏮️ 10s</button>
                  <button className="skip-btn">10s ⏭️</button>
                  <div className="volume-control">
                    <button>🔊</button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="volume-slider"
                    />
                  </div>
                  <span className="time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="controls-right">
                  <div className="speed-control">
                    <button onClick={() => setShowSpeedMenu(!showSpeedMenu)}>
                      {playbackSpeed}x
                    </button>
                    {showSpeedMenu && (
                      <div className="speed-menu">
                        {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
                          <button
                            key={speed}
                            onClick={() => handleSpeedChange(speed)}
                            className={playbackSpeed === speed ? 'active' : ''}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="settings-btn">⚙️</button>
                  <button className="fullscreen-btn">⛶</button>
                </div>
              </div>
            </div>
          </div>

          <div className="lesson-info">
            <h1>{currentLesson?.title}</h1>
            <div className="lesson-actions">
              <button className="complete-btn" onClick={handleMarkComplete}>
                ✓ Mark as Complete
              </button>
              <button className="next-btn" onClick={handleNextLesson}>
                Next Lesson →
              </button>
            </div>
          </div>

          <div className="lesson-tabs">
            <button className="active">📝 Notes</button>
            <button>💬 Q&A</button>
            <button>📄 Resources</button>
          </div>

          <div className="lesson-content">
            <div className="notes-section">
              <h3>Lesson Notes</h3>
              <textarea placeholder="Take notes while watching..."></textarea>
              <button className="save-notes-btn">💾 Save Notes</button>
            </div>
          </div>
        </div>

        {/* Curriculum Sidebar */}
        <div className="curriculum-sidebar">
          <div className="course-header">
            <h2>{course.title}</h2>
            <div className="course-progress">
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${course.progress}%` }}></div>
              </div>
              <span className="progress-text">{course.progress}% complete</span>
            </div>
          </div>

          <div className="curriculum-list">
            {course.sections.map(section => (
              <div key={section.id} className="curriculum-section">
                <h3>{section.title}</h3>
                <div className="lessons-list">
                  {section.lessons.map(lesson => (
                    <div
                      key={lesson.id}
                      className={`lesson-item ${lesson.id === selectedLessonId ? 'active' : ''} ${lesson.completed ? 'completed' : ''}`}
                      onClick={() => handleLessonSelect(lesson.id)}
                    >
                      <div className="lesson-icon">
                        {lesson.completed ? '✓' : (
                          lesson.type === 'video' ? '▶️' :
                          lesson.type === 'quiz' ? '📝' : '📄'
                        )}
                      </div>
                      <div className="lesson-details">
                        <div className="lesson-title">{lesson.title}</div>
                        <div className="lesson-duration">{lesson.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

