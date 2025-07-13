import React from 'react';
import './StatsCard.css';
interface StatsCardProps {
  count: number;
  label: string;
  color: string;
}

const StatsCard = ({ count, label, color }: StatsCardProps) => {
  return (
    
    <div className="stat-card">
      <div className={`${color} bold`}>{count}</div>
      <div className="stat-label">{label}</div>
    </div>
   
  );
};

export default StatsCard;