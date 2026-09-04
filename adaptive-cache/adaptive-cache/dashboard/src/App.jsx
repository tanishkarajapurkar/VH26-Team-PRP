import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import HitRateChart from './components/HitRateChart';
import WeightEvolution from './components/WeightEvolution';
import CostEvictionPanel from './components/CostEvictionPanel';
import ScoreDistribution from './components/ScoreDistribution';
import PhaseIndicator from './components/PhaseIndicator';

const SOCKET_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : window.location.origin;

function App() {
    const [connected, setConnected] = useState(false);
    const [running, setRunning] = useState(false);
    const [metrics, setMetrics] = useState({
        hit_rate: 0,
        request_count: 0,
        entries: 0,
        size_utilization: 0,
        phase: 'steady',
        time: 0,
    });
    const [hitRateHistory, setHitRateHistory] = useState([]);
    const [weightHistory, setWeightHistory] = useState([]);
    const [evictions, setEvictions] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            setConnected(true);
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            setConnected(false);
        });

        socket.on('metrics', (data) => {
            setMetrics(data);
            setHitRateHistory(prev => [...prev.slice(-100), {
                time: data.time,
                hit_rate: data.hit_rate,
            }]);
        });

        socket.on('weight_update', (data) => {
            setWeightHistory(prev => [...prev.slice(-100), {
                time: Date.now() / 1000,
                ...data,
            }]);
        });

        socket.on('eviction', (data) => {
            setEvictions(prev => [...prev.slice(-50), {
                time: Date.now() / 1000,
                ...data,
            }]);
        });

        return () => socket.disconnect();
    }, []);

    const handleStart = async () => {
        await fetch('/api/start', { method: 'POST' });
        setRunning(true);
    };

    const handleStop = async () => {
        await fetch('/api/stop', { method: 'POST' });
        setRunning(false);
    };

    return (
        <div className="dashboard">
            <div className="header">
                <h1>🧠 Adaptive Cache Dashboard</h1>
                <div className="status">
                    <span className={`status-dot ${connected ? '' : 'off'}`} />
                    <span>{connected ? 'Connected' : 'Disconnected'}</span>
                    <PhaseIndicator phase={metrics.phase} />
                    <div className="controls">
                        <button
                            className="btn btn-start"
                            onClick={handleStart}
                            disabled={running}
                        >
                            ▶ Start
                        </button>
                        <button
                            className="btn btn-stop"
                            onClick={handleStop}
                            disabled={!running}
                        >
                            ⏹ Stop
                        </button>
                    </div>
                </div>
            </div>

            <div className="panel">
                <h2>📊 Real-Time Metrics</h2>
                <div className="metrics-grid">
                    <div className="metric-card">
                        <div className="metric-value">
                            {(metrics.hit_rate * 100).toFixed(1)}%
                        </div>
                        <div className="metric-label">Hit Rate</div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-value">{metrics.request_count}</div>
                        <div className="metric-label">Requests</div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-value">{metrics.entries}</div>
                        <div className="metric-label">Entries</div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-value">
                            {(metrics.size_utilization * 100).toFixed(1)}%
                        </div>
                        <div className="metric-label">Capacity Used</div>
                    </div>
                </div>
                <HitRateChart data={hitRateHistory} />
            </div>

            <div className="panel">
                <h2>⚖️ Weight Evolution</h2>
                <WeightEvolution data={weightHistory} />
            </div>

            <div className="panel">
                <h2>💰 Cost & Eviction</h2>
                <CostEvictionPanel evictions={evictions} />
            </div>

            <div className="panel">
                <h2>📈 Score Distribution</h2>
                <ScoreDistribution />
            </div>
        </div>
    );
}

export default App;
