INSERT INTO post (id, user_id, title, body, visible, created_at) VALUES (1, 1, 'First Post', 'This is the body of the first post.', false, '2024-03-15 10:30:00');
INSERT INTO post (id, user_id, title, body, visible, created_at) VALUES (2, 1, 'Second Post', 'This is the body of the second post.', true, '2024-03-16 14:45:00');
INSERT INTO post (id, user_id, title, body, visible, created_at) VALUES (3, 2, 'Third Post', 'This is the body of the third post.', true, '2024-03-17 09:15:00');
INSERT INTO post (id, user_id, title, body, visible, created_at) VALUES (4, 2, 'Fourth Post', 'This is the body of the fourth post.', false, '2024-03-18 16:20:00');


INSERT INTO account (username, password_hash) VALUES
('user1', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'), -- Passwort: password123
('user2', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'), -- Passwort: 123456
('user3', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'); -- Passwort: 123456

-- Insert test data for PackingListItems
INSERT INTO packing_list_item (name, ticked_off, person_id, trip_id) VALUES
('Passport', false, 1, 1),
('Laptop', false, 1, 1),
('Charger', false, 1, 1),
('Toothbrush', false, 1, 1),
('Toothpaste', false, 1, 1),
('Shirts', false, 1, 1),
('Pants', false, 1, 1),
('Socks', false, 1, 1),
('Underwear', false, 1, 1),
('Business Cards', false, 1, 1);

-- Add some items for a different person/trip combination
INSERT INTO packing_list_item (name, ticked_off, person_id, trip_id) VALUES
('Passport', false, 2, 2),
('Laptop', false, 2, 2),
('Charger', false, 2, 2),
('Swimsuit', false, 2, 2),
('Sunglasses', false, 2, 2);
