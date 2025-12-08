'use client';

import { useEffect, useState } from 'react';
import { RAIN_START_DATE, SUBMISSION_DEADLINE } from '@/config/irc26';

interface Stats {
  totalPledges: number;
  totalCachesPledged: number;
  totalCachesConfirmed: number;
  totalPledgers: number;
  totalStatesInvolved: number;
}

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return <span className="text-gray-500">Event has started/ended</span>;
  }

  return (
    <span className="font-mono">
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </span>
  );
}

function SubmissionDeadlineCountdown({ targetDate }: { targetDate: Date }) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const calculateDaysLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        // Calculate days: use Math.ceil to round up partial days
        // e.g., 1.1 days = 2 days, 0.9 days = 1 day
        const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
        return days;
      }
      return null;
    };

    setDaysLeft(calculateDaysLeft());
    // Update every minute to keep it responsive (even though we only show days)
    const timer = setInterval(() => {
      setDaysLeft(calculateDaysLeft());
    }, 60000); // 1 minute in milliseconds

    return () => clearInterval(timer);
  }, [targetDate]);

  if (daysLeft === null) {
    return <span className="text-red-600 font-medium text-lg">Submission deadline has passed</span>;
  }

  return (
    <span className="font-bold text-3xl text-secondary-600">
      {daysLeft} {daysLeft === 1 ? 'day' : 'days'}
    </span>
  );
}

export default function StatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-6xl px-4">
        <div className="text-center text-white drop-shadow">Loading stats...</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl px-4 space-y-6">
      <h2 className="text-3xl font-bold text-center text-white drop-shadow-lg">
        IRC26 Stats
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Pledges" value={stats.totalPledges} valueClassName="text-primary-600" />
        <StatCard label="Caches Pledged" value={stats.totalCachesPledged} valueClassName="text-primary-600" />
        <StatCard label="Caches Confirmed" value={stats.totalCachesConfirmed} valueClassName="text-secondary-600" />
        <StatCard label="Total Pledgers" value={stats.totalPledgers} valueClassName="text-primary-600" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard label="States Involved" value={stats.totalStatesInvolved} valueClassName="text-primary-600" />
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl px-6 py-6 flex flex-col items-center text-center transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
          <div className="text-sm text-gray-600 mb-3 font-medium">Days Left to Submit</div>
          <SubmissionDeadlineCountdown targetDate={SUBMISSION_DEADLINE} />
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl px-6 py-6 flex flex-col items-center text-center transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
          <div className="text-sm text-gray-600 mb-3 font-medium">Countdown to Rain Start</div>
          <div className="text-2xl font-bold text-primary-600">
            <CountdownTimer targetDate={RAIN_START_DATE} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: number;
  valueClassName?: string;
}) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl px-6 py-6 flex flex-col items-center text-center transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
      <div className={`text-4xl font-bold mb-2 ${valueClassName ?? 'text-primary-600'}`}>{value}</div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </div>
  );
}

