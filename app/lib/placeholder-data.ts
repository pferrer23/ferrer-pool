const users = [
  {
    id: 1,
    name: 'Pablo Ferrer',
  },
  {
    id: 2,
    name: 'Miguel Rico',
  },
  {
    id: 3,
    name: 'Daniel Serrano',
  },
];

const teams = [
  {
    id: 1,
    name: 'Red Bull Racing',
    colour: '3671C6',
    car_image:
      'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/red-bull-racing.png',
  },
  {
    id: 2,
    name: 'McLaren',
    colour: 'FF8000',
    car_image:
      'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/mclaren.png',
  },
  {
    id: 3,
    name: 'Kick Sauber',
    colour: '52E252',
    car_image:
      'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/kick-sauber.png',
  },
  {
    id: 4,
    name: 'Racing Bulls',
    colour: '6692FF',
    car_image:
      'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/racing-bulls.png',
  },
  {
    id: 5,
    name: 'Alpine',
    colour: '0093CC',
    car_image:
      'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/alpine.png',
  },
  {
    id: 6,
    name: 'Mercedes',
    colour: '27F4D2',
    car_image:
      'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/mercedes.png',
  },
  {
    id: 7,
    name: 'Aston Martin',
    colour: '229971',
    car_image:
      'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/aston-martin.png',
  },
  {
    id: 8,
    name: 'Ferrari',
    colour: 'E80020',
    car_image:
      'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/ferrari.png',
  },
  {
    id: 9,
    name: 'Williams',
    colour: '64C4FF',
    car_image:
      'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/williams.png',
  },
  {
    id: 10,
    name: 'Haas F1 Team',
    colour: 'B6BABD',
    car_image:
      'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/haas.png',
  },
];

