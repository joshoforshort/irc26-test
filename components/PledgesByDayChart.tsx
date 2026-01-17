'use client';

import { useEffect, useState } from 'react';

interface DayData {
  date: string;
  count: number;
}

export default function PledgesByDayChart() {
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats/pledges-by-day')
      .then((res) => res.json())
      .then((result) => {
        setData(result.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching pledges by day:', err);
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
        PLEDGES RECEIVED BY DAY
      </h3>
      <div className="bg-white/80 rounded-2xl px-6 py-5 shadow-sm max-w-4xl mx-auto">
        <div className="flex items-end justify-center gap-1 sm:gap-2 h-48 overflow-x-auto">
          {data.map((day) => {
            const heightPercent = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
            return (
              <div key={day.date} className="flex flex-col items-center min-w-[30px] sm:min-w-[40px]">
                <div
                  className="text-xs font-bold text-black mb-1"
                  style={{ fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' }}
                >
                  {day.count}
                </div>
                <div
                  className="w-6 sm:w-8 rounded-t transition-all duration-300"
                  style={{
                    height: `${Math.max(heightPercent, 5)}%`,
                    backgroundColor: '#69bc45',
                  }}
                />
                <div
                  className="text-[10px] sm:text-xs text-black mt-1 whitespace-nowrap"
                  style={{ fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' }}
                >
                  {formatDateLabel(day.date)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
