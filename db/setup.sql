CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    pp BIGINT,
    clickpower INT,
    auto INT
);