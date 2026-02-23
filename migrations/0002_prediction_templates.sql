CREATE TABLE IF NOT EXISTS public.prediction_templates (
  id                       integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id                  integer NOT NULL REFERENCES public.users(id),
  prediction_group_item_id integer NOT NULL REFERENCES public.prediction_group_items(id),
  driver_id                integer REFERENCES public.drivers(id),
  team_id                  integer REFERENCES public.teams(id),
  position                 integer,
  updated_at               timestamp DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT prediction_templates_user_item_unique
    UNIQUE (user_id, prediction_group_item_id)
);
