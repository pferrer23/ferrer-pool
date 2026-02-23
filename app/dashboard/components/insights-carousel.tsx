'use client';

import { Insight } from '@/app/lib/definitions';
import { useEffect, useRef, useState } from 'react';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function InsightsCarousel({ insights }: { insights: Insight[] }) {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  if (insights.length === 0) return null;

  return (
    <div className='flex flex-col gap-3'>
      <h2 className='text-gray-100 font-semibold text-base'>Análisis</h2>

      {/* Cards row */}
      <div
        ref={containerRef}
        className='flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1'
        style={{ scrollbarWidth: 'none' }}
      >
        {insights.map((insight, i) => (
          <div
            key={insight.id}
            onClick={() => setActive(i)}
            className='snap-center shrink-0 w-64 bg-background-900 border border-background-800 rounded-lg p-4 cursor-pointer flex flex-col gap-2 hover:border-gray-600 transition-colors'
          >
            <span className='text-gray-400 text-xs'>{formatDate(insight.created_at)}</span>
            <p className='text-gray-100 text-sm leading-relaxed line-clamp-6'>{insight.analysis}</p>
          </div>
        ))}
      </div>

      {/* Dots */}
      {insights.length > 1 && (
        <div className='flex justify-center gap-1.5'>
          {insights.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === active ? 'bg-gray-100' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
