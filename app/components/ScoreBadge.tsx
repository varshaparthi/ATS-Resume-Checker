import React from 'react';

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let bgColor: string;
  let textColor: string;
  let label: string;

  if (score > 70) {
    bgColor = 'bg-green-500';
    textColor = 'text-green-600';
    label = 'Strong';
  } else if (score > 49) {
    bgColor = 'bg-yellow-500';
    textColor = 'text-yellow-600';
    label = 'Good Start';
  } else {
    bgColor = 'bg-red-500';
    textColor = 'text-red-600';
    label = 'Need work';
  }

  return (
    <div className={`${bgColor} ${textColor} inline-block px-3 py-1 rounded-full`}>
      <p className='text-sm font-medium'>{label}</p>
    </div>
  );
};

export default ScoreBadge;