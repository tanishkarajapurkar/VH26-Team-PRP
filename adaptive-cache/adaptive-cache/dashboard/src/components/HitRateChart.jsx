import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

function HitRateChart({ data }) {
    const chartRef = useRef(null);

    const chartData = {
        labels: data.map((_, i) => i),
        datasets: [
            {
                label: 'Hit Rate',
                data: data.map(d => d.hit_rate * 100),
                borderColor: '#22d3ee',
                backgroundColor: 'rgba(34, 211, 238, 0.1)',
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
                max: 100,
                ticks: { color: '#64748b', callback: v => v + '%' },
                grid: { color: '#334155' },
            },
        },
        plugins: {
            legend: { display: false },
        },
        animation: { duration: 0 },
    };

    return <Line ref={chartRef} data={chartData} options={options} />;
}

export default HitRateChart;
