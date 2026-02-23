-- Initial schema migration
-- Creates all tables for the ferrer-pool F1 prediction application

CREATE TABLE IF NOT EXISTS public.users (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  profile_image character varying,
  email character varying,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at time with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.teams (
  id integer NOT NULL,
  name character varying NOT NULL,
  colour character varying NOT NULL,
  car_image text NOT NULL,
  CONSTRAINT teams_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.drivers (
  id integer NOT NULL,
  broadcast_name character varying NOT NULL,
  country_code character varying,
  first_name character varying NOT NULL,
  full_name character varying NOT NULL,
  headshot_url text NOT NULL,
  last_name character varying NOT NULL,
  driver_number integer NOT NULL,
  team_id integer,
  name_acronym character varying NOT NULL,
  CONSTRAINT drivers_pkey PRIMARY KEY (id),
  CONSTRAINT drivers_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id)
);

CREATE TABLE IF NOT EXISTS public.sessions (
  session_key integer NOT NULL,
  meeting_key integer NOT NULL,
  circuit_key integer NOT NULL,
  country_key integer NOT NULL,
  circuit_short_name character varying,
  country_code character,
  country_name character varying,
  date_start timestamp with time zone,
  date_end timestamp with time zone,
  gmt_offset time without time zone,
  location character varying,
  session_name character varying,
  session_type character varying,
  year integer,
  CONSTRAINT sessions_pkey PRIMARY KEY (session_key)
);

CREATE SEQUENCE IF NOT EXISTS laps_lap_id_seq;
CREATE TABLE IF NOT EXISTS public.laps (
  lap_id integer NOT NULL DEFAULT nextval('laps_lap_id_seq'::regclass),
  meeting_key integer NOT NULL,
  session_key integer NOT NULL,
  driver_number integer NOT NULL,
  lap_number integer NOT NULL,
  date_start timestamp with time zone,
  duration_sector_1 numeric,
  duration_sector_2 numeric,
  duration_sector_3 numeric,
  lap_duration numeric,
  i1_speed integer,
  i2_speed integer,
  st_speed integer,
  is_pit_out_lap boolean,
  CONSTRAINT laps_pkey PRIMARY KEY (lap_id),
  CONSTRAINT laps_session_key_fkey FOREIGN KEY (session_key) REFERENCES public.sessions(session_key)
);

CREATE SEQUENCE IF NOT EXISTS stints_stint_id_seq;
CREATE TABLE IF NOT EXISTS public.stints (
  stint_id integer NOT NULL DEFAULT nextval('stints_stint_id_seq'::regclass),
  meeting_key integer NOT NULL,
  session_key integer NOT NULL,
  driver_number integer NOT NULL,
  stint_number integer NOT NULL,
  compound character varying,
  lap_start integer,
  lap_end integer,
  tyre_age_at_start integer,
  CONSTRAINT stints_pkey PRIMARY KEY (stint_id),
  CONSTRAINT stints_session_key_fkey FOREIGN KEY (session_key) REFERENCES public.sessions(session_key)
);

CREATE TABLE IF NOT EXISTS public.events (
  id integer NOT NULL,
  name character varying NOT NULL,
  track character varying NOT NULL,
  date date NOT NULL,
  has_sprint_race boolean NOT NULL,
  status character varying NOT NULL CHECK (status::text = ANY (ARRAY['NOT_STARTED'::character varying::text, 'IN_PROGRESS'::character varying::text, 'FINISHED'::character varying::text])),
  track_image text NOT NULL,
  quali_start_at timestamp with time zone,
  CONSTRAINT events_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.prediction_groups (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  group_type character varying NOT NULL CHECK (group_type::text = ANY (ARRAY['SEASON'::character varying::text, 'RACE'::character varying::text])),
  prediction_deadline timestamp without time zone,
  position integer,
  CONSTRAINT prediction_groups_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.prediction_group_items (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  prediction_group_id integer,
  name character varying NOT NULL,
  selection_type character varying NOT NULL CHECK (selection_type::text = ANY (ARRAY['DRIVER_UNIQUE'::character varying::text, 'TEAM_UNIQUE'::character varying::text, 'DRIVER_MULTIPLE'::character varying::text, 'TEAM_MULTIPLE'::character varying::text, 'POSITION'::character varying::text])),
  position integer,
  enabled boolean NOT NULL DEFAULT true,
  CONSTRAINT prediction_group_items_pkey PRIMARY KEY (id),
  CONSTRAINT prediction_group_items_prediction_group_id_fkey FOREIGN KEY (prediction_group_id) REFERENCES public.prediction_groups(id)
);

CREATE TABLE IF NOT EXISTS public.points_definitions (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  prediction_group_id integer,
  type character varying NOT NULL CHECK (type::text = ANY (ARRAY['EXACT'::character varying::text, 'ANY_IN_ITEMS'::character varying::text, 'RESULTS_INCLUDES'::character varying::text])),
  points integer NOT NULL,
  CONSTRAINT points_definitions_pkey PRIMARY KEY (id),
  CONSTRAINT points_definitions_prediction_group_id_fkey FOREIGN KEY (prediction_group_id) REFERENCES public.prediction_groups(id)
);

CREATE TABLE IF NOT EXISTS public.points_exceptions (
  id integer NOT NULL,
  points_definition_id integer,
  driver_id integer,
  team_id integer,
  points numeric NOT NULL,
  CONSTRAINT points_exceptions_pkey PRIMARY KEY (id),
  CONSTRAINT points_exceptions_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id),
  CONSTRAINT points_exceptions_points_definition_id_fkey FOREIGN KEY (points_definition_id) REFERENCES public.points_definitions(id),
  CONSTRAINT points_exceptions_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id)
);

CREATE TABLE IF NOT EXISTS public.event_results (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  event_id integer,
  driver_id integer,
  team_id integer,
  position integer,
  prediction_group_item_id integer,
  CONSTRAINT event_results_pkey PRIMARY KEY (id),
  CONSTRAINT event_results_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id),
  CONSTRAINT event_results_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT event_results_prediction_group_item_id_fkey FOREIGN KEY (prediction_group_item_id) REFERENCES public.prediction_group_items(id),
  CONSTRAINT event_results_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id)
);

CREATE TABLE IF NOT EXISTS public.season_results (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  driver_id integer,
  team_id integer,
  position integer,
  prediction_group_item_id integer UNIQUE,
  CONSTRAINT season_results_pkey PRIMARY KEY (id),
  CONSTRAINT season_results_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id),
  CONSTRAINT season_results_prediction_group_item_id_fkey FOREIGN KEY (prediction_group_item_id) REFERENCES public.prediction_group_items(id),
  CONSTRAINT season_results_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id)
);

CREATE TABLE IF NOT EXISTS public.user_predictions (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id integer,
  event_id integer,
  prediction_group_item_id integer,
  driver_id integer,
  team_id integer,
  position integer,
  finished boolean NOT NULL DEFAULT false,
  points integer NOT NULL DEFAULT 0,
  updated_at timestamp without time zone,
  CONSTRAINT user_predictions_pkey PRIMARY KEY (id),
  CONSTRAINT user_predictions_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id),
  CONSTRAINT user_predictions_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT user_predictions_prediction_group_item_id_fkey FOREIGN KEY (prediction_group_item_id) REFERENCES public.prediction_group_items(id),
  CONSTRAINT user_predictions_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id),
  CONSTRAINT user_predictions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
