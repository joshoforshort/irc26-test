'use client';

import { useEffect, useState } from 'react';

interface WeekData {
  weekStart: string;
  weekEnd: string;
  count: number;
}

export default function PledgesByDayChart() {
  const [data, setData] = useState<WeekData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats/pledges-by-day')
      .then((res) => res.json())
      .then((result) => {
        setData(result.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching pledges by week:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center text-black" style={{ fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' }}>
        Loading chart...
      </div>
    );
  }

  if (data.length === 0) {
    return null;
  }

  const maxCount = Math.max(...data.map((d) => d.count));

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-lovely text-center mb-4 text-black">
        PLEDGES RECEIVED BY WEEK
      </h3>
      <div className="bg-white/80 rounded-2xl px-6 py-5 shadow-sm max-w-4xl mx-auto">
        <div className="flex items-end justify-center gap-3 sm:gap-4 h-56 overflow-x-auto pb-2">
          {data.map((week) => {
            const heightPercent = maxCount > 0 ? (week.count / maxCount) * 100 : 0;
            return (
              <div key={week.weekStart} className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
                <div
                  className="text-sm font-bold text-black mb-1"
                  style={{ fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' }}
                >
                  {week.count}
                </div>
                <div
                  className="w-12 sm:w-16 rounded-t transition-all duration-300"
                  style={{
                    height: `${Math.max(heightPercent, 8)}%`,
                    backgroundColor: '#69bc45',
                    minHeight: '20px',
                  }}
                />
                <div
                  className="text-[9px] sm:text-[11px] text-black mt-2 text-center leading-tight"
                  style={{ fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' }}
                >
                  {formatDateLabel(week.weekStart)}
                  <br />
                  <span className="text-gray-500">to</span>
                  <br />
                  {formatDateLabel(week.weekEnd)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
