-- Insert users with roles
INSERT INTO users (username, password_hash, email, first_name, last_name, role) VALUES
('admin', 'bed4efa1d4fdbd954bd3705d6a2a78270ec9a52ecfbfb010c61862af5c76af1761ffeb1aef6aca1bf5d02b3781aa854fabd2b69c790de74e17ecfec3cb6ac4bf', 'admin@company.com', 'Admin', 'User', 'ADMIN'), -- Password: password123
('manager1', 'ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413', 'manager@company.com', 'Manager', 'One', 'MANAGER'), -- Password: 123456
('user1', 'ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413', 'user1@company.com', 'John', 'Doe', 'MITARBEITER'), -- Password: 123456
('user2', 'ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413', 'user2@company.com', 'Jane', 'Smith', 'MITARBEITER'); -- Password: 123456

-- Insert business trips
INSERT INTO business_trip (code, description, start_date, end_date) VALUES
('BT01', 'San Francisco World Trade Center on new Server/IOT/Client', '2021-02-13 00:00:00', '2021-02-15 16:56:00'),
('BT02', 'Santa Clara Halley on new Server/IOT/Client', '2021-06-23 09:00:00', '2021-06-27 16:56:00'),
('BT03', 'San Cose City Halley on Docker/IOT/Client', '2021-12-13 09:00:00', '2021-12-15 16:56:00');

-- Insert meetings
INSERT INTO meeting (name, description, business_trip_id) VALUES
('One Conference', 'Key Note on One Conference', 1),
('Zero Conference', 'Workshop Zero on One Conference', 1),
('One Conference', 'HandsOn on One Conference', 2),
('One Conference', 'Key Note on One Conference', 2),
('One Conference', 'Key Note on One Conference', 3);

-- Insert user-trip relationships
INSERT INTO user_business_trip (user_id, trip_id) VALUES
(3, 1), -- user1 -> BT01
(3, 2), -- user1 -> BT02
(4, 1), -- user2 -> BT01
(4, 3), -- user2 -> BT03
(2, 2); -- manager1 -> BT02

-- Insert packing list items
INSERT INTO packing_list (name, ticked_off, user_id, trip_id) VALUES
('Passport', false, 3, 1),
('Laptop', false, 3, 1),
('Charger', false, 3, 1),
('Business Suit', false, 3, 1),
('Business Cards', false, 3, 1),
('Toothbrush', false, 3, 1),
('Toothpaste', false, 3, 1),
('Shirts', false, 3, 1),
('Pants', false, 3, 1),
('Socks', false, 3, 1);

-- Add items for second trip
INSERT INTO packing_list (name, ticked_off, user_id, trip_id) VALUES
('Passport', false, 3, 2),
('Laptop', false, 3, 2),
('Charger', false, 3, 2),
('Business Attire', false, 3, 2),
('Meeting Documents', false, 3, 2);
