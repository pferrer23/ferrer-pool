import { fetchLeaderboard } from '@/app/lib/data';
import { Avatar } from '@heroui/react';

export default async function Leaderboard() {
  const leaderboard = await fetchLeaderboard();

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
          <p className='text-4xl font-bold text-gray-50'>{item.points}</p>
          <div className='flex items-center mt-2'>
            <span className='text-gray-400 text-4xl'>
              {getPositionEmoji(item.position)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
