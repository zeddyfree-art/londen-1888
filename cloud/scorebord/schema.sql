-- Gedeeld scorebord van Londen 1888 (Cloudflare D1, database londen1888-scorebord)
CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ingestuurd TEXT NOT NULL,          -- tijdstip op de server (ISO)
  datum TEXT NOT NULL,               -- speeldatum volgens het apparaat
  naam TEXT NOT NULL,
  god TEXT NOT NULL,
  stand TEXT NOT NULL,
  helden TEXT NOT NULL,              -- JSON-lijst van held-id's
  klokken TEXT NOT NULL,             -- JSON-lijst van klok-id's
  ronde INTEGER NOT NULL,
  uitslag TEXT NOT NULL,             -- winst of nipt
  kans REAL NOT NULL,                -- door de server berekend
  punten INTEGER NOT NULL,           -- door de server berekend
  sleutel TEXT NOT NULL UNIQUE,      -- apparaat + potje, tegen dubbel insturen
  bron TEXT NOT NULL                 -- gehashte afzender, voor de limiet per uur
);
CREATE INDEX IF NOT EXISTS scores_punten ON scores (punten DESC);
CREATE INDEX IF NOT EXISTS scores_bron ON scores (bron, ingestuurd);
