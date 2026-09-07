-- --nest-di-only became --nest on|off|di-only, so the boolean cannot express
-- the third mode. Existing rows predate `off`: every one of them is whichever
-- of the two old modes its boolean recorded.
ALTER TABLE runs ADD COLUMN nest TEXT NOT NULL DEFAULT 'on';

UPDATE runs SET nest = 'di-only' WHERE nest_di_only = 1;

ALTER TABLE runs DROP COLUMN nest_di_only;
