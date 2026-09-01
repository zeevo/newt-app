-- NOT NULL needs a default because the table already has rows; SQLite has no
-- way to add a required column to a populated table otherwise.
ALTER TABLE runs ADD COLUMN command TEXT NOT NULL DEFAULT '';
