import { relations } from 'drizzle-orm';
import { int, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { Electricity, Rent, Shareholder } from './models';

export const HomeTable = sqliteTable('home', {
    id: int('id').primaryKey({ autoIncrement: true }),
    name: text('name'),
    address: text('address'),
    electricity: text('electricity', { mode: 'json' }).$type<Electricity>(),
    shareholders: text('shareholders', { mode: 'json' }).$type<Shareholder[]>(),
    rent: text('rent', { mode: 'json' }).$type<Rent>(),
});

export const ElectricityBillTable = sqliteTable('electricity_bill', {
    id: int('id').primaryKey({ autoIncrement: true }),
    homeId: int('homeId').references(() => HomeTable.id, { onDelete: 'cascade' }),
    date: int('date'),
    amount: real('amount'),
    subsription_type: text('subsription_type'),
});

export const homeRelations = relations(HomeTable, ({ many }: any) => ({
    electricityBills: many(ElectricityBillTable),
}));

export const electricityBillRelations = relations(ElectricityBillTable, ({ one }: any) => ({
    home: one(HomeTable, {
        fields: [ElectricityBillTable.homeId],
        references: [HomeTable.id],
    }),
}));
