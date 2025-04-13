import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';

const AnimatedLineChart = ({ data }) => {
  return (
    <div className="h-80 bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-primary/10">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE69C" />
              <stop offset="100%" stopColor="#FFC107" />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="name"
            tick={{ fill: '#4B5563' }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis tick={{ fill: '#4B5563' }} axisLine={{ stroke: '#E5E7EB' }} />
          <Tooltip
            contentStyle={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              border: '1px solid #FFE69C',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            dot={{ fill: '#FFC107', strokeWidth: 2 }}
            animationBegin={100}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnimatedLineChart;
