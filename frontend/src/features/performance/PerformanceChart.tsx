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
        backgroundColor: 'rgba(217, 119, 6, 0.35)',
        borderColor: 'rgba(217, 119, 6, 0.95)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'F1 Score (%)',
        data: metrics.map(m => parseFloat((m.F1_Score * 100).toFixed(2))),
        backgroundColor: 'rgba(16, 185, 129, 0.35)',
        borderColor: 'rgba(16, 185, 129, 0.95)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#57534e', font: { family: 'Segoe UI, sans-serif' } } },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      x: { ticks: { color: '#57534e' }, grid: { color: 'rgba(120, 113, 108, 0.18)' } },
      y: {
        ticks: { color: '#57534e' },
        grid: { color: 'rgba(120, 113, 108, 0.18)' },
        // Starting above zero anchors the charts strictly on precision discrepancies making small % differences visible
        min: 60, 
      }
    }
  };

  return <div className="h-80 w-full"><Bar data={chartData} options={options} /></div>;
}
