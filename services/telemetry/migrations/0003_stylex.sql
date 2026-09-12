-- --stylex is new, so every existing row is a run that could not have chosen it.
ALTER TABLE runs ADD COLUMN stylex INTEGER NOT NULL DEFAULT 0;
