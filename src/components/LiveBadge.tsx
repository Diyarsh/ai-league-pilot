import React from 'react';

interface LiveBadgeProps {
  className?: string;
}

export const LiveBadge: React.FC<LiveBadgeProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 border border-green-200 ${className}`}>
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-xs font-medium text-green-700">Live</span>
    </div>
  );
};
