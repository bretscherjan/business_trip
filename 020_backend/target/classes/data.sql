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

-- Insert receipts for Berlin Conference (trip_id = 1)
INSERT INTO receipt (name, description, amount, user_id, trip_id) VALUES
('Hotel Berlin', '3 nights at Grand Hotel Berlin', 450.00, 1, 1),
('Conference Ticket', 'Entry ticket for Tech Conference 2024', 299.99, 1, 1),
('Taxi Rides', 'Various taxi rides during the conference', 85.50, 1, 1),
('Restaurant Dinner', 'Business dinner with clients', 120.75, 1, 1),
('Office Supplies', 'Notebooks and pens for the conference', 25.99, 1, 1);

-- Insert receipts for Paris Meeting (trip_id = 2)
INSERT INTO receipt (name, description, amount, user_id, trip_id) VALUES
('Hotel Paris', '2 nights at Hotel de Paris', 320.00, 1, 2),
('Client Lunch', 'Business lunch with client', 95.50, 1, 2),
('Metro Tickets', 'Public transport in Paris', 35.00, 1, 2),
('Coffee Meetings', 'Various coffee meetings', 45.75, 1, 2);

-- Insert receipts for London Workshop (trip_id = 3)
INSERT INTO receipt (name, description, amount, user_id, trip_id) VALUES
('Workshop Materials', 'Training materials and handouts', 150.00, 2, 3),
('Team Dinner', 'Group dinner with workshop participants', 180.50, 2, 3),
('Transportation', 'Airport transfers and local transport', 75.25, 2, 3);
