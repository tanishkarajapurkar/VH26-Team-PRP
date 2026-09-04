import React from 'react';
import { Line } from 'react-chartjs-2';

function WeightEvolution({ data }) {
    const chartData = {
        labels: data.map((_, i) => i),
        datasets: [
            {
                label: 'w1 (Recency)',
                data: data.map(d => d.w1),
                borderColor: '#f87171',
                backgroundColor: 'rgba(248, 113, 113, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
            },
            {
                label: 'w2 (Frequency)',
                data: data.map(d => d.w2),
                borderColor: '#fbbf24',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
            },
            {
                label: 'w3 (Cost Efficiency)',
                data: data.map(d => d.w3),
                borderColor: '#34d399',
                backgroundColor: 'rgba(52, 211, 153, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
            },
            {
                label: 'w4 (Freshness)',
                data: data.map(d => d.w4),
                borderColor: '#60a5fa',
                backgroundColor: 'rgba(96, 165, 250, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { display: false },
            y: {
                min: 0,
                max: 1,
                ticks: { color: '#64748b' },
                grid: { color: '#334155' },
            },
        },
        plugins: {
            legend: {
                labels: { color: '#94a3b8', boxWidth: 12, padding: 8, font: { size: 10 } },
            },
        },
        animation: { duration: 0 },
    };

    return <Line data={chartData} options={options} />;
}

export default WeightEvolution;
