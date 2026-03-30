DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS teams;
 
CREATE TABLE news (
    id              SERIAL       PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    content         TEXT         NOT NULL,
    published_at    TIMESTAMP    NOT NULL    DEFAULT NOW()
);

CREATE TABLE teams (
    id              SERIAL       PRIMARY KEY,
    name            VARCHAR(255) NOT NULL    UNIQUE,
    score           INTEGER      DEFAULT 0
);

CREATE TABLE users (
    id              SERIAL       PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL    UNIQUE,
    university_group VARCHAR(255) NOT NULL,
    password_hash   TEXT         NOT NULL,
    role            VARCHAR(50)  NOT NULL,
    team_id         INTEGER      REFERENCES teams(id) ON DELETE SET NULL
);