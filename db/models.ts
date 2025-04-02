import { Alert } from 'react-native';
import { z } from 'zod';

export const TenantSchema = z.object({
    name: z.string(),
});

export const ShareholderSchema = z.object({
    name: z.string(),
    shareValue: z.number(),
});

export const RentSchema = z.object({
    price: z.object({
        amount: z.number(),
        currency: z.string(),
    }),
    tenant: TenantSchema,
    rentPaymentDuration: z.string(),
    lastPaymentDate: z.string(),
});

export const ElectricitySchema = z.object({
    clock_code: z.string(),
    subsriptions: z.array(
        z.object({
            name: z.string(),
            currency: z.string(),
        })
    ),
});

export const ElectricityBillSchema = z.object({
    id: z.number().optional(),
    homeId: z.number().optional(),
    date: z.string(),
    amount: z.number(),
    subsription_type: z.string(),
});

export const HomeSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    address: z.string(),
    electricity: ElectricitySchema,
    shareholders: z.array(ShareholderSchema),
    rent: RentSchema,
    electricityBills: z.array(ElectricityBillSchema).optional(),
});

export type Home = z.infer<typeof HomeSchema>;
export type Shareholder = z.infer<typeof ShareholderSchema>;
export type Rent = z.infer<typeof RentSchema>;
export type Tenant = z.infer<typeof TenantSchema>;
export type Electricity = z.infer<typeof ElectricitySchema>;
export type ElectricityBill = z.infer<typeof ElectricityBillSchema>;

export function validateHome(home: Home): Home | null {
    const result = HomeSchema.safeParse(home);
    if (!result.success) {
        Alert.alert('Error', result.error.errors.map(error => error.message).join('\n'));
        return null;
    }
    return result.data;
}

export function validateElectricityBill(bill: ElectricityBill): ElectricityBill | null {
    const result = ElectricityBillSchema.safeParse(bill);
    if (!result.success) {
        Alert.alert('Error', result.error.errors.map(error => error.message).join('\n'));
        return null;
    }
    return result.data;
}

export function getUpdatedHome(home: Home): Home {
    const updatedElectricity: Electricity = {
        clock_code: home.electricity.clock_code.trim() || '',
        subsriptions: home.electricity.subsriptions.map(subsription => ({
            name: subsription.name.trim(),
            currency: subsription.currency.trim() || '$',
        })),
    };

    const updatedShareholders: Shareholder[] = home.shareholders.map((shareholder, i) => ({
        name: shareholder.name.trim(),
        shareValue: parseFloat(shareholder.shareValue.toString()) || 0,
    }));

    const updatedRent: Rent = {
        tenant: { name: home.rent.tenant.name.trim() },
        price: {
            amount: parseFloat(home.rent.price.amount.toString()),
            currency: home.rent.price.currency.trim() || '$',
        },
        rentPaymentDuration: home.rent.rentPaymentDuration.trim() || 'Monthly',
        lastPaymentDate: home.rent.lastPaymentDate.trim() || '',
    };

    return {
        id: home.id,
        name: home.name.trim() || '',
        address: home.address.trim() || '',
        electricity: updatedElectricity,
        shareholders: updatedShareholders,
        rent: updatedRent,
    };
}
