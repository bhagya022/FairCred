import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function IncomeChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="flex h-full items-center justify-center text-stone-500">No distribution data available.</div>;

  const chartData = {
    labels: data.map(d => `Tier ${d.income_tier}`),
    datasets: [
      {
        label: 'Approval Rate (%)',
        data: data.map(d => d.approval_rate * 100),
        backgroundColor: 'rgba(16, 185, 129, 0.28)',
        borderColor: 'rgba(16, 185, 129, 0.95)',
        borderWidth: 1,
        yAxisID: 'y',
        borderRadius: 4,
      },
      {
        label: 'Avg Credit Score',
        data: data.map(d => d.avg_credit_score),
        backgroundColor: 'rgba(217, 119, 6, 0.28)',
        borderColor: 'rgba(217, 119, 6, 0.95)',
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
      legend: { labels: { color: '#57534e', font: { family: 'Segoe UI, sans-serif' } } },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      x: { ticks: { color: '#57534e' }, grid: { color: 'rgba(120, 113, 108, 0.18)' } },
      y: {
        type: 'linear' as const, display: true, position: 'left' as const,
        ticks: { color: 'rgba(16, 185, 129, 0.95)' },
        grid: { color: 'rgba(120, 113, 108, 0.18)', drawBorder: false },
        title: { display: true, text: 'Approval Rate', color: '#57534e' }
      },
      y1: {
        type: 'linear' as const, display: true, position: 'right' as const,
        ticks: { color: 'rgba(217, 119, 6, 0.95)' },
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Credit Score', color: '#57534e' }
      }
    }
  };

  return (
    <div className="h-72 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}
