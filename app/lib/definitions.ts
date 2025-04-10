// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.

import { DateValue } from '@internationalized/date';

export type User = {
  id: number;
  name: string;
};

export type Team = {
  id: number;
  name: string;
  colour: string;
  car_image: string;
};

export type Driver = {
  id: number;
  broadcast_name: string;
  country_code: string | null;
  first_name: string;
  full_name: string;
  headshot_url: string;
  last_name: string;
  driver_number: number;
  team_id: number;
  name_acronym: string;
};

export type PredictionGroup = {
  id?: number;
  name: string;
  group_type: 'SEASON' | 'RACE';
  prediction_deadline: DateValue | null;
};

export type PredictionGroupItem = {
  id: number;
  prediction_group_id: number;
  name: string;
  selection_type:
    | 'DRIVER_UNIQUE'
    | 'TEAM_UNIQUE'
    | 'DRIVER_MULTIPLE'
    | 'TEAM_MULTIPLE'
    | 'POSITION';
};

export type PointsDefinition = {
  id: number;
  prediction_group_id: number;
  type: 'EXACT' | 'ANY_IN_ITEMS' | 'RESULTS_INCLUDES';
  points: number;
};

export type PointsException = {
  id: number;
  points_definition_id: number;
  driver_id: number | null;
  team_id: number | null;
  points: number;
};

export type Event = {
  id: number;
  name: string;
  track: string;
  date: string;
  has_sprint_race: boolean;
  status: 'NOT_STARTED' | 'FINISHED' | 'IN_PROGRESS';
  track_image: string;
  quali_start_at: string | null;
};

export type EventResult = {
  id?: number;
  event_id: number;
  driver_id: number | null;
  team_id: number | null;
  position: number | null;
  prediction_group_item_id: number;
};

export type EventResultDetailed = EventResult & {
  pridiction_name: string;
  driver_name: string;
  driver_acronym: string;
  driver_headshot_url: string;
  team_name: string;
  team_image_url: string;
  team_color: string;
  position: number | null;
  group_name: string;
};

export type SeasonResult = {
  id?: number;
  prediction_group_item_id: number;
  driver_id: number | null;
  team_id: number | null;
  position: number | null;
};

export type UserPrediction = {
  id?: number;
  user_id: number;
  prediction_group_item_id: number;
  event_id: number | null;
  driver_id: number | null;
  team_id: number | null;
  position: number | null;
  finished: boolean;
  points: number;
  updated_at: string | null;
};

export type Leaderboard = {
  id: number;
  name: string;
  points: number;
  position: number;
  profile_image_url: string;
};

export type SeasonPredictionsConfig = {
  id: number;
  group_name: string;
  prediction_deadline: string;
  prediction_name: string;
  selection_type:
    | 'DRIVER_UNIQUE'
    | 'TEAM_UNIQUE'
    | 'DRIVER_MULTIPLE'
    | 'TEAM_MULTIPLE'
    | 'POSITION';
};

export type EventPredictionsConfig = {
  id: number;
  name: string;
  prediction_deadline: string;
  prediction_name: string;
  selection_type:
    | 'DRIVER_UNIQUE'
    | 'TEAM_UNIQUE'
    | 'DRIVER_MULTIPLE'
    | 'TEAM_MULTIPLE'
    | 'POSITION';
};

export type EventsWithPredictionsConfig = Event & {
  predictions_config: EventPredictionsConfig[];
};

export type PredictionGroupConfig = PredictionGroup & {
  items: PredictionGroupItem[];
  points: PointsDefinition[];
};

export type UserResultByEvent = {
  event_id: number;
  event_name: string;
  user_id: number;
  user_name: string;
  user_avatar: string | null;
  item_id: number;
  name: string;
  driver_id: number | null;
  driver_acronym: string | null;
  driver_avatar: string | null;
  driver_color: string | null;
  result_driver_acronym: string | null;
  result_driver_avatar: string | null;
  result_driver_color: string | null;
  points: number;
};

export type UserPointsByEvent = {
  event_id: number;
  event_name: string;
  track_image: string;
  user_id: number;
  user_name: string;
  user_avatar: string;
  points: number;
};

export type CumulativePoints = {
  user_id: number;
  user_name: string;
  event_id: number;
  event_name: string;
  event_points: number;
  cumulative_points: number;
};
