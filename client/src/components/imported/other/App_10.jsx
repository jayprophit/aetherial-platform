import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  Brain, 
  Blocks, 
  Bot, 
  Heart, 
  Truck, 
  Users, 
  ShoppingCart, 
  MessageCircle, 
  GraduationCap,
  Building,
  Shield,
  Smartphone,
  Globe,
  Zap,
  TrendingUp,
  Star,
  Play,
  Search,
  Bell,
  Settings,
  User,
  Menu,
  X,
  ChevronRight,
  Activity,
  DollarSign,
  Target,
  Award,
  Briefcase,
  Camera,
  Video,
  Mic,
  Phone,
  Mail,
  Calendar,
  FileText,
  Download,
  Upload,
  Share,
  ThumbsUp,
  MessageSquare,
  Send,
  Eye,
  Lock,
  Unlock,
  Home,
  Bookmark,
  Trending,
  Compass,
  PlusCircle,
  MoreHorizontal
} from 'lucide-react'
import './App.css'

// Mock API base URL (in production, this would be your backend URL)
const API_BASE = 'http://localhost:5000'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [activeTab, setActiveTab] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 125420,
    activeProjects: 8934,
    totalRevenue: 4550000,
    coursesCompleted: 23456
  })

  // Simulate user login
  useEffect(() => {
    setCurrentUser({
      id: 'user001',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/api/placeholder/40/40',
      role: 'Premium User',
      joinDate: '2024-01-15'
    })
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }
