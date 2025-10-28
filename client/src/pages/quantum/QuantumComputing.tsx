import React, { useState } from 'react';
import './QuantumComputing.css';

interface QuantumCircuit {
  id: string;
  name: string;
  qubits: number;
  gates: number;
  depth: number;
  status: 'draft' | 'ready' | 'running' | 'completed';
  createdAt: string;
}

interface QuantumJob {
  id: string;
  circuitName: string;
  backend: string;
  shots: number;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  endTime?: string;
}

const QuantumComputing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'circuits' | 'simulator' | 'jobs' | 'algorithms'>('circuits');
  const [selectedBackend, setSelectedBackend] = useState('ibm_quantum');

  const circuits: QuantumCircuit[] = [
    {
      id: '1',
      name: 'Bell State Circuit',
      qubits: 2,
      gates: 3,
      depth: 2,
      status: 'ready',
      createdAt: '2025-01-15'
    },
    {
      id: '2',
      name: 'Grover Search Algorithm',
      qubits: 4,
      gates: 12,
      depth: 8,
      status: 'completed',
      createdAt: '2025-01-14'
    },
    {
      id: '3',
      name: 'Quantum Fourier Transform',
      qubits: 3,
      gates: 9,
      depth: 6,
      status: 'draft',
      createdAt: '2025-01-16'
    },
    {
      id: '4',
      name: 'Shor Factorization',
      qubits: 5,
      gates: 20,
      depth: 15,
      status: 'running',
      createdAt: '2025-01-16'
    }
  ];

  const jobs: QuantumJob[] = [
    {
      id: 'job-001',
      circuitName: 'Bell State Circuit',
      backend: 'IBM Quantum (5 qubits)',
      shots: 1024,
      status: 'completed',
      progress: 100,
      startTime: '2025-01-16 10:30',
      endTime: '2025-01-16 10:35'
    },
    {
      id: 'job-002',
      circuitName: 'Grover Search Algorithm',
      backend: 'AWS Braket (Simulator)',
      shots: 2048,
      status: 'running',
      progress: 65,
      startTime: '2025-01-16 11:00'
    },
    {
      id: 'job-003',
      circuitName: 'Quantum Fourier Transform',
      backend: 'Google Quantum AI',
      shots: 512,
      status: 'queued',
      progress: 0,
      startTime: '2025-01-16 11:15'
    }
  ];

  const backends = [
    { id: 'ibm_quantum', name: 'IBM Quantum', qubits: 5, status: 'available', queue: 3 },
    { id: 'aws_braket', name: 'AWS Braket', qubits: 34, status: 'available', queue: 0 },
    { id: 'google_quantum', name: 'Google Quantum AI', qubits: 53, status: 'available', queue: 5 },
    { id: 'azure_quantum', name: 'Azure Quantum', qubits: 20, status: 'maintenance', queue: 0 },
    { id: 'local_simulator', name: 'Local Simulator', qubits: 32, status: 'available', queue: 0 }
  ];

  const algorithms = [
    {
      name: "Shor's Algorithm",
      description: 'Integer factorization for breaking RSA encryption',
      qubits: '4n + 2',
      complexity: 'O((log N)³)',
      icon: '🔢'
    },
    {
      name: "Grover's Algorithm",
      description: 'Unstructured search with quadratic speedup',
      qubits: 'log₂(N)',
      complexity: 'O(√N)',
      icon: '🔍'
    },
    {
      name: 'Quantum Fourier Transform',
      description: 'Quantum version of discrete Fourier transform',
      qubits: 'n',
      complexity: 'O(n²)',
      icon: '📊'
    },
    {
      name: 'Variational Quantum Eigensolver',
      description: 'Find ground state energy of molecules',
      qubits: 'Variable',
      complexity: 'Polynomial',
      icon: '⚛️'
    },
    {
      name: 'Quantum Approximate Optimization',
      description: 'Solve combinatorial optimization problems',
      qubits: 'Variable',
      complexity: 'Depends on problem',
      icon: '🎯'
    },
    {
      name: 'Quantum Phase Estimation',
      description: 'Estimate eigenvalues of unitary operators',
      qubits: 'n + m',
      complexity: 'O(1/ε)',
      icon: '📐'
    }
  ];

  return (
    <div className="quantum-computing">
      <div className="quantum-container">
        {/* Header */}
        <div className="quantum-header">
          <div>
            <h1>⚛️ Quantum Computing Lab</h1>
            <p>Design, simulate, and run quantum circuits on real quantum hardware</p>
          </div>
          <button className="new-circuit-btn">+ New Circuit</button>
        </div>

        {/* Stats Overview */}
        <div className="quantum-stats">
          <div className="stat-card-quantum">
            <div className="stat-icon-quantum">📊</div>
            <div className="stat-info-quantum">
              <span className="stat-label-quantum">Total Circuits</span>
              <span className="stat-value-quantum">{circuits.length}</span>
            </div>
          </div>
          <div className="stat-card-quantum">
            <div className="stat-icon-quantum">▶️</div>
            <div className="stat-info-quantum">
              <span className="stat-label-quantum">Running Jobs</span>
              <span className="stat-value-quantum">{jobs.filter(j => j.status === 'running').length}</span>
            </div>
          </div>
          <div className="stat-card-quantum">
            <div className="stat-icon-quantum">✅</div>
            <div className="stat-info-quantum">
              <span className="stat-label-quantum">Completed</span>
              <span className="stat-value-quantum">{jobs.filter(j => j.status === 'completed').length}</span>
            </div>
          </div>
          <div className="stat-card-quantum">
            <div className="stat-icon-quantum">🖥️</div>
            <div className="stat-info-quantum">
              <span className="stat-label-quantum">Available Backends</span>
              <span className="stat-value-quantum">{backends.filter(b => b.status === 'available').length}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="quantum-tabs">
          <button
            className={activeTab === 'circuits' ? 'active' : ''}
            onClick={() => setActiveTab('circuits')}
          >
            📊 Circuits
          </button>
          <button
            className={activeTab === 'simulator' ? 'active' : ''}
            onClick={() => setActiveTab('simulator')}
          >
            🖥️ Simulator
          </button>
          <button
            className={activeTab === 'jobs' ? 'active' : ''}
            onClick={() => setActiveTab('jobs')}
          >
            ⚙️ Jobs
          </button>
          <button
            className={activeTab === 'algorithms' ? 'active' : ''}
            onClick={() => setActiveTab('algorithms')}
          >
            🧮 Algorithms
          </button>
        </div>

        {/* Circuits Tab */}
        {activeTab === 'circuits' && (
          <div className="circuits-content">
            <div className="circuits-grid">
              {circuits.map(circuit => (
                <div key={circuit.id} className={`circuit-card ${circuit.status}`}>
                  <div className="circuit-header">
                    <h4>{circuit.name}</h4>
                    <span className={`circuit-status ${circuit.status}`}>
                      {circuit.status}
                    </span>
                  </div>
                  
                  <div className="circuit-stats-grid">
                    <div className="circuit-stat">
                      <span className="stat-label">Qubits</span>
                      <span className="stat-value">{circuit.qubits}</span>
                    </div>
                    <div className="circuit-stat">
                      <span className="stat-label">Gates</span>
                      <span className="stat-value">{circuit.gates}</span>
                    </div>
                    <div className="circuit-stat">
                      <span className="stat-label">Depth</span>
                      <span className="stat-value">{circuit.depth}</span>
                    </div>
                  </div>

                  <div className="circuit-diagram">
                    <div className="qubit-line"></div>
                    <div className="qubit-line"></div>
                    <div className="gate">H</div>
                    <div className="gate">CNOT</div>
                    <div className="measurement">M</div>
                  </div>

                  <div className="circuit-meta">
                    <span>Created: {circuit.createdAt}</span>
                  </div>

                  <div className="circuit-actions">
                    <button className="circuit-btn">✏️ Edit</button>
                    <button className="circuit-btn">▶️ Run</button>
                    <button className="circuit-btn">📊 Results</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Simulator Tab */}
        {activeTab === 'simulator' && (
          <div className="simulator-content">
            <div className="simulator-layout">
              <div className="circuit-builder">
                <h3>Circuit Builder</h3>
                <div className="qubit-controls">
                  <label>Number of Qubits:</label>
                  <input type="number" min="1" max="32" defaultValue="3" />
                </div>

                <div className="gate-palette">
                  <h4>Quantum Gates</h4>
                  <div className="gates-grid">
                    <button className="gate-btn" title="Hadamard Gate">H</button>
                    <button className="gate-btn" title="Pauli-X Gate">X</button>
                    <button className="gate-btn" title="Pauli-Y Gate">Y</button>
                    <button className="gate-btn" title="Pauli-Z Gate">Z</button>
                    <button className="gate-btn" title="CNOT Gate">CNOT</button>
                    <button className="gate-btn" title="Toffoli Gate">TOF</button>
                    <button className="gate-btn" title="S Gate">S</button>
                    <button className="gate-btn" title="T Gate">T</button>
                    <button className="gate-btn" title="Rotation X">RX</button>
                    <button className="gate-btn" title="Rotation Y">RY</button>
                    <button className="gate-btn" title="Rotation Z">RZ</button>
                    <button className="gate-btn" title="Measurement">M</button>
                  </div>
                </div>

                <div className="circuit-canvas">
                  <div className="canvas-placeholder">
                    <p>🎨 Drag gates here to build your circuit</p>
                    <div className="example-circuit">
                      <div className="qubit-wire">
                        <span>|0⟩</span>
                        <div className="wire-line"></div>
                        <div className="gate-box">H</div>
                        <div className="wire-line"></div>
                        <div className="gate-box">●</div>
                        <div className="wire-line"></div>
                        <div className="measure-box">M</div>
                      </div>
                      <div className="qubit-wire">
                        <span>|0⟩</span>
                        <div className="wire-line"></div>
                        <div className="wire-line"></div>
                        <div className="gate-box">⊕</div>
                        <div className="wire-line"></div>
                        <div className="measure-box">M</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="simulation-controls">
                  <button className="sim-btn primary">▶️ Run Simulation</button>
                  <button className="sim-btn">🔄 Reset</button>
                  <button className="sim-btn">💾 Save</button>
                  <button className="sim-btn">📤 Export</button>
                </div>
              </div>

              <div className="simulation-results">
                <h3>Simulation Results</h3>
                
                <div className="backend-selector">
                  <label>Backend:</label>
                  <select value={selectedBackend} onChange={(e) => setSelectedBackend(e.target.value)}>
                    {backends.filter(b => b.status === 'available').map(backend => (
                      <option key={backend.id} value={backend.id}>
                        {backend.name} ({backend.qubits} qubits)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="shots-control">
                  <label>Shots:</label>
                  <input type="number" min="1" max="10000" defaultValue="1024" />
                </div>

                <div className="results-visualization">
                  <h4>State Vector</h4>
                  <div className="state-vector">
                    <div className="state-item">
                      <span className="state-label">|00⟩</span>
                      <div className="state-bar" style={{ width: '50%' }}></div>
                      <span className="state-value">0.707</span>
                    </div>
                    <div className="state-item">
                      <span className="state-label">|01⟩</span>
                      <div className="state-bar" style={{ width: '0%' }}></div>
                      <span className="state-value">0.000</span>
                    </div>
                    <div className="state-item">
                      <span className="state-label">|10⟩</span>
                      <div className="state-bar" style={{ width: '0%' }}></div>
                      <span className="state-value">0.000</span>
                    </div>
                    <div className="state-item">
                      <span className="state-label">|11⟩</span>
                      <div className="state-bar" style={{ width: '50%' }}></div>
                      <span className="state-value">0.707</span>
                    </div>
                  </div>

                  <h4>Measurement Histogram</h4>
                  <div className="histogram">
                    <div className="histogram-bar" style={{ height: '80%' }}>
                      <span className="bar-label">|00⟩</span>
                      <span className="bar-value">512</span>
                    </div>
                    <div className="histogram-bar" style={{ height: '5%' }}>
                      <span className="bar-label">|01⟩</span>
                      <span className="bar-value">25</span>
                    </div>
                    <div className="histogram-bar" style={{ height: '5%' }}>
                      <span className="bar-label">|10⟩</span>
                      <span className="bar-value">25</span>
                    </div>
                    <div className="histogram-bar" style={{ height: '80%' }}>
                      <span className="bar-label">|11⟩</span>
                      <span className="bar-value">512</span>
                    </div>
                  </div>
                </div>

                <div className="quantum-metrics">
                  <div className="metric">
                    <span className="metric-label">Fidelity:</span>
                    <span className="metric-value">0.998</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Execution Time:</span>
                    <span className="metric-value">125 ms</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Gate Errors:</span>
                    <span className="metric-value">0.002</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="jobs-content">
            <div className="jobs-list">
              {jobs.map(job => (
                <div key={job.id} className={`job-card ${job.status}`}>
                  <div className="job-header">
                    <div>
                      <h4>{job.circuitName}</h4>
                      <span className="job-id">Job ID: {job.id}</span>
                    </div>
                    <span className={`job-status ${job.status}`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="job-details">
                    <div className="job-detail">
                      <span className="detail-label">Backend:</span>
                      <span className="detail-value">{job.backend}</span>
                    </div>
                    <div className="job-detail">
                      <span className="detail-label">Shots:</span>
                      <span className="detail-value">{job.shots}</span>
                    </div>
                    <div className="job-detail">
                      <span className="detail-label">Started:</span>
                      <span className="detail-value">{job.startTime}</span>
                    </div>
                    {job.endTime && (
                      <div className="job-detail">
                        <span className="detail-label">Completed:</span>
                        <span className="detail-value">{job.endTime}</span>
                      </div>
                    )}
                  </div>

                  {job.status === 'running' && (
                    <div className="job-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{job.progress}%</span>
                    </div>
                  )}

                  <div className="job-actions">
                    {job.status === 'completed' && (
                      <button className="job-btn">📊 View Results</button>
                    )}
                    {(job.status === 'queued' || job.status === 'running') && (
                      <button className="job-btn">❌ Cancel</button>
                    )}
                    <button className="job-btn">📥 Download</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="backends-section">
              <h3>Available Quantum Backends</h3>
              <div className="backends-grid">
                {backends.map(backend => (
                  <div key={backend.id} className={`backend-card ${backend.status}`}>
                    <div className="backend-header">
                      <h4>{backend.name}</h4>
                      <span className={`backend-status ${backend.status}`}>
                        {backend.status}
                      </span>
                    </div>
                    <div className="backend-info">
                      <div className="backend-stat">
                        <span>Qubits:</span>
                        <strong>{backend.qubits}</strong>
                      </div>
                      <div className="backend-stat">
                        <span>Queue:</span>
                        <strong>{backend.queue} jobs</strong>
                      </div>
                    </div>
                    {backend.status === 'available' && (
                      <button className="backend-btn">Select Backend</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Algorithms Tab */}
        {activeTab === 'algorithms' && (
          <div className="algorithms-content">
            <div className="algorithms-header">
              <h3>Quantum Algorithms Library</h3>
              <p>Pre-built quantum algorithms ready to run</p>
            </div>

            <div className="algorithms-grid">
              {algorithms.map((algo, index) => (
                <div key={index} className="algorithm-card">
                  <div className="algorithm-icon">{algo.icon}</div>
                  <h4>{algo.name}</h4>
                  <p className="algorithm-description">{algo.description}</p>
                  
                  <div className="algorithm-specs">
                    <div className="spec">
                      <span className="spec-label">Qubits Required:</span>
                      <span className="spec-value">{algo.qubits}</span>
                    </div>
                    <div className="spec">
                      <span className="spec-label">Complexity:</span>
                      <span className="spec-value">{algo.complexity}</span>
                    </div>
                  </div>

                  <div className="algorithm-actions">
                    <button className="algo-btn primary">▶️ Run</button>
                    <button className="algo-btn">📖 Learn More</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="learning-resources">
              <h3>📚 Learning Resources</h3>
              <div className="resources-list">
                <div className="resource-item">
                  <span className="resource-icon">📘</span>
                  <div className="resource-content">
                    <strong>Introduction to Quantum Computing</strong>
                    <p>Learn the fundamentals of quantum mechanics and quantum gates</p>
                  </div>
                  <button className="resource-btn">Start</button>
                </div>
                <div className="resource-item">
                  <span className="resource-icon">🎓</span>
                  <div className="resource-content">
                    <strong>Quantum Algorithm Design</strong>
                    <p>Master the art of designing efficient quantum algorithms</p>
                  </div>
                  <button className="resource-btn">Start</button>
                </div>
                <div className="resource-item">
                  <span className="resource-icon">🔬</span>
                  <div className="resource-content">
                    <strong>Quantum Error Correction</strong>
                    <p>Understand how to protect quantum information from errors</p>
                  </div>
                  <button className="resource-btn">Start</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuantumComputing;

