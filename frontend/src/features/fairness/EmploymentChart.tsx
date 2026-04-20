import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function EmploymentChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="text-slate-500 flex items-center justify-center h-full">No distribution data available.</div>;

  const chartData = {
    labels: data.map(d => String(d.employment_type).replace('_', ' ')),
    datasets: [
      {
        label: 'Approval Rate (%)',
        data: data.map(d => d.approval_rate * 100),
        backgroundColor: 'rgba(167, 139, 250, 0.3)', // purple-400
        borderColor: 'rgba(167, 139, 250, 1)',
        borderWidth: 1,
        yAxisID: 'y',
        borderRadius: 4,
      },
      {
        label: 'Avg Credit Score',
        data: data.map(d => d.avg_credit_score),
        backgroundColor: 'rgba(251, 191, 36, 0.3)', // amber-400
        borderColor: 'rgba(251, 191, 36, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
        borderRadius: 4,
      }
    ],
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
        type: 'linear' as const, display: true, position: 'left' as const,
        ticks: { color: 'rgba(167, 139, 250, 0.8)' },
        grid: { color: '#1e293b' },
      },
      y1: {
        type: 'linear' as const, display: true, position: 'right' as const,
        ticks: { color: 'rgba(251, 191, 36, 0.8)' },
        grid: { drawOnChartArea: false },
      }
    }
  };

  return (
    <div className="h-72 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}
