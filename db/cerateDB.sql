COMMIT;
BEGIN;

DROP TABLE IF EXISTS user_plays_game;
DROP TABLE IF EXISTS users_are_friends;
DROP TABLE IF EXISTS move;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS PushPosition;
DROP TYPE IF EXISTS Color;

CREATE TYPE PushPosition AS ENUM ('north-1', 'north-2', 'north-3', 'east-1', 'east-2', 'east-3', 'south-1', 'south-2', 'south-3', 'west-1', 'west-2', 'west-3');


CREATE TYPE Color AS ENUM ('red', 'green', 'blue', 'yellow');

CREATE TABLE IF NOT EXISTS game (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  gameStarted TIMESTAMP NOT NULL,
  gameEnded TIMESTAMP,
  firstPlayerToMove INT NOT NULL,
  startBoard jsonb NOT NULL
);


CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  email varchar(320) UNIQUE NOT NULL,
  username varchar(20) UNIQUE NOT NULL,
  password varchar(200) NOT NULL,
  gamesWon INT DEFAULT 0,
  gamesLost INT DEFAULT 0,
  UNIQUE(email),
  UNIQUE(username)
);


CREATE TABLE IF NOT EXISTS move (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  game UUID REFERENCES game NOT NULL,
  userID UUID REFERENCES users NOT NULL,
  fromX INT NOT NULL,
  fromY INT NOT NULL,
  toX INT NOT NULL,
  toY INT NOT NULL,
  pushPosition PushPosition NOT NULL,
  collectedTeasure INT
);


CREATE TABLE IF NOT EXISTS users_are_friends (
  userA UUID REFERENCES users NOT NULL,
  userB UUID REFERENCES users NOT NULL,
  since timestamp NOT NULL,
  PRIMARY KEY(userA, userB)
);


CREATE TABLE IF NOT EXISTS user_plays_game (
  game UUID NOT NULL REFERENCES game,
  userID UUID NOT NULL REFERENCES users,
  color Color,
  PRIMARY KEY(game, userID)
);

COMMIT;