import { SQLiteDatabase } from 'expo-sqlite';
import { ElectricityBill, Home, parseHome } from './models';

export const sql = `
    
DROP TABLE IF EXISTS Home;    
DROP TABLE IF EXISTS ElectricityBill;

CREATE TABLE IF NOT EXISTS Home (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    address TEXT,
    electricity TEXT,
    shareholders TEXT,
    rent TEXT
);

CREATE TABLE IF NOT EXISTS ElectricityBill (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    home_id INTEGER,
    date integer,
    amount REAL,
    FOREIGN KEY (home_id) REFERENCES Home(id) ON DELETE CASCADE
);

-- Insert sample homes
INSERT INTO Home (id, name, address, electricity, shareholders, rent)
VALUES 
    (1, 'Mountain View Condo', '123 Mountain Rd, Denver, CO 80201', '{"clock_code":"MVC-456","subsriptions":[{"name":"Main","currency":"USD"},{"name":"Motor","currency":"USD"}]}', 
    '[{"name":"John Smith","shareValue":50},{"name":"Jane Doe","shareValue":50}]',
    '{"price":{"amount":2500,"currency":"USD"},"tenant":{"name":"Thomas Anderson"},"rentPaymentDuration":"monthly", "lastPaymentDate":"2024-01-01"}'),
    
    (2, 'Lakeside Apartment', '789 Lake Ave, Chicago, IL 60601', '{"clock_code":"LA-789","subsriptions":[{"name":"Main","currency":"USD"},{"name":"Motor","currency":"USD"}]}',
    '[{"name":"Emily White","shareValue":70},{"name":"Michael Green","shareValue":30}]',
    '{"price":{"amount":2500,"currency":"USD"},"tenant":{"name":"Thomas Anderson"},"rentPaymentDuration":"monthly", "lastPaymentDate":"2024-01-01"}'),
    
    (3, 'Downtown Loft', '101 Main St, New York, NY 10001', '{"clock_code":"DL-101","subsriptions":[{"name":"Main","currency":"USD"},{"name":"Motor","currency":"USD"}]}',
    '[{"name":"David Miller","shareValue":40},{"name":"Sarah Wilson","shareValue":30},{"name":"James Taylor","shareValue":30}]',
    '{"price":{"amount":2500,"currency":"USD"},"tenant":{"name":"Thomas Anderson"},"rentPaymentDuration":"monthly", "lastPaymentDate":"2024-01-01"}');

-- Insert sample electricity bills
-- INSERT INTO ElectricityBill (home_id, date, amount, subsription_type)
-- VALUES
--     (1, '2023-01', 95, 'Main'),
--     (1, '2023-02', 110, 'Main'),
--     (1, '2023-03', 120, 'Main'),
--     (1, '2023-04', 130, 'Main'),
--     (1, '2023-05', 140, 'Main'),
--     (1, '2023-06', 150, 'Main'),
--     (1, '2023-07', 160, 'Main'),
--     (1, '2023-08', 170, 'Main'),
--     (1, '2023-09', 180, 'Main'),
--     (1, '2023-10', 190, 'Main'),
--     (1, '2023-11', 200, 'Main'),
--     (1, '2023-12', 210, 'Main'),
--     (1, '2024-01', 220, 'Main'),
--     (1, '2024-02', 230, 'Main'),
--     (1, '2024-03', 240, 'Main'),
--     (1, '2024-04', 250, 'Main'),
--     (1, '2024-05', 260, 'Main'),
--     (1, '2024-06', 270, 'Main'),
--     (1, '2024-07', 280, 'Main'),
--     (1, '2024-08', 290, 'Main'),
--     (1, '2024-09', 300, 'Main'),
--     (1, '2024-10', 310, 'Main'),
--     (1, '2024-11', 320, 'Main'),
--     (1, '2024-12', 330, 'Main'),
--     (2, '2023-01', 85, 'Main'), 
--     (2, '2023-02', 90, 'Main'),
--     (2, '2023-03', 95, 'Main'),
--     (2, '2023-04', 100, 'Main'),
--     (2, '2023-05', 105, 'Main'),
--     (2, '2023-06', 110, 'Main'),
--     (3, '2023-01', 150, 'Main'),
--     (3, '2023-02', 165, 'Main'),
--     (3, '2023-03', 180, 'Main'),
--     (3, '2023-04', 195, 'Main'),
--     (3, '2023-05', 210, 'Main'),
--     (3, '2023-06', 225, 'Main'),
--     (3, '2023-07', 240, 'Main'),
--     (3, '2023-08', 255, 'Main'),
--     (3, '2023-09', 270, 'Main'); 
`;

export async function getAllHomes(db: SQLiteDatabase): Promise<Home[]> {
    return (await db.getAllAsync<Home>('SELECT * FROM Home')).map(parseHome).filter(h => !!h);
}

export async function getHome(db: SQLiteDatabase, id: number): Promise<Home | null> {
    return parseHome(await db.getFirstAsync<Home>('SELECT * FROM Home WHERE id = ?', [id]));
}

export async function insertHome(db: SQLiteDatabase, home: Home) {
    await db.runAsync(
        'INSERT INTO Home (name, address, electricity, shareholders, rent) VALUES (?, ?, ?, ?, ?)',
        [
            home.name,
            home.address,
            JSON.stringify(home.electricity),
            JSON.stringify(home.shareholders),
            home.rent ? JSON.stringify(home.rent) : null,
        ]
    );
}

export async function updateHome(db: SQLiteDatabase, home: Home) {
    await db.runAsync(
        'UPDATE Home SET name = ?, address = ?, electricity = ?, shareholders = ?, rent = ? WHERE id = ?',
        [
            home.name,
            home.address,
            JSON.stringify(home.electricity),
            JSON.stringify(home.shareholders),
            home.rent ? JSON.stringify(home.rent) : null,
            home.id!,
        ]
    );
}

export async function getElectricityBills(
    db: SQLiteDatabase,
    homeId: number
): Promise<ElectricityBill[]> {
    const data = await db.getAllAsync<ElectricityBill>(
        'SELECT * FROM ElectricityBill WHERE home_id = ? ORDER BY date DESC LIMIT 12 ',
        [homeId]
    );
    return data.reverse();
}

export async function insertElectricityBill(
    db: SQLiteDatabase,
    homeId: number,
    bill: ElectricityBill
) {
    await db.runAsync(
        'INSERT INTO ElectricityBill (home_id, date, amount, subsription_type) VALUES (?, ?, ?, ?)',
        [homeId, bill.date, bill.amount, bill.subsription_type]
    );
}
