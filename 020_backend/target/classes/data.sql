-- Insert users
INSERT INTO users (username, password_hash) VALUES
('user1', 'bed4efa1d4fdbd954bd3705d6a2a78270ec9a52ecfbfb010c61862af5c76af1761ffeb1aef6aca1bf5d02b3781aa854fabd2b69c790de74e17ecfec3cb6ac4bf'), -- Password: password123
('user2', 'ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413'), -- Password: 123456
('user3', 'ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413'); -- Password: 123456

-- Insert business trips
INSERT INTO business_trip (title, description, start_date, end_date, destination) VALUES
('Berlin Conference', 'Annual tech conference in Berlin', '2024-04-01', '2024-04-03', 'Berlin'),
('Paris Meeting', 'Client meeting in Paris', '2024-04-15', '2024-04-16', 'Paris'),
('London Workshop', 'Team workshop in London', '2024-05-01', '2024-05-03', 'London');

-- Insert user-trip relationships
INSERT INTO user_business_trip (user_id, trip_id) VALUES
(1, 1), -- user1 -> Berlin Conference
(1, 2), -- user1 -> Paris Meeting
(2, 1), -- user2 -> Berlin Conference
(2, 3), -- user2 -> London Workshop
(3, 2); -- user3 -> Paris Meeting

-- Insert packing list items
INSERT INTO packing_list (name, ticked_off, user_id, trip_id) VALUES
('Passport', false, 1, 1),
('Laptop', false, 1, 1),
('Charger', false, 1, 1),
('Business Suit', false, 1, 1),
('Business Cards', false, 1, 1),
('Toothbrush', false, 1, 1),
('Toothpaste', false, 1, 1),
('Shirts', false, 1, 1),
('Pants', false, 1, 1),
('Socks', false, 1, 1);

-- Add items for second trip
INSERT INTO packing_list (name, ticked_off, user_id, trip_id) VALUES
('Passport', false, 1, 2),
('Laptop', false, 1, 2),
('Charger', false, 1, 2),
('Business Attire', false, 1, 2),
('Meeting Documents', false, 1, 2);
