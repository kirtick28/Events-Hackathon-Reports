import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarChart = ({ data, height = 300 }) => {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: 'Users',
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => item.color || '#4f46e5'),
        borderRadius: 6,
        borderSkipped: false
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
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `${context.parsed.y} users`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748b'
        }
      },
      y: {
        grid: {
          color: '#e2e8f0',
          drawBorder: false
        },
        ticks: {
          color: '#64748b',
          callback: (value) => {
            if (value >= 1000) return `${value / 1000}k`;
            return value;
          }
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
      style={{ height }}
    >
      <Bar data={chartData} options={options} />
    </motion.div>
  );
};

export default BarChart;
