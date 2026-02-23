CREATE TABLE insights (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    analysis TEXT NOT NULL
);
