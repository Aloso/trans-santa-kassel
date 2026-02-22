DROP TABLE IF EXISTS secret_santa;
CREATE TABLE secret_santa (
  id          STRING PRIMARY KEY,
  created     INTEGER NOT NULL,
  `name`      TEXT NOT NULL,
  phone       TEXT NOT NULL,
  `address`   TEXT NOT NULL,
  age         INTEGER NOT NULL,
  moreInfo    TEXT,
  verified    INTEGER NOT NULL,
  notes       TEXT
);
