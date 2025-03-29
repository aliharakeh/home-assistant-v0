// Interfaces representing the home management data model

export interface Shareholder {
    name: string;
    shareValue: number; // Percentage or actual share value
}

export interface ElectricityBill {
    monthYear: string; // Format could be "YYYY-MM"
    payment: number;
}

export interface Tenant {
    name: string;
}

export interface Rent {
    price: number;
    tenant: Tenant;
    rentPaymentDuration: string; // e.g., "monthly", "yearly", etc.
}

export interface Electricity {
    addressCode: string;
    bills: ElectricityBill[];
}

export interface Home {
    name: string;
    address: string;
    rent?: Rent; // Optional as not all homes might be rented
    shareholders: Shareholder[];
    electricity: Electricity;
}
