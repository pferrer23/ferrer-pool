'use client';

import { useState, useEffect } from 'react';
import { fetchLeaderboard } from '@/app/lib/data';
import { Avatar, Spinner } from '@heroui/react';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const getPositionEmoji = (position: any) => {
    switch (parseInt(position)) {
      case 1:
        return '🏆';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return position;
    }
  };

  if (loading) {
    return <Spinner color='warning' label='Loading...' />;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
      {leaderboard.map((item) => (
        <div
          key={item.id}
          className='bg-background-900 p-6 rounded-lg border border-background-800'
        >
          <div className='flex items-center gap-4 mb-4'>
            <Avatar
              isBordered
              color='success'
              radius='full'
              src={item.profile_image_url}
            />
            <h3 className='text-xl font-semibold text-gray-100'>{item.name}</h3>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-gray-400 text-4xl'>
              {getPositionEmoji(item.position)}
            </span>
            <p className='text-4xl font-bold text-gray-50'>{item.points}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
