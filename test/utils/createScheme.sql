DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS users;
 
CREATE TABLE news (
    id              SERIAL       PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    content         TEXT         NOT NULL,
    published_at    TIMESTAMP    NOT NULL    DEFAULT NOW()
);

CREATE TABLE teams (
    id              SERIAL       PRIMARY KEY,
    name            VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id              SERIAL       PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL    UNIQUE,
    group           VARCHAR(255) NOT NULL,
    password_hash   TEXT         NOT NULL,
    role            VARCHAR(50)  NOT NULL
    team_id         INTEGER      REFERENCES teams(id) ON DELETE SET NULL
);