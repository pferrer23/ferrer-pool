'use client';

import { Insight } from '@/app/lib/definitions';
import { useState } from 'react';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function InsightModal({ insight, onClose }: { insight: Insight; onClose: () => void }) {
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60'
      onClick={onClose}
    >
      <div
        className='bg-background-900 border border-background-800 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto flex flex-col gap-3'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between gap-4'>
          <span className='text-gray-400 text-xs'>{formatDate(insight.created_at)}</span>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-100 transition-colors text-lg leading-none'
          >
            ✕
          </button>
        </div>
        <p className='text-gray-100 text-sm leading-relaxed'>{insight.analysis}</p>
      </div>
    </div>
  );
}

export default function InsightsList({ insights }: { insights: Insight[] }) {
  const [selected, setSelected] = useState<Insight | null>(null);

  if (insights.length === 0) return null;

  return (
    <>
      <div className='flex flex-col gap-3'>
        <h2 className='text-gray-100 font-semibold text-base'>Análisis</h2>
        {insights.map((insight) => (
          <div
            key={insight.id}
            onClick={() => setSelected(insight)}
            className='bg-background-900 border border-background-800 rounded-lg p-4 cursor-pointer flex flex-col gap-2 hover:border-gray-600 transition-colors'
          >
            <span className='text-gray-400 text-xs'>{formatDate(insight.created_at)}</span>
            <p className='text-gray-100 text-sm leading-relaxed line-clamp-4'>{insight.analysis}</p>
            <span className='text-gray-500 text-xs'>Leer más →</span>
          </div>
        ))}
      </div>

      {selected && (
        <InsightModal insight={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
