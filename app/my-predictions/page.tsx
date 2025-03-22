import SeasonPredictions from '@/app/ui/my-predictions/season-predictions';

export default function MyPredictionsPage() {
  return (
    <main className='min-h-screen p-6'>
      <h1 className='text-3xl font-bold mb-8'>My Predictions</h1>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <section>
          <h2 className='text-2xl font-bold mb-4'>Season Predictions</h2>
          <div className='bg-background-900 rounded-lg p-6'>
            <SeasonPredictions />
          </div>
        </section>

        <section>
          <h2 className='text-2xl font-bold mb-4'>Event Predictions</h2>
          <div className='bg-background-900 rounded-lg p-6'>
            {/* Event predictions content will go here */}
          </div>
        </section>
      </div>
    </main>
  );
}
