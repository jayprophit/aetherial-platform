/**
 * AETHERIAL Platform - IoT & Robotics Dashboard
 * 
 * Comprehensive IoT device management and robot control system
 * Features: Text-to-Robot commands, device management, sensor visualization, MQTT integration
 */

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../lib/hooks/useApi';
import './IoTDashboard.css';

// ============================================
// TYPES & INTERFACES
// ============================================

interface IoTDevice {
  id: string;
  name: string;
  type: 'robot' | 'sensor' | 'actuator' | 'camera' | 'smart_device';
  status: 'online' | 'offline' | 'error';
  lastSeen: Date;
  location?: string;
  battery?: number;
  metadata?: Record<string, any>;
}

interface Robot extends IoTDevice {
  type: 'robot';
  position: { x: number; y: number; z: number };
  orientation: { roll: number; pitch: number; yaw: number };
  capabilities: string[];
  currentTask?: string;
}

interface Sensor extends IoTDevice {
  type: 'sensor';
  sensorType: 'temperature' | 'humidity' | 'pressure' | 'motion' | 'light' | 'gas' | 'proximity';
  value: number;
  unit: string;
  threshold?: { min: number; max: number };
}

interface RobotCommand {
  id: string;
  timestamp: Date;
  command: string;
  naturalLanguage: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const IoTDashboard: React.FC = () => {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [robots, setRobots] = useState<Robot[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);
  const [textCommand, setTextCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<RobotCommand[]>([]);
  const [sensorData, setSensorData] = useState<Map<string, number[]>>(new Map());
  const [view, setView] = useState<'overview' | 'robots' | 'sensors' | 'control'>('overview');

  const { connected, emit, on, off } = useWebSocket();

  // ============================================
  // WEBSOCKET HANDLERS
  // ============================================

  useEffect(() => {
    if (connected) {
      // Subscribe to IoT updates
      emit('subscribe-iot', { topics: ['devices/*', 'robots/*', 'sensors/*'] });

      // Listen for device updates
      on('iot-device-update', (device: IoTDevice) => {
        setDevices(prev => {
          const index = prev.findIndex(d => d.id === device.id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = device;
            return updated;
          }
          return [...prev, device];
        });

        // Update specific device lists
        if (device.type === 'robot') {
          setRobots(prev => {
            const index = prev.findIndex(r => r.id === device.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = device as Robot;
              return updated;
            }
            return [...prev, device as Robot];
          });
        } else if (device.type === 'sensor') {
          setSensors(prev => {
            const index = prev.findIndex(s => s.id === device.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = device as Sensor;
              return updated;
            }
            return [...prev, device as Sensor];
          });
        }
      });

      // Listen for sensor data
      on('iot-sensor-data', (data: { sensorId: string; value: number; timestamp: Date }) => {
        setSensorData(prev => {
          const history = prev.get(data.sensorId) || [];
          history.push(data.value);
          if (history.length > 100) history.shift(); // Keep last 100 readings
          const updated = new Map(prev);
          updated.set(data.sensorId, history);
          return updated;
        });
      });

      // Listen for command results
      on('iot-command-result', (result: RobotCommand) => {
        setCommandHistory(prev => {
          const index = prev.findIndex(c => c.id === result.id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = result;
            return updated;
          }
          return [...prev, result];
        });
      });

      return () => {
        off('iot-device-update');
        off('iot-sensor-data');
        off('iot-command-result');
      };
    }
  }, [connected, emit, on, off]);

  // ============================================
  // TEXT-TO-ROBOT COMMAND PROCESSING
  // ============================================

  const sendTextCommand = async () => {
    if (!textCommand.trim()) return;

    const command: RobotCommand = {
      id: `cmd-${Date.now()}`,
      timestamp: new Date(),
      command: textCommand,
      naturalLanguage: textCommand,
      status: 'pending',
    };

    setCommandHistory(prev => [command, ...prev]);
    setTextCommand('');

    // Send to backend for NLP processing and execution
    emit('iot-text-command', {
      command: textCommand,
      targetDevice: selectedDevice?.id,
      commandId: command.id,
    });
  };

  const sendQuickCommand = (command: string) => {
    setTextCommand(command);
  };

  // ============================================
  // DEVICE CONTROL FUNCTIONS
  // ============================================

  const controlRobot = (robotId: string, action: string, params?: any) => {
    emit('iot-robot-control', {
      robotId,
      action,
      params,
      timestamp: new Date(),
    });
  };

  const updateDeviceSettings = (deviceId: string, settings: any) => {
    emit('iot-device-settings', {
      deviceId,
      settings,
      timestamp: new Date(),
    });
  };

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  const renderOverview = () => (
    <div className="iot-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Devices</h3>
          <div className="stat-value">{devices.length}</div>
          <div className="stat-breakdown">
            <span>{robots.length} Robots</span>
            <span>{sensors.length} Sensors</span>
            <span>{devices.length - robots.length - sensors.length} Other</span>
          </div>
        </div>

        <div className="stat-card">
          <h3>Online Devices</h3>
          <div className="stat-value">
            {devices.filter(d => d.status === 'online').length}
          </div>
          <div className="stat-percentage">
            {((devices.filter(d => d.status === 'online').length / devices.length) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="stat-card">
          <h3>Active Commands</h3>
          <div className="stat-value">
            {commandHistory.filter(c => c.status === 'executing').length}
          </div>
        </div>

        <div className="stat-card">
          <h3>Alerts</h3>
          <div className="stat-value">
            {sensors.filter(s => {
              if (!s.threshold) return false;
              return s.value < s.threshold.min || s.value > s.threshold.max;
            }).length}
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {commandHistory.slice(0, 10).map(cmd => (
            <div key={cmd.id} className={`activity-item status-${cmd.status}`}>
              <div className="activity-time">
                {new Date(cmd.timestamp).toLocaleTimeString()}
              </div>
              <div className="activity-content">
                <strong>{cmd.naturalLanguage}</strong>
                <span className="activity-status">{cmd.status}</span>
              </div>
              {cmd.result && <div className="activity-result">{cmd.result}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="device-grid">
        {devices.map(device => (
          <div
            key={device.id}
            className={`device-card ${device.status}`}
            onClick={() => setSelectedDevice(device)}
          >
            <div className="device-icon">{getDeviceIcon(device.type)}</div>
            <div className="device-info">
              <h4>{device.name}</h4>
              <span className="device-type">{device.type}</span>
              <span className={`device-status ${device.status}`}>{device.status}</span>
            </div>
            {device.battery !== undefined && (
              <div className="device-battery">
                <div className="battery-icon" style={{ width: `${device.battery}%` }} />
                <span>{device.battery}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderRobots = () => (
    <div className="robots-view">
      <div className="robots-grid">
        {robots.map(robot => (
          <div key={robot.id} className="robot-card">
            <div className="robot-header">
              <h3>{robot.name}</h3>
              <span className={`status-badge ${robot.status}`}>{robot.status}</span>
            </div>

            <div className="robot-position">
              <h4>Position</h4>
              <div className="coordinates">
                <span>X: {robot.position.x.toFixed(2)}</span>
                <span>Y: {robot.position.y.toFixed(2)}</span>
                <span>Z: {robot.position.z.toFixed(2)}</span>
              </div>
            </div>

            <div className="robot-orientation">
              <h4>Orientation</h4>
              <div className="coordinates">
                <span>Roll: {robot.orientation.roll.toFixed(2)}°</span>
                <span>Pitch: {robot.orientation.pitch.toFixed(2)}°</span>
                <span>Yaw: {robot.orientation.yaw.toFixed(2)}°</span>
              </div>
            </div>

            <div className="robot-capabilities">
              <h4>Capabilities</h4>
              <div className="capability-tags">
                {robot.capabilities.map(cap => (
                  <span key={cap} className="capability-tag">{cap}</span>
                ))}
              </div>
            </div>

            {robot.currentTask && (
              <div className="robot-task">
                <h4>Current Task</h4>
                <p>{robot.currentTask}</p>
              </div>
            )}

            <div className="robot-controls">
              <button onClick={() => controlRobot(robot.id, 'move_forward')}>
                ⬆️ Forward
              </button>
              <button onClick={() => controlRobot(robot.id, 'move_backward')}>
                ⬇️ Backward
              </button>
              <button onClick={() => controlRobot(robot.id, 'turn_left')}>
                ⬅️ Left
              </button>
              <button onClick={() => controlRobot(robot.id, 'turn_right')}>
                ➡️ Right
              </button>
              <button onClick={() => controlRobot(robot.id, 'stop')}>
                🛑 Stop
              </button>
              <button onClick={() => controlRobot(robot.id, 'return_home')}>
                🏠 Home
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSensors = () => (
    <div className="sensors-view">
      <div className="sensors-grid">
        {sensors.map(sensor => {
          const history = sensorData.get(sensor.id) || [];
          const isAlert = sensor.threshold &&
            (sensor.value < sensor.threshold.min || sensor.value > sensor.threshold.max);

          return (
            <div key={sensor.id} className={`sensor-card ${isAlert ? 'alert' : ''}`}>
              <div className="sensor-header">
                <h3>{sensor.name}</h3>
                <span className="sensor-type">{sensor.sensorType}</span>
              </div>

              <div className="sensor-value">
                <span className="value">{sensor.value.toFixed(2)}</span>
                <span className="unit">{sensor.unit}</span>
              </div>

              {sensor.threshold && (
                <div className="sensor-threshold">
                  <span>Min: {sensor.threshold.min}</span>
                  <span>Max: {sensor.threshold.max}</span>
                </div>
              )}

              <div className="sensor-chart">
                <svg width="100%" height="60" viewBox="0 0 100 60">
                  <polyline
                    points={history.map((val, idx) => 
                      `${(idx / history.length) * 100},${60 - (val / Math.max(...history)) * 50}`
                    ).join(' ')}
                    fill="none"
                    stroke="var(--primary-color)"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="sensor-info">
                <span>Last updated: {new Date(sensor.lastSeen).toLocaleTimeString()}</span>
                {sensor.location && <span>Location: {sensor.location}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderControl = () => (
    <div className="control-view">
      <div className="text-to-robot">
        <h2>Text-to-Robot Command</h2>
        <p>Control your robots using natural language commands</p>

        <div className="command-input-section">
          <div className="device-selector">
            <label>Target Device:</label>
            <select
              value={selectedDevice?.id || ''}
              onChange={(e) => {
                const device = devices.find(d => d.id === e.target.value);
                setSelectedDevice(device || null);
              }}
            >
              <option value="">All Devices</option>
              {robots.map(robot => (
                <option key={robot.id} value={robot.id}>{robot.name}</option>
              ))}
            </select>
          </div>

          <div className="command-input">
            <textarea
              value={textCommand}
              onChange={(e) => setTextCommand(e.target.value)}
              placeholder="Enter command in natural language, e.g., 'Move robot to position X:10, Y:20' or 'Turn on all lights in room 3'"
              rows={3}
            />
            <button onClick={sendTextCommand} disabled={!textCommand.trim()}>
              Send Command
            </button>
          </div>

          <div className="quick-commands">
            <h4>Quick Commands:</h4>
            <div className="quick-command-buttons">
              <button onClick={() => sendQuickCommand('Move forward 5 meters')}>
                Move Forward 5m
              </button>
              <button onClick={() => sendQuickCommand('Rotate 90 degrees clockwise')}>
                Rotate 90°
              </button>
              <button onClick={() => sendQuickCommand('Pick up object')}>
                Pick Up Object
              </button>
              <button onClick={() => sendQuickCommand('Return to charging station')}>
                Return to Base
              </button>
              <button onClick={() => sendQuickCommand('Start patrol mode')}>
                Start Patrol
              </button>
              <button onClick={() => sendQuickCommand('Emergency stop')}>
                Emergency Stop
              </button>
            </div>
          </div>
        </div>

        <div className="command-history">
          <h3>Command History</h3>
          <div className="history-list">
            {commandHistory.map(cmd => (
              <div key={cmd.id} className={`history-item status-${cmd.status}`}>
                <div className="history-header">
                  <span className="history-time">
                    {new Date(cmd.timestamp).toLocaleString()}
                  </span>
                  <span className={`history-status ${cmd.status}`}>
                    {cmd.status}
                  </span>
                </div>
                <div className="history-command">{cmd.naturalLanguage}</div>
                {cmd.result && (
                  <div className="history-result">
                    <strong>Result:</strong> {cmd.result}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="command-examples">
        <h3>Command Examples</h3>
        <ul>
          <li>"Move robot1 to coordinates X:10, Y:20, Z:0"</li>
          <li>"Rotate robot2 45 degrees counterclockwise"</li>
          <li>"Pick up the red box and place it on the shelf"</li>
          <li>"Follow the person wearing a blue shirt"</li>
          <li>"Scan the room for obstacles"</li>
          <li>"Turn on all lights in the living room"</li>
          <li>"Set thermostat to 72 degrees"</li>
          <li>"Start vacuum cleaner in bedroom"</li>
          <li>"Lock all doors and windows"</li>
          <li>"Play music on speaker in kitchen"</li>
        </ul>
      </div>
    </div>
  );

  const getDeviceIcon = (type: string): string => {
    const icons: Record<string, string> = {
      robot: '🤖',
      sensor: '📡',
      actuator: '⚙️',
      camera: '📷',
      smart_device: '💡',
    };
    return icons[type] || '📱';
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="iot-dashboard">
      <div className="dashboard-header">
        <h1>IoT & Robotics Dashboard</h1>
        <div className="connection-status">
          <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`} />
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="view-tabs">
        <button
          className={view === 'overview' ? 'active' : ''}
          onClick={() => setView('overview')}
        >
          Overview
        </button>
        <button
          className={view === 'robots' ? 'active' : ''}
          onClick={() => setView('robots')}
        >
          Robots ({robots.length})
        </button>
        <button
          className={view === 'sensors' ? 'active' : ''}
          onClick={() => setView('sensors')}
        >
          Sensors ({sensors.length})
        </button>
        <button
          className={view === 'control' ? 'active' : ''}
          onClick={() => setView('control')}
        >
          Control
        </button>
      </div>

      <div className="dashboard-content">
        {view === 'overview' && renderOverview()}
        {view === 'robots' && renderRobots()}
        {view === 'sensors' && renderSensors()}
        {view === 'control' && renderControl()}
      </div>
    </div>
  );
};

export default IoTDashboard;

