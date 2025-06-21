-- Temporarily disable referential integrity
SET REFERENTIAL_INTEGRITY FALSE;

-- Drop tables in correct order (dependent tables first)
DROP TABLE IF EXISTS packing_list;
DROP TABLE IF EXISTS user_business_trip;
DROP TABLE IF EXISTS business_trip;
DROP TABLE IF EXISTS users;

-- Re-enable referential integrity
SET REFERENTIAL_INTEGRITY TRUE;

-- Create tables
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL CHECK (role IN ('TEAMLEAD', 'MITARBEITER')),
    token VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255),  -- Removed NOT NULL constraint
    phone_number VARCHAR(255)
);

CREATE TABLE business_trip (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    destination VARCHAR(255) NOT NULL
);

CREATE TABLE user_business_trip (
    user_id BIGINT NOT NULL,
    trip_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, trip_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (trip_id) REFERENCES business_trip(id) ON DELETE CASCADE
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

CREATE TABLE expenses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    user_id BIGINT NOT NULL,
    trip_id BIGINT NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (trip_id) REFERENCES business_trip(id)
);