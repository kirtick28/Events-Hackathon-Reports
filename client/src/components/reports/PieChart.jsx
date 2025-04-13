import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({ data, height = 250 }) => {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => item.color || '#4f46e5'),
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full flex justify-center"
      style={{ height }}
    >
      <Pie data={chartData} options={options} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {data.reduce((sum, item) => sum + item.value, 0)}
          </p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PieChart;