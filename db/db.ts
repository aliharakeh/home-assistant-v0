import { ElectricityBill, Home } from '@/db/models';
import { desc, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import * as schema from './schema';
const DATABASE_NAME = 'home-management.db';

/**************************************************************************
 *
 * Initialize database connection
 *
 **************************************************************************/
export const expoSqlite = SQLite.openDatabaseSync(DATABASE_NAME);

export const db = drizzle(expoSqlite, { schema, logger: true });

/**************************************************************************
 *
 * DB Operations
 *
 **************************************************************************/

export async function getAllHomes() {
    try {
        return (await db.select().from(schema.HomeTable)) as Home[];
    } catch (error) {
        console.log('error getting all homes', error);
        return [];
    }
}

export async function getHome(id: number, withElectricityBills = false) {
    try {
        return (await db.query.HomeTable.findFirst({
            where: eq(schema.HomeTable.id, id),
            with: {
                electricityBills: withElectricityBills ? true : undefined,
            },
        })) as Home | null;
    } catch (error) {
        console.log('error getting home', error);
        return null;
    }
}

export async function deleteHome(id: number) {
    try {
        await db.delete(schema.HomeTable).where(eq(schema.HomeTable.id, id));
    } catch (error) {
        console.log('error deleting home', error);
    }
}

export async function insertHome(home: Home) {
    try {
        await db.insert(schema.HomeTable).values({
            name: home.name,
            address: home.address,
            electricity: home.electricity,
            shareholders: home.shareholders,
            rent: home.rent,
        });
    } catch (error) {
        console.log('error inserting home', error);
    }
}

export async function updateHome(home: Home) {
    try {
        await db
            .update(schema.HomeTable)
            .set({
                name: home.name,
                address: home.address,
                electricity: home.electricity,
                shareholders: home.shareholders,
                rent: home.rent,
            })
            .where(eq(schema.HomeTable.id, home.id!));
    } catch (error) {
        console.log('error updating home', error);
    }
}

export async function getElectricityBills(homeId: number): Promise<ElectricityBill[]> {
    try {
        const data = await db
            .select()
            .from(schema.ElectricityBillTable)
            .where(eq(schema.ElectricityBillTable.homeId, homeId))
            .orderBy(desc(schema.ElectricityBillTable.date))
            .limit(12);
        return data?.reverse() as ElectricityBill[];
    } catch (error) {
        console.log('error getting electricity bills', error);
        return [];
    }
}

export async function insertElectricityBill(homeId: number, bill: ElectricityBill) {
    try {
        await db.insert(schema.ElectricityBillTable).values({
            homeId,
            date: bill.date,
            amount: bill.amount,
            subsription_type: bill.subsription_type,
        });
    } catch (error) {
        console.log('error inserting bill', error);
    }
}
