import React from 'react';
import { Bar } from 'react-chartjs-2';

function CostEvictionPanel({ evictions }) {
    // Count evictions by dominant factor
    const factorCounts = {};
    evictions.forEach(e => {
        const factor = e.dominant || 'unknown';
        factorCounts[factor] = (factorCounts[factor] || 0) + 1;
    });

    const factors = Object.keys(factorCounts);
    const counts = Object.values(factorCounts);

    const chartData = {
        labels: factors.length > 0 ? factors : ['No data'],
        datasets: [{
            label: 'Evictions',
            data: counts.length > 0 ? counts : [0],
            backgroundColor: [
                'rgba(248, 113, 113, 0.8)',
                'rgba(251, 191, 36, 0.8)',
                'rgba(52, 211, 153, 0.8)',
                'rgba(96, 165, 250, 0.8)',
            ],
            borderColor: [
                '#f87171',
                '#fbbf24',
                '#34d399',
                '#60a5fa',
            ],
            borderWidth: 1,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
            x: {
                ticks: { color: '#64748b' },
                grid: { color: '#334155' },
            },
            y: {
                ticks: { color: '#94a3b8' },
                grid: { display: false },
            },
        },
        plugins: {
            legend: { display: false },
        },
        animation: { duration: 0 },
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 12, color: '#94a3b8', fontSize: '0.8rem' }}>
                Total Evictions: {evictions.length}
            </div>
            <div style={{ flex: 1 }}>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
}

export default CostEvictionPanel;
