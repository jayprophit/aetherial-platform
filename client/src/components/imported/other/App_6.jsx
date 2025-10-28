import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);
  const [modules, setModules] = useState([]);
  const [coursesData, setCoursesData] = useState({});
  const [productsData, setProductsData] = useState({});
  const [booksData, setBooksData] = useState({});

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitiesRes, modulesRes, coursesRes, productsRes, booksRes] = await Promise.all([
          fetch(`${API_BASE}/dashboard/stats`),
          fetch(`${API_BASE}/dashboard/activities`),
          fetch(`${API_BASE}/dashboard/modules`),
          fetch(`${API_BASE}/courses/overview`),
          fetch(`${API_BASE}/products/overview`),
          fetch(`${API_BASE}/books/overview`)
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (activitiesRes.ok) setActivities((await activitiesRes.json()).activities || []);
        if (modulesRes.ok) setModules((await modulesRes.json()).modules || []);
        if (coursesRes.ok) setCoursesData(await coursesRes.json());
        if (productsRes.ok) setProductsData(await productsRes.json());
        if (booksRes.ok) setBooksData(await booksRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', badge: null },
    { id: 'ai-hub', icon: '🤖', label: 'AI Hub', badge: '47' },
    { id: 'blockchain', icon: '⛓️', label: 'Blockchain', badge: '156' },
    { id: 'courses', icon: '📚', label: 'Courses', badge: '12' },
    { id: 'products', icon: '🛒', label: 'Products', badge: '8' },
    { id: 'books', icon: '📖', label: 'Books', badge: '10' },
    { id: 'nanobrain', icon: '🧠', label: 'Nanobrain AI', badge: 'NEW' },
    { id: 'quantum-assistant', icon: '⚛️', label: 'Quantum Assistant', badge: '128' },
    { id: 'iot-manufacturing', icon: '🏭', label: 'IoT Manufacturing', badge: '40' },
    { id: 'robotics', icon: '🤖', label: 'Robotics', badge: '567' },
    { id: 'healthcare', icon: '🏥', label: 'Healthcare', badge: '96.8%' },
    { id: 'ecommerce', icon: '🛍️', label: 'E-Commerce', badge: '500K' },
    { id: 'communication', icon: '💬', label: 'Communication', badge: '15K' },
    { id: 'business', icon: '🏢', label: 'Business', badge: '2.3K' },
    { id: 'security', icon: '🔒', label: 'Security', badge: '97.8%' }
  ];

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Platform Overview</h1>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{formatNumber(stats.total_users)}</span>
            <span className="stat-label">Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{formatNumber(stats.active_projects)}</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{formatCurrency(stats.total_revenue)}</span>
            <span className="stat-label">Revenue</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📚 Learning Platform</h3>
          <div className="card-stats">
            <div className="stat">
              <span className="value">{coursesData.total_courses || 0}</span>
              <span className="label">Courses</span>
            </div>
            <div className="stat">
              <span className="value">{formatNumber(coursesData.total_students)}</span>
              <span className="label">Students</span>
            </div>
            <div className="stat">
              <span className="value">{coursesData.average_rating || 0}⭐</span>
              <span className="label">Rating</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{width: `${coursesData.completion_rate || 0}%`}}></div>
          </div>
          <span className="progress-label">{coursesData.completion_rate || 0}% Completion Rate</span>
        </div>

        <div className="dashboard-card">
          <h3>🛒 Marketplace</h3>
          <div className="card-stats">
            <div className="stat">
              <span className="value">{productsData.total_products || 0}</span>
              <span className="label">Products</span>
            </div>
            <div className="stat">
              <span className="value">{formatNumber(productsData.total_sellers)}</span>
              <span className="label">Sellers</span>
            </div>
            <div className="stat">
              <span className="value">{formatCurrency(productsData.revenue_today)}</span>
              <span className="label">Today</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{width: `${(productsData.daily_orders / 50) || 0}%`}}></div>
          </div>
          <span className="progress-label">{productsData.daily_orders || 0} Orders Today</span>
        </div>

        <div className="dashboard-card">
          <h3>📖 Digital Library</h3>
          <div className="card-stats">
            <div className="stat">
              <span className="value">{booksData.total_books || 0}</span>
              <span className="label">Books</span>
            </div>
            <div className="stat">
              <span className="value">{formatNumber(booksData.total_downloads)}</span>
              <span className="label">Downloads</span>
            </div>
            <div className="stat">
              <span className="value">{booksData.average_rating || 0}⭐</span>
              <span className="label">Rating</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{width: `${(booksData.new_releases_this_month * 10) || 0}%`}}></div>
          </div>
          <span className="progress-label">{booksData.new_releases_this_month || 0} New This Month</span>
        </div>

        <div className="dashboard-card">
          <h3>🤖 AI Systems</h3>
          <div className="card-stats">
            <div className="stat">
              <span className="value">{stats.ai_models_active || 0}</span>
              <span className="label">Models</span>
            </div>
            <div className="stat">
              <span className="value">{stats.quantum_qubits || 0}</span>
              <span className="label">Qubits</span>
            </div>
            <div className="stat">
              <span className="value">94.2%</span>
              <span className="label">Accuracy</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{width: '94%'}}></div>
          </div>
          <span className="progress-label">AI Performance</span>
        </div>
      </div>

      <div className="activity-section">
        <h3>Recent Activities</h3>
        <div className="activity-list">
          {activities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">{activity.id === 'AI' ? '🤖' : activity.id === 'BC' ? '⛓️' : '🛒'}</div>
              <div className="activity-content">
                <h4>{activity.title}</h4>
                <p>{activity.description}</p>
                <span className="activity-time">{activity.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="content-section">
      <div className="section-header">
        <h1>📚 Learning Platform</h1>
        <div className="header-actions">
          <button className="btn-primary">Create Course</button>
          <button className="btn-secondary">Import Content</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{coursesData.total_courses || 0}</h3>
          <p>Total Courses</p>
          <span className="trend positive">+8 this month</span>
        </div>
        <div className="stat-card">
          <h3>{formatNumber(coursesData.total_students)}</h3>
          <p>Active Students</p>
          <span className="trend positive">+12.5%</span>
        </div>
        <div className="stat-card">
          <h3>{coursesData.average_rating || 0}⭐</h3>
          <p>Average Rating</p>
          <span className="trend positive">+0.2</span>
        </div>
        <div className="stat-card">
          <h3>{coursesData.completion_rate || 0}%</h3>
          <p>Completion Rate</p>
          <span className="trend positive">+5.3%</span>
        </div>
      </div>

      <div className="content-grid">
        <div className="content-card">
          <h3>🤖 AI & Machine Learning</h3>
          <p>Advanced courses in artificial intelligence, machine learning, and neural networks</p>
          <div className="course-stats">
            <span>3 Courses</span>
            <span>36,690 Students</span>
            <span>4.8⭐ Rating</span>
          </div>
          <div className="course-list">
            <div className="course-item">
              <strong>Advanced Emotional AI Development</strong>
              <span>Dr. Sarah Chen • 15,420 students • $199.99</span>
            </div>
            <div className="course-item">
              <strong>Quantum Machine Learning</strong>
              <span>Prof. Michael Rodriguez • 8,930 students • $149.99</span>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h3>⛓️ Blockchain & Web3</h3>
          <p>Comprehensive blockchain development and DeFi protocol courses</p>
          <div className="course-stats">
            <span>2 Courses</span>
            <span>17,520 Students</span>
            <span>4.7⭐ Rating</span>
          </div>
          <div className="course-list">
            <div className="course-item">
              <strong>DeFi Protocol Development</strong>
              <span>Alex Thompson • 9,870 students • $249.99</span>
            </div>
            <div className="course-item">
              <strong>NFT Marketplace Creation</strong>
              <span>Emma Davis • 7,650 students • $129.99</span>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h3>🤖 Robotics & IoT</h3>
          <p>Robotics control systems and IoT device management</p>
          <div className="course-stats">
            <span>2 Courses</span>
            <span>14,350 Students</span>
            <span>4.7⭐ Rating</span>
          </div>
          <div className="course-list">
            <div className="course-item">
              <strong>Text2Robot Command Systems</strong>
              <span>Dr. James Park • 5,430 students • $189.99</span>
            </div>
            <div className="course-item">
              <strong>IoT Fleet Management</strong>
              <span>Maria Gonzalez • 8,920 students • $159.99</span>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h3>🏥 Healthcare Technology</h3>
          <p>AI-powered medical diagnosis and telemedicine platforms</p>
          <div className="course-stats">
            <span>2 Courses</span>
            <span>11,100 Students</span>
            <span>4.7⭐ Rating</span>
          </div>
          <div className="course-list">
            <div className="course-item">
              <strong>AI Medical Diagnosis Systems</strong>
              <span>Dr. Robert Kim • 6,780 students • $219.99</span>
            </div>
            <div className="course-item">
              <strong>Telemedicine Platform Development</strong>
              <span>Dr. Jennifer Lee • 4,320 students • $169.99</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="content-section">
      <div className="section-header">
        <h1>🛒 Product Marketplace</h1>
        <div className="header-actions">
          <button className="btn-primary">Add Product</button>
          <button className="btn-secondary">Manage Inventory</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{productsData.total_products || 0}</h3>
          <p>Total Products</p>
          <span className="trend positive">+5 categories</span>
        </div>
        <div className="stat-card">
          <h3>{formatNumber(productsData.total_sellers)}</h3>
          <p>Active Sellers</p>
          <span className="trend positive">+15%</span>
        </div>
        <div className="stat-card">
          <h3>{productsData.daily_orders || 0}</h3>
          <p>Daily Orders</p>
          <span className="trend positive">+8.3%</span>
        </div>
        <div className="stat-card">
          <h3>{formatCurrency(productsData.revenue_today)}</h3>
          <p>Revenue Today</p>
          <span className="trend positive">+15.2%</span>
        </div>
      </div>

      <div className="content-grid">
        <div className="content-card">
          <h3>📱 Electronics & Tech</h3>
          <p>Advanced quantum processors, AI chips, and cutting-edge technology</p>
          <div className="product-stats">
            <span>2 Products</span>
            <span>$18,499 Avg Price</span>
            <span>4.8⭐ Rating</span>
          </div>
          <div className="product-list">
            <div className="product-item">
              <strong>Quantum Processing Unit - QPU-2024</strong>
              <span>QuantumTech Industries • $15,999.99 • 128 Qubits</span>
            </div>
            <div className="product-item">
              <strong>AI Neural Chip - NeuralCore X1</strong>
              <span>BrainTech Solutions • $2,499.99 • 1000 TOPS</span>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h3>💾 Digital Products</h3>
          <p>Professional software, AI tools, and digital assets</p>
          <div className="product-stats">
            <span>2 Products</span>
            <span>$549 Avg Price</span>
            <span>4.7⭐ Rating</span>
          </div>
          <div className="product-list">
            <div className="product-item">
              <strong>Advanced CAD Design Suite Pro</strong>
              <span>DesignMaster Studios • $899.99 • 3D Modeling</span>
            </div>
            <div className="product-item">
              <strong>AI Music Generation Engine</strong>
              <span>SoundAI Labs • $199.99 • Real-time Generation</span>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h3>🔧 Hardware & Components</h3>
          <p>IoT sensors, development kits, and electronic components</p>
          <div className="product-stats">
            <span>1 Product</span>
            <span>$299 Avg Price</span>
            <span>4.8⭐ Rating</span>
          </div>
          <div className="product-list">
            <div className="product-item">
              <strong>IoT Sensor Development Kit</strong>
              <span>IoTech Components • $299.99 • 20+ Sensors</span>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h3>🎯 Services & Consulting</h3>
          <p>Custom AI development and professional consulting services</p>
          <div className="product-stats">
            <span>1 Service</span>
            <span>$4,999 Avg Price</span>
            <span>4.9⭐ Rating</span>
          </div>
          <div className="product-list">
            <div className="product-item">
              <strong>Custom AI Model Development</strong>
              <span>AI Solutions Pro • $4,999.99 • Enterprise Grade</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // Advanced Features Rendering Functions
  const renderNanobrainAI = () => {
    const [nanobrainData, setNanobrainData] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
      fetch(`${API_BASE}/api/advanced/ai/nanobrain`)
        .then(res => res.json())
        .then(data => setNanobrainData(data))
        .catch(err => console.error('Error fetching nanobrain data:', err));
    }, []);

    const processWithNanobrain = async () => {
      setProcessing(true);
      try {
        const response = await fetch(`${API_BASE}/api/advanced/ai/nanobrain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: inputText })
        });
        const result = await response.json();
        console.log('Nanobrain processing result:', result);
      } catch (error) {
        console.error('Error processing with nanobrain:', error);
      }
      setProcessing(false);
    };

    return (
      <div className="content-area">
        <div className="content-header">
          <h2>🧠 Nanobrain AI</h2>
          <div className="action-buttons">
            <button className="btn-primary">Neural Training</button>
            <button className="btn-secondary">Plasticity Analysis</button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Architecture</h3>
            <p className="stat-value">{nanobrainData?.nanobrain_info?.architecture || 'Loading...'}</p>
            <span className="stat-change">Spiking Neural Network</span>
          </div>
          <div className="stat-card">
            <h3>Neurons</h3>
            <p className="stat-value">{formatNumber(nanobrainData?.nanobrain_info?.neurons)}</p>
            <span className="stat-change">+500 this hour</span>
          </div>
          <div className="stat-card">
            <h3>Synapses</h3>
            <p className="stat-value">{formatNumber(nanobrainData?.nanobrain_info?.synapses)}</p>
            <span className="stat-change">Dynamic adaptation</span>
          </div>
          <div className="stat-card">
            <h3>Efficiency</h3>
            <p className="stat-value">{nanobrainData?.nanobrain_info?.efficiency || '94.2%'}</p>
            <span className="stat-change positive">+2.1% improvement</span>
          </div>
        </div>

        <div className="content-grid">
          <div className="content-card">
            <h3>🧠 Neural Processing</h3>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter text for nanobrain processing..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="form-input"
              />
              <button 
                onClick={processWithNanobrain}
                disabled={processing}
                className="btn-primary"
              >
                {processing ? 'Processing...' : 'Process'}
              </button>
            </div>
            <div className="capabilities-list">
              {nanobrainData?.capabilities?.map((capability, index) => (
                <div key={index} className="capability-item">
                  <span className="capability-icon">⚡</span>
                  <span>{capability}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="content-card">
            <h3>🔬 Memristive Learning</h3>
            <div className="progress-item">
              <span>Synaptic Plasticity</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '94%'}}></div>
              </div>
              <span>94%</span>
            </div>
            <div className="progress-item">
              <span>STDP Adaptation</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '87%'}}></div>
              </div>
              <span>87%</span>
            </div>
            <div className="progress-item">
              <span>Network Efficiency</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '96%'}}></div>
              </div>
              <span>96%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuantumAssistant = () => {
    const [quantumData, setQuantumData] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [queryText, setQueryText] = useState('');

    useEffect(() => {
      fetch(`${API_BASE}/api/advanced/quantum/virtual-assistant`)
        .then(res => res.json())
        .then(data => setQuantumData(data))
        .catch(err => console.error('Error fetching quantum data:', err));
    }, []);

    const processQuantumQuery = async () => {
      setProcessing(true);
      try {
        const response = await fetch(`${API_BASE}/api/advanced/quantum/virtual-assistant`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: queryText })
        });
        const result = await response.json();
        console.log('Quantum processing result:', result);
      } catch (error) {
        console.error('Error processing quantum query:', error);
      }
      setProcessing(false);
    };

    return (
      <div className="content-area">
        <div className="content-header">
          <h2>⚛️ Quantum Virtual Assistant</h2>
          <div className="action-buttons">
            <button className="btn-primary">Quantum Simulation</button>
            <button className="btn-secondary">Algorithm Optimization</button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Qubits</h3>
            <p className="stat-value">{quantumData?.quantum_specs?.total_qubits || 128}</p>
            <span className="stat-change">Quantum ready</span>
          </div>
          <div className="stat-card">
            <h3>Quantum Volume</h3>
            <p className="stat-value">{quantumData?.quantum_specs?.quantum_volume || 64}</p>
            <span className="stat-change">High fidelity</span>
          </div>
          <div className="stat-card">
            <h3>Gate Fidelity</h3>
            <p className="stat-value">{quantumData?.quantum_specs?.gate_fidelity || '99.5%'}</p>
            <span className="stat-change positive">Industry leading</span>
          </div>
          <div className="stat-card">
            <h3>Coherence Time</h3>
            <p className="stat-value">{quantumData?.quantum_specs?.coherence_time || '150μs'}</p>
            <span className="stat-change">Stable operation</span>
          </div>
        </div>

        <div className="content-grid">
          <div className="content-card">
            <h3>⚛️ Quantum Processing</h3>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter quantum computation query..."
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                className="form-input"
              />
              <button 
                onClick={processQuantumQuery}
                disabled={processing}
                className="btn-primary"
              >
                {processing ? 'Computing...' : 'Compute'}
              </button>
            </div>
            <div className="algorithms-grid">
              {quantumData?.quantum_specs?.quantum_algorithms?.map((algorithm, index) => (
                <div key={index} className="algorithm-item">
                  <span className="algorithm-icon">🔬</span>
                  <span>{algorithm}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="content-card">
            <h3>🚀 Quantum Capabilities</h3>
            {quantumData?.capabilities?.map((capability, index) => (
              <div key={index} className="capability-row">
                <span className="capability-icon">⚡</span>
                <span className="capability-name">{capability}</span>
                <span className="capability-status">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderIoTManufacturing = () => {
    const [iotData, setIoTData] = useState(null);
    const [manufacturing, setManufacturing] = useState(false);
    const [designFile, setDesignFile] = useState('');
    const [machineType, setMachineType] = useState('3d_printer');

    useEffect(() => {
      fetch(`${API_BASE}/api/advanced/iot/manufacturing`)
        .then(res => res.json())
        .then(data => setIoTData(data))
        .catch(err => console.error('Error fetching IoT data:', err));
    }, []);

    const startManufacturing = async () => {
      setManufacturing(true);
      try {
        const response = await fetch(`${API_BASE}/api/advanced/iot/manufacturing`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ design_file: designFile, machine_type: machineType })
        });
        const result = await response.json();
        console.log('Manufacturing result:', result);
      } catch (error) {
        console.error('Error starting manufacturing:', error);
      }
      setManufacturing(false);
    };

    return (
      <div className="content-area">
        <div className="content-header">
          <h2>🏭 IoT Manufacturing</h2>
          <div className="action-buttons">
            <button className="btn-primary">Start Production</button>
            <button className="btn-secondary">Machine Status</button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>3D Printers</h3>
            <p className="stat-value">{iotData?.connected_machines?.['3d_printers'] || 15}</p>
            <span className="stat-change">Online</span>
          </div>
          <div className="stat-card">
            <h3>CNC Machines</h3>
            <p className="stat-value">{iotData?.connected_machines?.cnc_machines || 8}</p>
            <span className="stat-change">Active</span>
          </div>
          <div className="stat-card">
            <h3>Laser Engravers</h3>
            <p className="stat-value">{iotData?.connected_machines?.laser_engravers || 12}</p>
            <span className="stat-change">Ready</span>
          </div>
          <div className="stat-card">
            <h3>Success Rate</h3>
            <p className="stat-value">{iotData?.manufacturing_stats?.success_rate || '96.8%'}</p>
            <span className="stat-change positive">Excellent</span>
          </div>
        </div>

        <div className="content-grid">
          <div className="content-card">
            <h3>🏭 Manufacturing Control</h3>
            <div className="form-group">
              <label>Design File</label>
              <input
                type="text"
                placeholder="Upload or specify design file..."
                value={designFile}
                onChange={(e) => setDesignFile(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Machine Type</label>
              <select 
                value={machineType} 
                onChange={(e) => setMachineType(e.target.value)}
                className="form-select"
              >
                <option value="3d_printer">3D Printer</option>
                <option value="cnc_machine">CNC Machine</option>
                <option value="laser_engraver">Laser Engraver</option>
                <option value="injection_molder">Injection Molder</option>
              </select>
            </div>
            <button 
              onClick={startManufacturing}
              disabled={manufacturing}
              className="btn-primary full-width"
            >
              {manufacturing ? 'Manufacturing...' : 'Start Manufacturing'}
            </button>
          </div>

          <div className="content-card">
            <h3>📊 Manufacturing Statistics</h3>
            <div className="stat-row">
              <span>Total Jobs</span>
              <span>{iotData?.manufacturing_stats?.total_jobs || 2456}</span>
            </div>
            <div className="stat-row">
              <span>Average Time</span>
              <span>{iotData?.manufacturing_stats?.average_time || '45 minutes'}</span>
            </div>
            <div className="stat-row">
              <span>Materials Used</span>
              <span>{iotData?.manufacturing_stats?.materials_used || '15.6 tons'}</span>
            </div>
            
            <h4>Supported Formats</h4>
            <div className="formats-grid">
              {iotData?.supported_formats?.map((format, index) => (
                <span key={index} className="format-tag">{format}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };(
    <div className="content-section">
      <div className="section-header">
        <h1>📖 Digital Library</h1>
        <div className="header-actions">
          <button className="btn-primary">Upload Book</button>
          <button className="btn-secondary">Manage Collection</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{booksData.total_books || 0}</h3>
          <p>Total Books</p>
          <span className="trend positive">+{booksData.new_releases_this_month || 0} this month</span>
        </div>
        <div className="stat-card">
          <h3>{formatNumber(booksData.total_downloads)}</h3>
          <p>Total Downloads</p>
          <span className="trend positive">+15%</span>
        </div>
        <div className="stat-card">
          <h3>{booksData.average_rating || 0}⭐</h3>
          <p>Average Rating</p>
          <span className="trend positive">+0.1</span>
        </div>
        <div className="stat-card">
          <h3>{booksData.research_papers || 0}</h3>
          <p>Research Papers</p>
          <span className="trend positive">Academic</span>
        </div>
      </div>

      <div className="content-grid">
        <div className="content-card">
          <h3>🤖 AI & Machine Learning</h3>
          <p>Comprehensive guides on emotional AI, quantum ML, and multi-agent systems</p>
          <div className="book-stats">
            <span>3 Books</span>
            <span>27,540 Downloads</span>
            <span>4.8⭐ Rating</span>
          </div>
          <div className="book-list">
            <div className="book-item">
              <strong>Deep Learning for Emotional AI Systems</strong>
              <span>Dr. Sarah Chen • 624 pages • $89.99</span>
            </div>
            <div className="book-item">
              <strong>Quantum Machine Learning: Algorithms</strong>
              <span>Prof. Alice Quantum • 512 pages • $79.99</span>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h3>⛓️ Blockchain & Cryptocurrency</h3>
          <p>DeFi protocol development and NFT marketplace implementation</p>
          <div className="book-stats">
            <span>2 Books</span>
            <span>14,190 Downloads</span>
            <span>4.7⭐ Rating</span>
          </div>
          <div className="book-list">
            <div className="book-item">
              <strong>DeFi Protocol Development</strong>
              <span>Alex Thompson • 568 pages • $94.99</span>
            </div>
            <div className="book-item">
              <strong>NFT Marketplace Architecture</strong>
              <span>Emma Davis • 392 pages • $59.99</span>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h3>🤖 Robotics & IoT</h3>
          <p>Natural language robotics control and IoT fleet management</p>
          <div className="book-stats">
            <span>2 Books</span>
            <span>6,340 Downloads</span>
            <span>4.7⭐ Rating</span>
          </div>
          <div className="book-list">
            <div className="book-item">
              <strong>Text2Robot: Natural Language Control</strong>
              <span>Dr. James Park • 456 pages • $74.99</span>
            </div>
            <div className="book-item">
              <strong>IoT Fleet Management</strong>
              <span>Maria Gonzalez • 384 pages • $64.99</span>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h3>🏥 Healthcare Technology</h3>
          <p>AI medical diagnosis and telemedicine platform development</p>
          <div className="book-stats">
            <span>1 Book</span>
            <span>5,670 Downloads</span>
            <span>4.9⭐ Rating</span>
          </div>
          <div className="book-list">
            <div className="book-item">
              <strong>AI in Medical Diagnosis</strong>
              <span>Dr. Robert Kim • 512 pages • $89.99</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'courses': return renderCourses();
      case 'products': return renderProducts();
      case 'nanobrain':
        return renderNanobrainAI();
      case 'quantum-assistant':
        return renderQuantumAssistant();
      case 'iot-manufacturing':
        return renderIoTManufacturing();
      case 'books': return renderBooks();
      case 'ai-hub': return (
        <div className="content-section">
          <h1>🤖 AI Hub</h1>
          <div className="ai-stats">
            <div className="stat-card">
              <h3>{stats.ai_models_active || 0}</h3>
              <p>Active AI Models</p>
            </div>
            <div className="stat-card">
              <h3>94.2%</h3>
              <p>Model Accuracy</p>
            </div>
            <div className="stat-card">
              <h3>{stats.quantum_qubits || 0}</h3>
              <p>Quantum Qubits</p>
            </div>
          </div>
          <p>Advanced AI systems with virtual accelerator and multi-model orchestration.</p>
        </div>
      );
      case 'blockchain': return (
        <div className="content-section">
          <h1>⛓️ Blockchain</h1>
          <div className="blockchain-stats">
            <div className="stat-card">
              <h3>{stats.blockchain_nodes || 0}</h3>
              <p>Active Nodes</p>
            </div>
            <div className="stat-card">
              <h3>$13.45B</h3>
              <p>Total TVL</p>
            </div>
            <div className="stat-card">
              <h3>15,678</h3>
              <p>NFT Listings</p>
            </div>
          </div>
          <p>DeFi protocols, NFT marketplace, and decentralized search capabilities.</p>
        </div>
      );
      default: return (
        <div className="content-section">
          <h1>{sidebarItems.find(item => item.id === activeTab)?.label || 'Module'}</h1>
          <p>Module content and functionality will be displayed here.</p>
        </div>
      );
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🚀</span>
            {!sidebarCollapsed && <span className="logo-text">Unified Platform</span>}
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && (
                <>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <h2>Real Unified Platform</h2>
            <div className="status-indicator">
              <span className="status-dot active"></span>
              <span>All Systems Operational</span>
            </div>
          </div>
          <div className="header-right">
            <button 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className="user-menu">
              <span>Admin</span>
              <div className="avatar">👤</div>
            </div>
          </div>
        </header>

        <main className="content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;