const drivers = [
  {
    id: 1,
    broadcast_name: 'M VERSTAPPEN',
    country_code: 'NED',
    first_name: 'Max',
    full_name: 'Max VERSTAPPEN',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png',
    last_name: 'Verstappen',
    driver_number: 1,
    team_id: 1,
    name_acronym: 'VER',
  },
  {
    id: 2,
    broadcast_name: 'L NORRIS',
    country_code: 'GBR',
    first_name: 'Lando',
    full_name: 'Lando NORRIS',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/1col/image.png',
    last_name: 'Norris',
    driver_number: 4,
    team_id: 2,
    name_acronym: 'NOR',
  },
  {
    id: 3,
    broadcast_name: 'G BORTOLETO',
    country_code: null,
    first_name: 'Gabriel',
    full_name: 'Gabriel BORTOLETO',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png.transform/1col/image.png',
    last_name: 'Bortoleto',
    driver_number: 5,
    team_id: 3,
    name_acronym: 'BOR',
  },
  {
    id: 4,
    broadcast_name: 'I HADJAR',
    country_code: null,
    first_name: 'Isack',
    full_name: 'Isack HADJAR',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png.transform/1col/image.png',
    last_name: 'Hadjar',
    driver_number: 6,
    team_id: 4,
    name_acronym: 'HAD',
  },
  {
    id: 5,
    broadcast_name: 'J DOOHAN',
    country_code: null,
    first_name: 'Jack',
    full_name: 'Jack DOOHAN',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/J/JACDOO01_Jack_Doohan/jacdoo01.png.transform/1col/image.png',
    last_name: 'Doohan',
    driver_number: 7,
    team_id: 5,
    name_acronym: 'DOO',
  },
  {
    id: 6,
    broadcast_name: 'P GASLY',
    country_code: 'FRA',
    first_name: 'Pierre',
    full_name: 'Pierre GASLY',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/1col/image.png',
    last_name: 'Gasly',
    driver_number: 10,
    team_id: 5,
    name_acronym: 'GAS',
  },
  {
    id: 7,
    broadcast_name: 'A ANTONELLI',
    country_code: null,
    first_name: 'Andrea Kimi',
    full_name: 'Andrea Kimi ANTONELLI',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ANDANT01_Andrea%20Kimi_Antonelli/andant01.png.transform/1col/image.png',
    last_name: 'Antonelli',
    driver_number: 12,
    team_id: 6,
    name_acronym: 'ANT',
  },
  {
    id: 8,
    broadcast_name: 'F ALONSO',
    country_code: 'ESP',
    first_name: 'Fernando',
    full_name: 'Fernando ALONSO',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/1col/image.png',
    last_name: 'Alonso',
    driver_number: 14,
    team_id: 7,
    name_acronym: 'ALO',
  },
  {
    id: 9,
    broadcast_name: 'C LECLERC',
    country_code: 'MON',
    first_name: 'Charles',
    full_name: 'Charles LECLERC',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/1col/image.png',
    last_name: 'Leclerc',
    driver_number: 16,
    team_id: 8,
    name_acronym: 'LEC',
  },
  {
    id: 10,
    broadcast_name: 'L STROLL',
    country_code: 'CAN',
    first_name: 'Lance',
    full_name: 'Lance STROLL',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/1col/image.png',
    last_name: 'Stroll',
    driver_number: 18,
    team_id: 7,
    name_acronym: 'STR',
  },
  {
    id: 11,
    broadcast_name: 'Y TSUNODA',
    country_code: 'JPN',
    first_name: 'Yuki',
    full_name: 'Yuki TSUNODA',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png.transform/1col/image.png',
    last_name: 'Tsunoda',
    driver_number: 22,
    team_id: 4,
    name_acronym: 'TSU',
  },
  {
    id: 12,
    broadcast_name: 'A ALBON',
    country_code: 'THA',
    first_name: 'Alexander',
    full_name: 'Alexander ALBON',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/1col/image.png',
    last_name: 'Albon',
    driver_number: 23,
    team_id: 9,
    name_acronym: 'ALB',
  },
  {
    id: 13,
    broadcast_name: 'N HULKENBERG',
    country_code: 'GER',
    first_name: 'Nico',
    full_name: 'Nico HULKENBERG',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/1col/image.png',
    last_name: 'Hulkenberg',
    driver_number: 27,
    team_id: 3,
    name_acronym: 'HUL',
  },
  {
    id: 14,
    broadcast_name: 'L LAWSON',
    country_code: null,
    first_name: 'Liam',
    full_name: 'Liam LAWSON',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png.transform/1col/image.png',
    last_name: 'Lawson',
    driver_number: 30,
    team_id: 1,
    name_acronym: 'LAW',
  },
  {
    id: 15,
    broadcast_name: 'E OCON',
    country_code: 'FRA',
    first_name: 'Esteban',
    full_name: 'Esteban OCON',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/1col/image.png',
    last_name: 'Ocon',
    driver_number: 31,
    team_id: 10,
    name_acronym: 'OCO',
  },
  {
    id: 16,
    broadcast_name: 'L HAMILTON',
    country_code: 'GBR',
    first_name: 'Lewis',
    full_name: 'Lewis HAMILTON',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/1col/image.png',
    last_name: 'Hamilton',
    driver_number: 44,
    team_id: 8,
    name_acronym: 'HAM',
  },
  {
    id: 17,
    broadcast_name: 'C SAINZ',
    country_code: 'ESP',
    first_name: 'Carlos',
    full_name: 'Carlos SAINZ',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/1col/image.png',
    last_name: 'Sainz',
    driver_number: 55,
    team_id: 9,
    name_acronym: 'SAI',
  },
  {
    id: 18,
    broadcast_name: 'G RUSSELL',
    country_code: 'GBR',
    first_name: 'George',
    full_name: 'George RUSSELL',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/1col/image.png',
    last_name: 'Russell',
    driver_number: 63,
    team_id: 6,
    name_acronym: 'RUS',
  },
  {
    id: 19,
    broadcast_name: 'O PIASTRI',
    country_code: 'AUS',
    first_name: 'Oscar',
    full_name: 'Oscar PIASTRI',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/1col/image.png',
    last_name: 'Piastri',
    driver_number: 81,
    team_id: 2,
    name_acronym: 'PIA',
  },
  {
    id: 20,
    broadcast_name: 'O BEARMAN',
    country_code: null,
    first_name: 'Oliver',
    full_name: 'Oliver BEARMAN',
    headshot_url:
      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png.transform/1col/image.png',
    last_name: 'Bearman',
    driver_number: 87,
    team_id: 10,
    name_acronym: 'BEA',
  },
];

