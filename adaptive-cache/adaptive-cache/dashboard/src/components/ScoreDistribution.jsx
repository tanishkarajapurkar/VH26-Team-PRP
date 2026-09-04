import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

function ScoreDistribution() {
    const [buckets, setBuckets] = useState(Array(16).fill(0));

    useEffect(() => {
        // Simulate bucket occupancy update
        const interval = setInterval(() => {
            setBuckets(prev => prev.map(v => Math.max(0, v + Math.floor(Math.random() * 5) - 2)));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const chartData = {
        labels: buckets.map((_, i) => i),
        datasets: [{
            label: 'Entries',
            data: buckets,
            backgroundColor: buckets.map((_, i) => {
                const hue = (i / 16) * 120 + 120; // green to cyan
                return `hsla(${hue}, 70%, 50%, 0.8)`;
            }),
            borderColor: buckets.map((_, i) => {
                const hue = (i / 16) * 120 + 120;
                return `hsl(${hue}, 70%, 50%)`;
            }),
            borderWidth: 1,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: { display: true, text: 'Score Bucket', color: '#64748b' },
                ticks: { color: '#64748b' },
                grid: { color: '#334155' },
            },
            y: {
                title: { display: true, text: 'Entries', color: '#64748b' },
                ticks: { color: '#64748b' },
                grid: { color: '#334155' },
            },
        },
        plugins: {
            legend: { display: false },
        },
        animation: { duration: 0 },
    };

    return <Bar data={chartData} options={options} />;
}

export default ScoreDistribution;
