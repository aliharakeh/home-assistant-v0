CREATE TABLE IF NOT EXISTS Home (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    address TEXT,
    electricity_code TEXT,
    shareholders TEXT,
    rent TEXT,
    tenant TEXT
);

CREATE TABLE IF NOT EXISTS ElectricityBill (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    home_id INTEGER,
    monthYear TEXT,
    payment REAL,
    FOREIGN KEY (home_id) REFERENCES Home(id) ON DELETE CASCADE
);

-- Insert sample homes
INSERT INTO Home (name, address, electricity_code, shareholders, rent, tenant) 
VALUES 
    ('Mountain View Condo', '123 Mountain Rd, Denver, CO 80201', 'MVC-456', 
    '[{"name":"John Smith","shareValue":50},{"name":"Jane Doe","shareValue":50}]',
    NULL, NULL),
    
    ('Lakeside Apartment', '789 Lake Ave, Chicago, IL 60601', 'LA-789',
    '[{"name":"Emily White","shareValue":70},{"name":"Michael Green","shareValue":30}]',
    NULL, NULL),
    
    ('Downtown Loft', '101 Main St, New York, NY 10001', 'DL-101',
    '[{"name":"David Miller","shareValue":40},{"name":"Sarah Wilson","shareValue":30},{"name":"James Taylor","shareValue":30}]',
    '2500', 'Thomas Anderson');

-- Insert sample electricity bills
INSERT INTO ElectricityBill (home_id, monthYear, payment)
VALUES
    (1, '2023-01', 95),
    (1, '2023-02', 110),
    (2, '2023-01', 85), 
    (2, '2023-02', 90),
    (3, '2023-01', 150),
    (3, '2023-02', 165);
