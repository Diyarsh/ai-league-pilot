import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  isPositive: boolean;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({ data, isPositive, className = "" }) => {
  if (!data || data.length < 2) {
    return <div className={`w-12 h-4 bg-gray-200 rounded ${className}`} />;
  }

  // Normalize data for sparkline
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  
  const normalizedData = data.map((value, index) => ({
    value: range > 0 ? ((value - min) / range) * 100 : 50,
    index
  }));

  return (
    <div className={`w-12 h-4 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={normalizedData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={isPositive ? "#10b981" : "#ef4444"}
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
