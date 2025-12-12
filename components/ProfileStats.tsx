'use client';

import { useEffect, useState } from 'react';
import { RAIN_START_DATE } from '@/config/irc26';

interface Stats {
  totalCachesPledged: number;
  totalCachesConfirmed: number;
}

function CountdownDisplay({ targetDate }: { targetDate: Date }) {
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
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return <span>0d 0h 0m 0s</span>;
  }

  return (
    <span className="font-arial-rounded whitespace-nowrap">
      {timeLeft.days}d <span className="whitespace-nowrap">{timeLeft.hours}h</span>{' '}
      <span className="whitespace-nowrap">{timeLeft.minutes}m</span>{' '}
      <span className="whitespace-nowrap">{timeLeft.seconds}s</span>
    </span>
  );
}

export default function ProfileStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        // Map API response to expected format
        setStats({
          totalCachesPledged: data.totalPledged || 0,
          totalCachesConfirmed: data.totalSubmissions || 0,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching stats:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="our-stats" className="bg-white mt-14 sm:mt-16 pt-8 sm:pt-10 pb-8 sm:pb-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-lovely text-2xl sm:text-3xl text-center mb-6 sm:mb-8 text-black">
          OUR STATS
        </h2>

        {loading ? (
          <div className="font-lovely text-center text-black">Loading stats...</div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6 text-center">
            {/* Caches Pledged */}
            <div className="flex flex-col">
              <div className="font-arial-rounded text-3xl sm:text-4xl font-semibold text-black mb-2 min-h-[4rem] sm:min-h-[5rem] flex items-end justify-center">
                {stats.totalCachesPledged}
              </div>
              <div className="font-lovely text-sm sm:text-base font-semibold tracking-wide text-black uppercase">
                CACHES PLEDGED
              </div>
            </div>

            {/* Caches Submitted to IRC Cloud */}
            <div className="flex flex-col">
              <div className="font-arial-rounded text-3xl sm:text-4xl font-semibold text-black mb-2 min-h-[4rem] sm:min-h-[5rem] flex items-end justify-center">
                {stats.totalCachesConfirmed}
              </div>
              <div className="font-lovely text-sm sm:text-base font-semibold tracking-wide text-black uppercase">
                CACHES SUBMITTED TO IRC CLOUD
              </div>
            </div>

            {/* Countdown to Rain Start */}
            <div className="flex flex-col">
              <div className="font-arial-rounded text-3xl sm:text-4xl font-semibold text-black mb-2 min-h-[4rem] sm:min-h-[5rem] flex items-end justify-center">
                <CountdownDisplay targetDate={RAIN_START_DATE} />
              </div>
              <div className="font-lovely text-sm sm:text-base font-semibold tracking-wide text-black uppercase">
                UNTIL IT RAINS CACHES
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}






