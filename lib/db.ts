import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ElectricityBill, Home } from './data';

interface HomeAssistantDB extends DBSchema {
    homes: {
        key: string;
        value: Home;
        indexes: {
            'by-name': string;
        };
    };
}

const DB_NAME = 'home-assistant-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<HomeAssistantDB>> | null = null;

export async function initDB() {
    if (!dbPromise) {
        dbPromise = openDB<HomeAssistantDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                // Create a store of objects
                const homeStore = db.createObjectStore('homes', {
                    // The 'name' property of the object will be the key
                    keyPath: 'name',
                });

                // Create an index on the 'name' property of the objects
                homeStore.createIndex('by-name', 'name');
            },
        });
    }

    return dbPromise;
}

export async function getAllHomes(): Promise<Home[]> {
    const db = await initDB();
    return db.getAll('homes');
}

export async function getHomeByName(name: string): Promise<Home | undefined> {
    const db = await initDB();
    return db.get('homes', name);
}

export async function addHome(home: Home): Promise<string> {
    const db = await initDB();
    await db.put('homes', home);
    return home.name;
}

export async function updateHome(home: Home): Promise<string> {
    const db = await initDB();
    await db.put('homes', home);
    return home.name;
}

export async function deleteHome(name: string): Promise<void> {
    const db = await initDB();
    await db.delete('homes', name);
}

export async function addBillToHome(
    homeName: string,
    bill: Omit<ElectricityBill, 'id'>
): Promise<string> {
    const db = await initDB();
    const home = await db.get('homes', homeName);

    if (!home) {
        throw new Error(`Home with name ${homeName} not found`);
    }

    const newBill: ElectricityBill = {
        ...bill,
        id: `bill-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };

    home.electricityBills = [...home.electricityBills, newBill];
    await db.put('homes', home);

    return newBill.id;
}

export async function deleteBillFromHome(homeName: string, billId: string): Promise<void> {
    const db = await initDB();
    const home = await db.get('homes', homeName);

    if (!home) {
        throw new Error(`Home with name ${homeName} not found`);
    }

    home.electricityBills = home.electricityBills.filter(bill => bill.id !== billId);
    await db.put('homes', home);
}

export async function seedInitialData(initialHomes: Home[]): Promise<void> {
    const db = await initDB();
    const existingHomes = await db.getAll('homes');

    // clear data
    // await db.clear('homes');

    // Only seed if the database is empty
    if (existingHomes.length === 0) {
        const tx = db.transaction('homes', 'readwrite');
        for (const home of initialHomes) {
            await tx.store.add(home);
        }
        await tx.done;
    }
}