const prediction_groups = [
  {
    id: 1,
    name: 'Temporada 2025',
    group_type: 'SEASON', // SEASON, RACE,
    prediction_deadline: '2025-03-18',
  },
  {
    id: 2,
    name: 'Podium',
    group_type: 'RACE',
    prediction_deadline: null,
  },
  {
    id: 3,
    name: 'Qualy',
    group_type: 'RACE',
    prediction_deadline: null,
  },
  {
    id: 4,
    name: 'Posiciones Ganadas',
    group_type: 'RACE',
    prediction_deadline: null,
  },
  {
    id: 5,
    name: 'Sprint',
    group_type: 'RACE',
    prediction_deadline: null,
  },
];

const prediction_group_items = [
  {
    id: 1,
    prediction_group_id: 1,
    name: 'Campeon',
    selection_type: 'DRIVER_UNIQUE', // DRIVER_UNIQUE, TEAM_UNIQUE, DRIVER_MULTIPLE, TEAM_MULTIPLE, POSITION
  },
  {
    id: 2,
    prediction_group_id: 1,
    name: 'Sub campeon',
    selection_type: 'DRIVER_UNIQUE',
  },
  {
    id: 3,
    prediction_group_id: 1,
    name: 'Constructores',
    selection_type: 'TEAM_UNIQUE',
  },
  {
    id: 4,
    prediction_group_id: 1,
    name: 'Sub constructores',
    selection_type: 'TEAM_UNIQUE',
  },
  {
    id: 5,
    prediction_group_id: 1,
    name: 'Ultimo Piloto',
    selection_type: 'DRIVER_UNIQUE',
  },
  {
    id: 6,
    prediction_group_id: 1,
    name: 'Ultimo Constructores',
    selection_type: 'TEAM_UNIQUE',
  },
  {
    id: 7,
    prediction_group_id: 1,
    name: 'Posicion Final Sainz',
    selection_type: 'POSITION',
  },
  {
    id: 8,
    prediction_group_id: 1,
    name: 'Primer echado del año',
    selection_type: 'DRIVER_UNIQUE',
  },
  {
    id: 9,
    prediction_group_id: 2,
    name: 'P1',
    selection_type: 'DRIVER_UNIQUE',
  },
  {
    id: 10,
    prediction_group_id: 2,
    name: 'P2',
    selection_type: 'DRIVER_UNIQUE',
  },
  {
    id: 11,
    prediction_group_id: 2,
    name: 'P3',
    selection_type: 'DRIVER_UNIQUE',
  },
  {
    id: 12,
    prediction_group_id: 3,
    name: 'POLE',
    selection_type: 'DRIVER_UNIQUE',
  },
  {
    id: 13,
    prediction_group_id: 4,
    name: 'POS GANADAS',
    selection_type: 'DRIVER_UNIQUE',
  },
  {
    id: 14,
    prediction_group_id: 5,
    name: 'P1 SPRINT',
    selection_type: 'DRIVER_UNIQUE',
  },
];

