import React, { useEffect, useState } from 'react';

interface Props {
  seconds: number;
  onComplete: () => void;
  label?: string;
  isActive: boolean;
}

export const CountdownTimer: React.FC<Props> = ({ seconds, onComplete, label = "Time Remaining", isActive }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft === 0 && isActive) onComplete();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  const isUrgent = timeLeft < 10;

  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors duration-300 ${isUrgent ? 'bg-red-50 border-red-500 animate-pulse' : 'bg-white border-gray-200'}`}>
      <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">{label}</span>
      <div className={`text-4xl font-mono font-bold ${isUrgent ? 'text-red-600' : 'text-dele-dark'}`}>
        {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </div>
    </div>
  );
};