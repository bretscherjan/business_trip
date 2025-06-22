-- Temporarily disable referential integrity
SET REFERENTIAL_INTEGRITY FALSE;

-- Drop tables in correct order (dependent tables first)
DROP TABLE IF EXISTS packing_list;
DROP TABLE IF EXISTS meeting;
DROP TABLE IF EXISTS user_business_trip;
DROP TABLE IF EXISTS business_trip;
DROP TABLE IF EXISTS users;

-- Re-enable referential integrity
SET REFERENTIAL_INTEGRITY TRUE;

-- Create tables
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'MITARBEITER',
    token VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE business_trip (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(255),
    description TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP
);

CREATE TABLE meeting (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description TEXT,
    business_trip_id BIGINT,
    FOREIGN KEY (business_trip_id) REFERENCES business_trip(id)
);

CREATE TABLE user_business_trip (
    user_id BIGINT NOT NULL,
    trip_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, trip_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (trip_id) REFERENCES business_trip(id)
);

CREATE TABLE packing_list (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    ticked_off BOOLEAN NOT NULL DEFAULT FALSE,
    user_id BIGINT NOT NULL,
    trip_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (trip_id) REFERENCES business_trip(id)
);