const points_definitions = [
  {
    id: 1,
    prediction_group_id: 1,
    type: 'EXACT', // EXACT, ANY_IN_ITEMS, RESULTS_INCLUDES
    points: 5,
  },
  {
    id: 2,
    prediction_group_id: 2,
    type: 'ANY_IN_ITEMS',
    points: 1,
  },
  {
    id: 3,
    prediction_group_id: 2,
    type: 'EXACT',
    points: 1,
  },
  {
    id: 4,
    prediction_group_id: 3,
    type: 'EXACT',
    points: 1,
  },
  {
    id: 5,
    prediction_group_id: 4,
    type: 'RESULTS_INCLUDES',
    points: 1,
  },
  {
    id: 6,
    prediction_group_id: 5,
    type: 'EXACT',
    points: 1,
  },
];

const points_exceptions = [
  {
    id: 1,
    points_definition_id: 1,
    driver_id: 1,
    team_id: null,
    points: 0.5,
  },
];

const events = [
  {
    id: 1,
    name: 'GP de Australia',
    track: 'Melbourne',
    date: '2025-03-16',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Australia%20carbon.png',
  },
  {
    id: 2,
    name: 'GP de China',
    track: 'Shanghái',
    date: '2025-03-23',
    has_sprint_race: true,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/China%20carbon.png',
  },
  {
    id: 3,
    name: 'GP de Japón',
    track: 'Suzuka',
    date: '2025-04-06',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Japan%20carbon.png',
  },
  {
    id: 4,
    name: 'GP de Baréin',
    track: 'Sakhir',
    date: '2025-04-13',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Bahrain%20carbon.png',
  },
  {
    id: 5,
    name: 'GP de Arabia Saudita',
    track: 'Yeda',
    date: '2025-04-20',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Saudi%20Arabia%20carbon.png',
  },
  {
    id: 6,
    name: 'GP de Miami',
    track: 'Miami',
    date: '2025-05-04',
    has_sprint_race: true,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Miami%20carbon.png',
  },
  {
    id: 7,
    name: 'GP de Emilia-Romaña',
    track: 'Ímola',
    date: '2025-05-18',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Emilia-Romagna%20carbon.png',
  },
  {
    id: 8,
    name: 'GP de Mónaco',
    track: 'Mónaco',
    date: '2025-05-25',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Monaco%20carbon.png',
  },
  {
    id: 9,
    name: 'GP de España',
    track: 'Barcelona',
    date: '2025-06-01',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Spain%20carbon.png',
  },
  {
    id: 10,
    name: 'GP de Canadá',
    track: 'Montreal',
    date: '2025-06-15',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Canada%20carbon.png',
  },
  {
    id: 11,
    name: 'GP de Austria',
    track: 'Spielberg',
    date: '2025-06-29',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Austria%20carbon.png',
  },
  {
    id: 12,
    name: 'GP de Reino Unido',
    track: 'Silverstone',
    date: '2025-07-06',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Great%20Britain%20carbon.png',
  },
  {
    id: 13,
    name: 'GP de Bélgica',
    track: 'Spa-Francorchamps',
    date: '2025-07-27',
    has_sprint_race: true,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Belgium%20carbon.png',
  },
  {
    id: 14,
    name: 'GP de Hungría',
    track: 'Budapest',
    date: '2025-08-03',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Hungary%20carbon.png',
  },
  {
    id: 15,
    name: 'GP de Países Bajos',
    track: 'Zandvoort',
    date: '2025-08-31',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Netherlands%20carbon.png',
  },
  {
    id: 16,
    name: 'GP de Italia',
    track: 'Monza',
    date: '2025-09-07',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Italy%20carbon.png',
  },
  {
    id: 17,
    name: 'GP de Azerbaiyán',
    track: 'Bakú',
    date: '2025-09-21',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Azerbaijan%20carbon.png',
  },
  {
    id: 18,
    name: 'GP de Singapur',
    track: 'Singapur',
    date: '2025-10-05',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Singapore%20carbon.png',
  },
  {
    id: 19,
    name: 'GP de Estados Unidos',
    track: 'Austin',
    date: '2025-10-19',
    has_sprint_race: true,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/United%20States%20carbon.png',
  },
  {
    id: 20,
    name: 'GP de México',
    track: 'México',
    date: '2025-10-26',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Mexico%20carbon.png',
  },
  {
    id: 21,
    name: 'GP de Brasil',
    track: 'Sao Paulo',
    date: '2025-11-09',
    has_sprint_race: true,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Brazil%20carbon.png',
  },
  {
    id: 22,
    name: 'GP de Las Vegas',
    track: 'Las Vegas',
    date: '2025-11-22',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/United%20States%20carbon.png',
  },
  {
    id: 23,
    name: 'GP de Catar',
    track: 'Lusail',
    date: '2025-11-30',
    has_sprint_race: true,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Qatar%20carbon.png',
  },
  {
    id: 24,
    name: 'GP de Abu Dabi',
    track: 'Yas Marina',
    date: '2025-12-07',
    has_sprint_race: false,
    status: 'NOT_STARTED',
    track_image:
      'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/United%20Arab%20Emirates%20carbon.png',
  },
];

