-- One row per completed scaffold. Rows rather than counters: counters answer
-- "how many chose oxc" but can never answer "how many chose oxc AND standalone"
-- without knowing to ask in advance.
CREATE TABLE IF NOT EXISTS runs (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  ts             INTEGER NOT NULL,  -- server clock; a client's is not trustworthy
  cli_version    TEXT    NOT NULL,
  node_major     TEXT    NOT NULL,
  platform       TEXT    NOT NULL,
  mode           TEXT    NOT NULL,  -- 'interactive' | 'flags'
  ci             TEXT    NOT NULL,  -- 'none' when not detected
  explicit_flags TEXT    NOT NULL,  -- sorted, comma joined; '' when fully prompted
  shadcn         INTEGER NOT NULL,
  testing        TEXT    NOT NULL,
  database       TEXT    NOT NULL,
  linter         TEXT    NOT NULL,
  deployment     TEXT    NOT NULL,
  nest_di_only   INTEGER NOT NULL,
  todo_example   INTEGER NOT NULL,
  anti_slop      INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS runs_ts ON runs (ts);
CREATE INDEX IF NOT EXISTS runs_ci ON runs (ci);
