import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialSeconds?: number;
  onExpire?: () => void;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds = 9677, // ~2 hours 41 min 17 sec
  onExpire,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onExpire]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className={`inline-flex items-center gap-1 font-mono font-bold tracking-wider ${className}`}>
      <span className="bg-slate-900 px-2 py-1 rounded border border-white/10 text-rose-400">
        {pad(hours)}
      </span>
      <span className="text-rose-400">:</span>
      <span className="bg-slate-900 px-2 py-1 rounded border border-white/10 text-rose-400">
        {pad(minutes)}
      </span>
      <span className="text-rose-400">:</span>
      <span className="bg-slate-900 px-2 py-1 rounded border border-white/10 text-rose-400">
        {pad(seconds)}
      </span>
    </div>
  );
};
