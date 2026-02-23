import Image from 'next/image';
import { Team, Driver } from '@/app/lib/definitions';

type Props = {
  teams: Team[];
  drivers: Driver[];
};

export default function GridSection({ teams, drivers }: Props) {
  const driversByTeam = (teamId: number) =>
    drivers.filter((d) => d.team_id === teamId);

  return (
    <section>
      <h2 className='text-2xl font-bold text-white mb-6'>Equipos y Pilotos</h2>
      <div className='flex flex-col gap-5'>
        {teams.map((team) => {
          const teamDrivers = driversByTeam(team.id);
          return (
            <div
              key={team.id}
              className='bg-background-900 border border-background-800 rounded-xl overflow-hidden'
              style={{ borderLeft: `4px solid #${team.colour}` }}
            >
              <div className='flex flex-col md:flex-row items-start md:items-center gap-4 p-4'>
                {/* Car image */}
                <div className='relative w-full md:w-48 h-24 flex-shrink-0'>
                  <Image
                    src={team.car_image}
                    alt={`${team.name} car`}
                    fill
                    className='object-contain'
                    sizes='(max-width: 768px) 100vw, 192px'
                  />
                </div>

                {/* Team name + drivers */}
                <div className='flex-1'>
                  <p
                    className='text-lg font-bold mb-3'
                    style={{ color: `#${team.colour}` }}
                  >
                    {team.name}
                  </p>
                  <div className='grid grid-cols-2 gap-3'>
                    {teamDrivers.map((driver) => (
                      <div
                        key={driver.id}
                        className='flex items-center gap-3 bg-background-800 rounded-lg p-2'
                      >
                        <div className='relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border-2'
                          style={{ borderColor: `#${team.colour}` }}
                        >
                          <Image
                            src={driver.headshot_url}
                            alt={driver.full_name}
                            fill
                            className='object-cover object-top'
                            sizes='48px'
                          />
                        </div>
                        <div className='min-w-0'>
                          <div className='flex items-center gap-2'>
                            <span
                              className='text-xs font-bold px-1.5 py-0.5 rounded'
                              style={{
                                backgroundColor: `#${team.colour}22`,
                                color: `#${team.colour}`,
                                border: `1px solid #${team.colour}55`,
                              }}
                            >
                              {driver.driver_number}
                            </span>
                            <span className='text-xs text-gray-400 font-mono'>
                              {driver.name_acronym}
                            </span>
                          </div>
                          <p className='text-sm font-semibold text-white truncate'>
                            {driver.first_name}{' '}
                            <span className='uppercase'>{driver.last_name}</span>
                          </p>
                          {driver.country_code && (
                            <p className='text-xs text-gray-500'>
                              {driver.country_code}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
