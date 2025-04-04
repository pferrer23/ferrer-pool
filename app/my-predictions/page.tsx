import SeasonPredictions from '@/app/ui/my-predictions/season-predictions';
import EventPredictions from '@/app/ui/my-predictions/event-predictions';

export default function MyPredictionsPage() {
  return (
    <main className='min-h-screen p-6'>
      <h1 className='text-3xl font-bold mb-8'>Mis Predicciones</h1>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <section>
          <h2 className='text-2xl font-bold mb-4'>
            Predicciones de la Temporada
          </h2>
          <div className=''>
            <SeasonPredictions />
          </div>
        </section>

        <section>
          <h2 className='text-2xl font-bold mb-4'>Predicciones de Eventos</h2>
          <div className=''>
            <EventPredictions />
          </div>
        </section>
      </div>
    </main>
  );
}