const event_results = [
  {
    id: 1,
    event_id: 1,
    driver_id: 1,
    team_id: null,
    position: null,
    prediction_group_item_id: 9,
  },
  {
    id: 2,
    event_id: 1,
    driver_id: 2,
    team_id: null,
    position: null,
    prediction_group_item_id: 10,
  },
  {
    id: 3,
    event_id: 1,
    driver_id: 3,
    team_id: null,
    position: null,
    prediction_group_item_id: 11,
  },
  {
    id: 4,
    event_id: 1,
    driver_id: 4,
    team_id: null,
    position: null,
    prediction_group_item_id: 12,
  },
  {
    id: 5,
    event_id: 1,
    driver_id: 5,
    team_id: null,
    position: null,
    prediction_group_item_id: 13,
  },
  {
    id: 6,
    event_id: 1,
    driver_id: 6,
    team_id: null,
    position: null,
    prediction_group_item_id: 14,
  },
];

const season_results = [
  {
    id: 1,
    prediction_group_item_id: 1, // Campeon - DRIVER_UNIQUE
    driver_id: 1,
    team_id: null,
    position: null,
  },
  {
    id: 2,
    prediction_group_item_id: 2, // Sub campeon - DRIVER_UNIQUE
    driver_id: 2,
    team_id: null,
    position: null,
  },
  {
    id: 3,
    prediction_group_item_id: 3, // Constructores - TEAM_UNIQUE
    driver_id: null,
    team_id: 1,
    position: null,
  },
  {
    id: 4,
    prediction_group_item_id: 4, // Sub constructores - TEAM_UNIQUE
    driver_id: null,
    team_id: 2,
    position: null,
  },
  {
    id: 5,
    prediction_group_item_id: 5, // Ultimo Piloto - DRIVER_UNIQUE
    driver_id: 3,
    team_id: null,
    position: null,
  },
  {
    id: 6,
    prediction_group_item_id: 6, // Ultimo Constructores - TEAM_UNIQUE
    driver_id: null,
    team_id: 3,
    position: null,
  },
  {
    id: 7,
    prediction_group_item_id: 7, // Posicion Final Sainz - POSITION
    driver_id: null,
    team_id: null,
    position: 5,
  },
  {
    id: 8,
    prediction_group_item_id: 8, // Primer echado del año - DRIVER_UNIQUE
    driver_id: 4,
    team_id: null,
    position: null,
  },
];

const user_predictions = [
  {
    id: 1,
    user_id: 1,
    prediction_group_item_id: 1,
    event_id: null,
    driver_id: 1,
    team_id: null,
    position: null,
    finished: false,
    points: 0,
    updated_at: null,
  },
];

export {
  users,
  teams,
  drivers,
  prediction_groups,
  prediction_group_items,
  points_definitions,
  points_exceptions,
  events,
  event_results,
  season_results,
  user_predictions,
};
