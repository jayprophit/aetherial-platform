import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Import components
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import AuthModal from './components/AuthModal'

// Import pages
import Home from './pages/Home'
import Profile from './pages/Profile'
import Communities from './pages/Communities'
import Marketplace from './pages/Marketplace'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import Blockchain from './pages/Blockchain'
import AI from './pages/AI'
import Banking from './pages/Banking'
import Healthcare from './pages/Healthcare'
import Learning from './pages/Learning'
import Business from './pages/Business'

function App() {
  const [user, setUser] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState('home')

  // Check for existing user session
  useEffect(() => {
    const savedUser = localStorage.getItem('unifiedPlatformUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('unifiedPlatformUser', JSON.stringify(userData))
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('unifiedPlatformUser')
    setCurrentTab('home')
  }

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      setShowAuthModal(true)
      return <Navigate to="/" />
    }
    return children
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Navigation */}
        <Navbar 
          user={user}
          onLogin={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar 
            user={user}
            isOpen={sidebarOpen}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          />

          {/* Main Content */}
          <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} pt-16`}>
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              
              {/* Protected Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile user={user} setUser={setUser} />
                </ProtectedRoute>
              } />
              
              <Route path="/communities" element={
                <ProtectedRoute>
                  <Communities user={user} />
                </ProtectedRoute>
              } />
              
              <Route path="/marketplace" element={
                <ProtectedRoute>
                  <Marketplace user={user} />
                </ProtectedRoute>
              } />
              
              <Route path="/messages" element={
                <ProtectedRoute>
                  <Messages user={user} />
                </ProtectedRoute>
              } />
              
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications user={user} />
                </ProtectedRoute>
              } />
              
              <Route path="/blockchain" element={
                <ProtectedRoute>
                  <Blockchain user={user} />
                </ProtectedRoute>
              } />
              
              <Route path="/ai" element={
                <ProtectedRoute>
                  <AI user={user} />
                </ProtectedRoute>
              } />
              
              <Route path="/banking" element={
                <ProtectedRoute>
                  <Banking user={user} />
                </ProtectedRoute>
              } />
              
              <Route path="/healthcare" element={
                <ProtectedRoute>
                  <Healthcare user={user} />
                </ProtectedRoute>
              } />
              
              <Route path="/learning" element={
                <ProtectedRoute>
                  <Learning user={user} />
                </ProtectedRoute>
              } />
              
              <Route path="/business" element={
                <ProtectedRoute>
                  <Business user={user} />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings user={user} setUser={setUser} />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>

        {/* Authentication Modal */}
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    </Router>
  )
}

export default App

