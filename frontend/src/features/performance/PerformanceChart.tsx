import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function PerformanceChart({ metrics }: { metrics: any[] }) {
  if (!metrics || metrics.length === 0) return null;

  const chartData = {
    labels: metrics.map(m => m.Model),
    datasets: [
      {
        label: 'Accuracy (%)',
        data: metrics.map(m => parseFloat((m.Accuracy * 100).toFixed(2))),
        backgroundColor: 'rgba(56, 189, 248, 0.4)', // sky-400
        borderColor: 'rgba(56, 189, 248, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'F1 Score (%)',
        data: metrics.map(m => parseFloat((m.F1_Score * 100).toFixed(2))),
        backgroundColor: 'rgba(52, 211, 153, 0.4)', // emerald-400
        borderColor: 'rgba(52, 211, 153, 1)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'Inter, sans-serif' } } },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#1e293b' },
        // Starting above zero anchors the charts strictly on precision discrepancies making small % differences visible
        min: 60, 
      }
    }
  };

  return <div className="h-80 w-full"><Bar data={chartData} options={options} /></div>;
}
