import React, { useState, useEffect, useRef } from 'react'
import { 
  Send, Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Upload, 
  Download, Code, Play, Stop, Image, FileText, Mail, MessageSquare,
  Bot, User, Copy, Share, Trash2, Edit, Settings, Zap, Brain,
  Camera, Paperclip, Smile, MoreHorizontal, Volume2, VolumeX
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const AI = ({ user }) => {
  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoCall, setIsVideoCall] = useState(false)
  const [isVoiceCall, setIsVoiceCall] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [codeOutput, setCodeOutput] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const aiModels = [
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', status: 'online' },
    { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', status: 'online' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', status: 'online' },
    { id: 'deepseek', name: 'DeepSeek', provider: 'DeepSeek', status: 'online' },
    { id: 'qwen', name: 'Qwen', provider: 'Alibaba', status: 'online' },
    { id: 'copilot', name: 'Copilot', provider: 'Microsoft', status: 'online' },
  ]

  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'code', label: 'Code Assistant', icon: Code },
    { id: 'voice', label: 'Voice & Video', icon: Mic },
    { id: 'files', label: 'File Analysis', icon: FileText },
    { id: 'communication', label: 'Communication', icon: Mail },
    { id: 'tools', label: 'AI Tools', icon: Zap },
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      model: selectedModel
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(inputMessage, selectedModel),
        timestamp: new Date(),
        model: selectedModel
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const generateAIResponse = (message, model) => {
    const responses = {
      'gpt-4': `GPT-4 Response: I understand you're asking about "${message}". Let me provide a comprehensive analysis...`,
      'claude-3': `Claude 3 Response: Thank you for your question about "${message}". Here's my thoughtful response...`,
      'gemini-pro': `Gemini Pro Response: Analyzing your query "${message}" with advanced reasoning...`,
      'deepseek': `DeepSeek Response: Processing your request "${message}" with deep learning insights...`,
      'qwen': `Qwen Response: Understanding your question "${message}" with multilingual capabilities...`,
      'copilot': `Copilot Response: Assisting with "${message}" using integrated development tools...`
    }
    return responses[model] || `AI Response to: ${message}`
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const executeCode = async (code) => {
    setIsExecuting(true)
    // Simulate code execution
    setTimeout(() => {
      setCodeOutput(`Executing code...\n\nOutput:\nHello, World!\nCode executed successfully!`)
      setIsExecuting(false)
    }, 2000)
  }

  const startVoiceCall = () => {
    setIsVoiceCall(true)
    // Simulate voice call connection
  }

  const startVideoCall = () => {
    setIsVideoCall(true)
    // Simulate video call connection
  }

  const sendEmail = async (to, subject, body) => {
    // Simulate email sending
    console.log('Sending email:', { to, subject, body })
    alert('Email sent successfully!')
  }

  const sendSMS = async (to, message) => {
    // Simulate SMS sending
    console.log('Sending SMS:', { to, message })
    alert('SMS sent successfully!')
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Panel - Model Selection & Tools */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-500" />
            <span>AI Hub</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center space-x-1 text-xs"
            >
              <tab.icon className="w-3 h-3" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* AI Models */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold mb-3">AI Models</h3>
          <div className="space-y-2">
            {aiModels.map(model => (
              <div
                key={model.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedModel === model.id 
                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-300' 
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
                onClick={() => setSelectedModel(model.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{model.name}</div>
                    <div className="text-xs text-gray-500">{model.provider}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    model.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 flex-1">
          <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={startVoiceCall}
            >
              <Phone className="w-4 h-4 mr-2" />
              Voice Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={startVideoCall}
            >
              <Video className="w-4 h-4 mr-2" />
              Video Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => setActiveTab('communication')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => setActiveTab('communication')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send SMS
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'chat' && (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold">{aiModels.find(m => m.id === selectedModel)?.name}</div>
                  <div className="text-sm text-gray-500">AI Assistant</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Ask me anything! I can help with code, analysis, creative tasks, and more.
                  </p>
                </div>
              ) : (
                messages.map(message => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl p-4 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-blue-600' 
                            : 'bg-gradient-to-r from-green-400 to-blue-500'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm mb-1">
                            {message.type === 'user' ? user?.name || 'You' : message.model}
                          </div>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Image className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Code className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    rows={3}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    variant={isRecording ? "destructive" : "ghost"}
                    size="sm"
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'code' && (
          <div className="flex-1 flex flex-col">
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Code Assistant</h3>
              <p className="text-sm text-gray-500">Write, execute, and debug code with AI assistance</p>
            </div>
            <div className="flex-1 flex">
              <div className="flex-1 p-4">
                <textarea
                  placeholder="Write your code here..."
                  className="w-full h-64 p-4 border border-gray-200 dark:border-gray-600 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  defaultValue={`# Python Example
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))`}
                />
                <div className="flex items-center space-x-2 mt-4">
                  <Button onClick={() => executeCode('')} disabled={isExecuting}>
                    {isExecuting ? <Stop className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isExecuting ? 'Executing...' : 'Run Code'}
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="w-80 p-4 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-2">Output</h4>
                <pre className="text-sm bg-black text-green-400 p-4 rounded-lg h-64 overflow-y-auto">
                  {codeOutput || 'No output yet. Run your code to see results.'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'communication' && (
          <div className="flex-1 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <h3 className="text-2xl font-bold">Communication Hub</h3>
              
              {/* Email Section */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Send Email
                </h4>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="To: recipient@example.com"
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                  <textarea
                    placeholder="Email body..."
                    rows={6}
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                  <Button onClick={() => sendEmail()}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>

              {/* SMS Section */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Send SMS
                </h4>
                <div className="space-y-4">
                  <input
                    type="tel"
                    placeholder="Phone number"
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                  <textarea
                    placeholder="Message (160 characters max)"
                    rows={3}
                    maxLength={160}
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                  <Button onClick={() => sendSMS()}>
                    <Send className="w-4 h-4 mr-2" />
                    Send SMS
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voice/Video Call Overlay */}
        {(isVoiceCall || isVideoCall) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  {isVideoCall ? <Video className="w-8 h-8 text-white" /> : <Phone className="w-8 h-8 text-white" />}
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {isVideoCall ? 'Video Call' : 'Voice Call'} with AI
                </h3>
                <p className="text-gray-500 mb-6">Connected - 00:45</p>
                <div className="flex justify-center space-x-4">
                  <Button variant="ghost" size="sm">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  {isVideoCall && (
                    <Button variant="ghost" size="sm">
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setIsVoiceCall(false)
                      setIsVideoCall(false)
                    }}
                  >
                    <PhoneOff className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  )
}

export default AI

