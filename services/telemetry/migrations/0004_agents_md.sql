-- --no-agents-md is new, so every existing row is a run that scaffolded both files.
ALTER TABLE runs ADD COLUMN agents_md INTEGER NOT NULL DEFAULT 1;
