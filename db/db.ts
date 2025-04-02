import { ElectricityBill, Home } from '@/db/models';
import { tryCatch } from '@/utils/tryCatch';
import { desc, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite/driver';
import * as SQLite from 'expo-sqlite';
import * as schema from './schema';
const DATABASE_NAME = 'home-management.db';

/**************************************************************************
 *
 * Initialize database connection
 *
 **************************************************************************/
const expo = SQLite.openDatabaseSync(DATABASE_NAME);

export const db = drizzle(expo, { schema, logger: true });

/**************************************************************************
 *
 * DB Operations
 *
 **************************************************************************/

export async function getAllHomes() {
    return await tryCatch(async () => {
        return (await db.select().from(schema.HomeTable)) as Home[];
    });
}

export async function getHome(id: number, withElectricityBills = false) {
    return await tryCatch(async () => {
        return await db.query.HomeTable.findFirst({
            where: eq(schema.HomeTable.id, id),
            with: {
                electricityBills: withElectricityBills ? true : undefined,
            },
        });
    });
}

export async function insertHome(home: Home) {
    tryCatch(async () => {
        await db.insert(schema.HomeTable).values({
            name: home.name,
            address: home.address,
            electricity: home.electricity,
            shareholders: home.shareholders,
            rent: home.rent,
        });
    });
}

export async function updateHome(home: Home) {
    tryCatch(async () => {
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
    });
}

export async function getElectricityBills(homeId: number): Promise<ElectricityBill[]> {
    const data = await tryCatch(async () => {
        return await db
            .select()
            .from(schema.ElectricityBillTable)
            .where(eq(schema.ElectricityBillTable.homeId, homeId))
            .orderBy(desc(schema.ElectricityBillTable.date))
            .limit(12);
    });
    return data?.reverse() as ElectricityBill[];
}

export async function insertElectricityBill(homeId: number, bill: ElectricityBill) {
    tryCatch(async () => {
        await db.insert(schema.ElectricityBillTable).values({
            homeId,
            date: bill.date,
            amount: bill.amount,
            subsription_type: bill.subsription_type,
        });
    });
}
