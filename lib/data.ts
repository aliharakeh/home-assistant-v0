// Mock data - in a real app, this would come from a database
export interface Shareholder {
    name: string
    amount: number
    isPercentage: boolean
}

export type RentDuration = 'monthly' | 'yearly'

export type SubscriptionType = 'main' | 'motor'

export interface ElectricityBill {
    id: string
    subscriptionType: SubscriptionType
    amount: number
    date: string // ISO date string
    notes?: string
}

export interface Home {
    name: string
    address: string
    tenant: string
    rent: number
    rentDuration: RentDuration
    electricityCode: string
    shareholders: Shareholder[]
    electricityBills: ElectricityBill[]
}

export const homes: Home[] = [
    {
        name: 'Sunset Villa',
        address: '123 Sunset Blvd, Los Angeles, CA 90001',
        tenant: 'John Smith',
        rent: 2500,
        rentDuration: 'monthly',
        electricityCode: 'EL-12345',
        shareholders: [
            { name: 'Jane Doe', amount: 50, isPercentage: true },
            { name: 'Mike Johnson', amount: 25, isPercentage: true },
        ],
        electricityBills: [
            {
                id: 'bill-1',
                subscriptionType: 'main',
                amount: 125.5,
                date: '2025-01-15',
            },
            {
                id: 'bill-2',
                subscriptionType: 'main',
                amount: 142.75,
                date: '2025-02-15',
            },
            {
                id: 'bill-3',
                subscriptionType: 'motor',
                amount: 35.2,
                date: '2025-03-15',
            },
            {
                id: 'bill-4',
                subscriptionType: 'main',
                amount: 156.3,
                date: '2025-04-15',
                notes: 'Higher than usual, check for issues',
            },
        ],
    },
    {
        name: 'Ocean View Apartment',
        address: '456 Beach Road, Miami, FL 33101',
        tenant: 'Sarah Williams',
        rent: 1800,
        rentDuration: 'monthly',
        electricityCode: 'EL-67890',
        shareholders: [{ name: 'Robert Brown', amount: 1000, isPercentage: false }],
        electricityBills: [
            {
                id: 'bill-5',
                subscriptionType: 'main',
                amount: 98.45,
                date: '2025-01-10',
            },
            {
                id: 'bill-6',
                subscriptionType: 'main',
                amount: 105.3,
                date: '2025-02-10',
            },
            {
                id: 'bill-7',
                subscriptionType: 'motor',
                amount: 28.15,
                date: '2025-03-10',
                notes: 'Tenant requested extension',
            },
        ],
    },
    {
        name: 'Mountain Retreat',
        address: '789 Pine Street, Denver, CO 80201',
        tenant: 'Emily Davis',
        rent: 22000,
        rentDuration: 'yearly',
        electricityCode: 'EL-24680',
        shareholders: [],
        electricityBills: [
            {
                id: 'bill-8',
                subscriptionType: 'main',
                amount: 345.75,
                date: '2025-01-20',
            },
            {
                id: 'bill-9',
                subscriptionType: 'main',
                amount: 362.4,
                date: '2025-02-20',
            },
            {
                id: 'bill-10',
                subscriptionType: 'motor',
                amount: 89.25,
                date: '2025-03-20',
            },
            {
                id: 'bill-11',
                subscriptionType: 'main',
                amount: 410.6,
                date: '2025-04-20',
            },
        ],
    },
]

export function getHomeByName(name: string): Home | undefined {
    return homes.find(home => home.name === name)
}

export function formatShareholderAmount(shareholder: Shareholder): string {
    if (shareholder.isPercentage) {
        return `${shareholder.amount}%`
    } else {
        return `$${shareholder.amount}`
    }
}

export function formatRent(rent: number, duration: string): string {
    return `$${rent} / ${duration}`
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date)
}

export function getSubscriptionTypeLabel(type: SubscriptionType, t?: (key: string) => string): string {
    if (t) {
        return t(type) // Use translated string if translation function is provided
    }
    
    // Fallback to English if no translation function is provided
    switch (type) {
        case 'main':
            return 'Main'
        case 'motor':
            return 'Motor'
        default:
            return type
    }
}

export function calculateTotalBills(bills: ElectricityBill[]): {
    total: number
    main: number
    motor: number
} {
    return bills.reduce(
        (acc, bill) => {
            acc.total += bill.amount
            if (bill.subscriptionType === 'main') {
                acc.main += bill.amount
            } else if (bill.subscriptionType === 'motor') {
                acc.motor += bill.amount
            }
            return acc
        },
        { total: 0, main: 0, motor: 0 }
    )
}
