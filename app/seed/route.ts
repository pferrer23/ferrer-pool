import postgres from 'postgres';
import {
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
} from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(
      (user) => sql`
      INSERT INTO users (id, name)
      VALUES (${user.id}, ${user.name})
      ON CONFLICT (id) DO NOTHING;
    `
    )
  );

  return insertedUsers;
}

async function seedTeams() {
  await sql`
    CREATE TABLE IF NOT EXISTS teams (
      id INT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      colour VARCHAR(6) NOT NULL,
      car_image TEXT NOT NULL
    );
  `;

  const insertedTeams = await Promise.all(
    teams.map(
      (team) => sql`
      INSERT INTO teams (id, name, colour, car_image)
      VALUES (${team.id}, ${team.name}, ${team.colour}, ${team.car_image})
      ON CONFLICT (id) DO NOTHING;
    `
    )
  );

  return insertedTeams;
}

async function seedDrivers() {
  await sql`
    CREATE TABLE IF NOT EXISTS drivers (
      id INT PRIMARY KEY,
      broadcast_name VARCHAR(255) NOT NULL,
      country_code VARCHAR(3),
      first_name VARCHAR(255) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      headshot_url TEXT NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      driver_number INT NOT NULL,
      team_id INT REFERENCES teams(id),
      name_acronym VARCHAR(3) NOT NULL
    );
  `;

  const insertedDrivers = await Promise.all(
    drivers.map(
      (driver) => sql`
      INSERT INTO drivers (
        id,
        broadcast_name,
        country_code,
        first_name,
        full_name,
        headshot_url,
        last_name,
        driver_number,
        team_id,
        name_acronym
      )
      VALUES (
        ${driver.id},
        ${driver.broadcast_name},
        ${driver.country_code},
        ${driver.first_name},
        ${driver.full_name},
        ${driver.headshot_url},
        ${driver.last_name},
        ${driver.driver_number},
        ${driver.team_id},
        ${driver.name_acronym}
      )
      ON CONFLICT (id) DO NOTHING;
    `
    )
  );

  return insertedDrivers;
}

async function seedPredictionGroups() {
  await sql`
    CREATE TABLE IF NOT EXISTS prediction_groups (
      id INT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      group_type VARCHAR(50) NOT NULL CHECK (group_type IN ('SEASON', 'RACE')),
      prediction_deadline TIMESTAMP
    );
  `;

  const insertedPredictionGroups = await Promise.all(
    prediction_groups.map(
      (group) => sql`
      INSERT INTO prediction_groups (id, name, group_type, prediction_deadline)
      VALUES (${group.id}, ${group.name}, ${group.group_type}, ${group.prediction_deadline})
      ON CONFLICT (id) DO NOTHING;
    `
    )
  );

  return insertedPredictionGroups;
}

async function seedPredictionGroupItems() {
  await sql`
    CREATE TABLE IF NOT EXISTS prediction_group_items (
      id INT PRIMARY KEY,
      prediction_group_id INT REFERENCES prediction_groups(id),
      name VARCHAR(255) NOT NULL,
      selection_type VARCHAR(50) NOT NULL CHECK (selection_type IN ('DRIVER_UNIQUE', 'TEAM_UNIQUE', 'DRIVER_MULTIPLE', 'TEAM_MULTIPLE', 'POSITION'))
    );
  `;

  const insertedPredictionGroupItems = await Promise.all(
    prediction_group_items.map(
      (item) => sql`
      INSERT INTO prediction_group_items (id, prediction_group_id, name, selection_type)
      VALUES (${item.id}, ${item.prediction_group_id}, ${item.name}, ${item.selection_type})
      ON CONFLICT (id) DO NOTHING;
    `
    )
  );

  return insertedPredictionGroupItems;
}

async function seedPointsDefinitions() {
  await sql`
    CREATE TABLE IF NOT EXISTS points_definitions (
      id INT PRIMARY KEY,
      prediction_group_id INT REFERENCES prediction_groups(id),
      type VARCHAR(50) NOT NULL CHECK (type IN ('EXACT', 'ANY_IN_ITEMS', 'RESULTS_INCLUDES')),
      points INT NOT NULL
    );
  `;

  const insertedPointsDefinitions = await Promise.all(
    points_definitions.map(
      (def) => sql`
      INSERT INTO points_definitions (id, prediction_group_id, type, points)
      VALUES (${def.id}, ${def.prediction_group_id}, ${def.type}, ${def.points})
      ON CONFLICT (id) DO NOTHING;
    `
    )
  );

  return insertedPointsDefinitions;
}

