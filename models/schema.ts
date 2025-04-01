import { SQLiteDatabase } from 'expo-sqlite';
import { ElectricityBill, Home, parseHome } from './models';

export const sql = `
    
DROP TABLE IF EXISTS Home;    
DROP TABLE IF EXISTS ElectricityBill;

CREATE TABLE IF NOT EXISTS Home (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    address TEXT,
    electricity_code TEXT,
    shareholders TEXT,
    rent TEXT
);

CREATE TABLE IF NOT EXISTS ElectricityBill (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    home_id INTEGER,
    date TEXT,
    amount REAL,
    currency TEXT,
    FOREIGN KEY (home_id) REFERENCES Home(id) ON DELETE CASCADE
);

-- Insert sample homes
INSERT INTO Home (id, name, address, electricity_code, shareholders, rent)
VALUES 
    (1, 'Mountain View Condo', '123 Mountain Rd, Denver, CO 80201', 'MVC-456', 
    '[{"name":"John Smith","shareValue":50},{"name":"Jane Doe","shareValue":50}]',
    '{"price":{"amount":2500,"currency":"USD"},"tenant":{"name":"Thomas Anderson"},"rentPaymentDuration":"monthly", "lastPaymentDate":"2024-01-01"}'),
    
    (2, 'Lakeside Apartment', '789 Lake Ave, Chicago, IL 60601', 'LA-789',
    '[{"name":"Emily White","shareValue":70},{"name":"Michael Green","shareValue":30}]',
    '{"price":{"amount":2500,"currency":"USD"},"tenant":{"name":"Thomas Anderson"},"rentPaymentDuration":"monthly", "lastPaymentDate":"2024-01-01"}'),
    
    (3, 'Downtown Loft', '101 Main St, New York, NY 10001', 'DL-101',
    '[{"name":"David Miller","shareValue":40},{"name":"Sarah Wilson","shareValue":30},{"name":"James Taylor","shareValue":30}]',
    '{"price":{"amount":2500,"currency":"USD"},"tenant":{"name":"Thomas Anderson"},"rentPaymentDuration":"monthly", "lastPaymentDate":"2024-01-01"}');

-- Insert sample electricity bills
INSERT INTO ElectricityBill (home_id, date, amount, currency)
VALUES
    (1, '2023-01', 95, 'USD'),
    (1, '2023-02', 110, 'USD'),
    (1, '2023-03', 120, 'USD'),
    (1, '2023-04', 130, 'USD'),
    (1, '2023-05', 140, 'USD'),
    (1, '2023-06', 150, 'USD'),
    (1, '2023-07', 160, 'USD'),
    (1, '2023-08', 170, 'USD'),
    (1, '2023-09', 180, 'USD'),
    (1, '2023-10', 190, 'USD'),
    (1, '2023-11', 200, 'USD'),
    (1, '2023-12', 210, 'USD'),
    (1, '2024-01', 220, 'USD'),
    (1, '2024-02', 230, 'USD'),
    (1, '2024-03', 240, 'USD'),
    (1, '2024-04', 250, 'USD'),
    (1, '2024-05', 260, 'USD'),
    (1, '2024-06', 270, 'USD'),
    (1, '2024-07', 280, 'USD'),
    (1, '2024-08', 290, 'USD'),
    (1, '2024-09', 300, 'USD'),
    (1, '2024-10', 310, 'USD'),
    (1, '2024-11', 320, 'USD'),
    (1, '2024-12', 330, 'USD'),
    (2, '2023-01', 85, 'USD'), 
    (2, '2023-02', 90, 'USD'),
    (2, '2023-03', 95, 'USD'),
    (2, '2023-04', 100, 'USD'),
    (2, '2023-05', 105, 'USD'),
    (2, '2023-06', 110, 'USD'),
    (3, '2023-01', 150, 'USD'),
    (3, '2023-02', 165, 'USD'),
    (3, '2023-03', 180, 'USD'),
    (3, '2023-04', 195, 'USD'),
    (3, '2023-05', 210, 'USD'),
    (3, '2023-06', 225, 'USD'),
    (3, '2023-07', 240, 'USD'),
    (3, '2023-08', 255, 'USD'),
    (3, '2023-09', 270, 'USD'); 
`;

export async function getAllHomes(db: SQLiteDatabase): Promise<Home[]> {
    return (await db.getAllAsync<Home>('SELECT * from Home'))
        .map(parseHome)
        .filter(h => h !== null);
}

export async function getHome(db: SQLiteDatabase, id: number): Promise<Home | null> {
    return parseHome(await db.getFirstAsync<Home>('SELECT * FROM Home WHERE id = ?', [id]));
}

export async function insertHome(db: SQLiteDatabase, home: Home) {
    await db.runAsync(
        'INSERT INTO Home (name, address, electricity_code, shareholders, rent) VALUES (?, ?, ?, ?, ?)',
        [
            home.name,
            home.address,
            home.electricity_code,
            JSON.stringify(home.shareholders),
            home.rent ? JSON.stringify(home.rent) : null,
        ]
    );
}

export async function updateHome(db: SQLiteDatabase, home: Home) {
    await db.runAsync(
        'UPDATE Home SET name = ?, address = ?, electricity_code = ?, shareholders = ?, rent = ? WHERE id = ?',
        [
            home.name,
            home.address,
            home.electricity_code,
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
    return await db.getAllAsync<ElectricityBill>(
        'SELECT * FROM ElectricityBill WHERE home_id = ?',
        [homeId]
    );
}

export async function insertElectricityBill(
    db: SQLiteDatabase,
    homeId: number,
    bill: ElectricityBill
) {
    await db.runAsync(
        'INSERT INTO ElectricityBill (home_id, date, amount, currency) VALUES (?, ?, ?, ?)',
        [homeId, bill.date, bill.amount, bill.currency]
    );
}
