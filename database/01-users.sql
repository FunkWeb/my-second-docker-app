CREATE TABLE IF NOT EXISTS users
(
    id         BIGSERIAL PRIMARY KEY,
    username   VARCHAR(30)  NOT NULL UNIQUE,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   TEXT         NOT NULL,
    first_name VARCHAR(50),
    last_name  VARCHAR(50),
    full_name  VARCHAR(101) GENERATED ALWAYS AS (CONCAT_WS(' ', first_name, last_name)) STORED,
    role       TEXT         NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    title      VARCHAR(100),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CHECK (char_length(username) BETWEEN 3 AND 30)
);