async function seedPointsExceptions() {
  await sql`
    CREATE TABLE IF NOT EXISTS points_exceptions (
      id INT PRIMARY KEY,
      points_definition_id INT REFERENCES points_definitions(id),
      driver_id INT REFERENCES drivers(id),
      team_id INT REFERENCES teams(id),
      points DECIMAL(3,1) NOT NULL
    );
  `;

  const insertedPointsExceptions = await Promise.all(
    points_exceptions.map(
      (exception) => sql`
      INSERT INTO points_exceptions (id, points_definition_id, driver_id, team_id, points)
      VALUES (${exception.id}, ${exception.points_definition_id}, ${exception.driver_id}, ${exception.team_id}, ${exception.points})
      ON CONFLICT (id) DO NOTHING;
    `
    )
  );

  return insertedPointsExceptions;
}

async function seedEvents() {
  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id INT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      track VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      has_sprint_race BOOLEAN NOT NULL,
      status VARCHAR(50) NOT NULL CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'FINISHED')),
      track_image TEXT NOT NULL
    );
  `;

  const insertedEvents = await Promise.all(
    events.map(
      (event) => sql`
      INSERT INTO events (id, name, track, date, has_sprint_race, status, track_image)
      VALUES (${event.id}, ${event.name}, ${event.track}, ${event.date}, ${event.has_sprint_race}, ${event.status}, ${event.track_image})
      ON CONFLICT (id) DO NOTHING;
    `
    )
  );

  return insertedEvents;
}

async function seedEventResults() {
  await sql`
    CREATE TABLE IF NOT EXISTS event_results (
      id INT PRIMARY KEY,
      event_id INT REFERENCES events(id),
      driver_id INT REFERENCES drivers(id),
      team_id INT REFERENCES teams(id),
      position INT,
      prediction_group_item_id INT REFERENCES prediction_group_items(id)
    );
  `;

  const insertedEventResults = await Promise.all(
    event_results.map(
      (result) => sql`
      INSERT INTO event_results (id, event_id, driver_id, team_id, position, prediction_group_item_id)
      VALUES (${result.id}, ${result.event_id}, ${result.driver_id}, ${result.team_id}, ${result.position}, ${result.prediction_group_item_id})
      ON CONFLICT (id) DO NOTHING;
    `
    )
  );

  return insertedEventResults;
}

async function seedSeasonResults() {
  await sql`
    CREATE TABLE IF NOT EXISTS season_results (
      id INT PRIMARY KEY,
      driver_id INT REFERENCES drivers(id),
      team_id INT REFERENCES teams(id),
      position INT,
      prediction_group_item_id INT REFERENCES prediction_group_items(id)
    );
  `;

  const insertedSeasonResults = await Promise.all(
    season_results.map(
      (result) => sql`
      INSERT INTO season_results (id, driver_id, team_id, position, prediction_group_item_id)
      VALUES (${result.id}, ${result.driver_id}, ${result.team_id}, ${result.position}, ${result.prediction_group_item_id})
      ON CONFLICT (id) DO NOTHING;
    `
    )
  );

  return insertedSeasonResults;
}

async function seedUserPredictions() {
  await sql`
    CREATE TABLE IF NOT EXISTS user_predictions (
      id INT PRIMARY KEY,
      user_id INT REFERENCES users(id),
      event_id INT REFERENCES events(id),
      prediction_group_item_id INT REFERENCES prediction_group_items(id),
      driver_id INT REFERENCES drivers(id),
      team_id INT REFERENCES teams(id),
      position INT,
      finished BOOLEAN,
      points INT,
      updated_at TIMESTAMP
    );
  `;

  const insertedUserPredictions = await Promise.all(
    user_predictions.map(
      (prediction) => sql`
      INSERT INTO user_predictions (id, user_id, event_id, prediction_group_item_id, driver_id, team_id, position, finished, points, updated_at)
      VALUES (${prediction.id}, ${prediction.user_id}, ${prediction.event_id}, ${prediction.prediction_group_item_id}, ${prediction.driver_id}, ${prediction.team_id}, ${prediction.position}, ${prediction.finished}, ${prediction.points}, ${prediction.updated_at})
      ON CONFLICT (id) DO NOTHING;
    `
    )
  );

  return insertedUserPredictions;
}

export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await seedUsers();
      await seedTeams();
      await seedDrivers();
      await seedPredictionGroups();
      await seedPredictionGroupItems();
      await seedPointsDefinitions();
      await seedPointsExceptions();
      await seedEvents();
      await seedEventResults();
      await seedSeasonResults();
      await seedUserPredictions();
    });

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return Response.json({ error }, { status: 500 });
  }
}
