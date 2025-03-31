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

export const HomeSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    address: z.string(),
    electricity_code: z.string(),
    shareholders: z.array(ShareholderSchema),
    rent: RentSchema.optional(),
});

export const ElectricityBillSchema = z.object({
    date: z.string(),
    amount: z.number(),
    currency: z.string(),
});

export type Home = z.infer<typeof HomeSchema>;
export type Shareholder = z.infer<typeof ShareholderSchema>;
export type Rent = z.infer<typeof RentSchema>;
export type Tenant = z.infer<typeof TenantSchema>;
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

export function parseHome(home: Home | null): Home | null {
    if (!home) {
        return null;
    }
    return {
        ...home,
        shareholders: home.shareholders
            ? JSON.parse(home.shareholders as unknown as string)
            : [{ name: '', shareValue: 0 }],
        rent: (home.rent ? JSON.parse(home.rent as unknown as string) : null) as Rent,
    };
}

export function getUpdatedHome(home: Home, shareholders: Shareholder[], rent: Rent): Home {
    const updatedShareholders: Shareholder[] = shareholders.map((shareholder, i) => ({
        name: shareholder.name.trim(),
        shareValue: parseFloat(shareholder.shareValue.toString()) || 0,
    }));

    const updatedRent: Rent = {
        tenant: { name: rent.tenant.name.trim() },
        price: {
            amount: parseFloat(rent.price.amount.toString()),
            currency: rent.price.currency.trim() || 'USD',
        },
        rentPaymentDuration: rent.rentPaymentDuration.trim() || 'Monthly',
        lastPaymentDate: rent.lastPaymentDate.trim() || '',
    };

    return {
        name: home.name.trim() || '',
        address: home.address.trim() || '',
        electricity_code: home.electricity_code.trim() || 'N/A',
        shareholders: updatedShareholders,
        rent: updatedRent,
    };
}
