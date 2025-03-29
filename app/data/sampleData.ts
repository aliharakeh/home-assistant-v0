import { Home } from '../models/models';

// Sample data for the home-assistant app
export const homes: Home[] = [
    {
        name: 'Sunset Villa',
        address: '123 Sunset Blvd, Los Angeles, CA 90001',
        shareholders: [
            { name: 'John Doe', shareValue: 60 },
            { name: 'Jane Smith', shareValue: 40 },
        ],
        rent: {
            price: 1500,
            tenant: { name: 'Robert Johnson' },
            rentPaymentDuration: 'monthly',
        },
        electricity: {
            addressCode: 'SV-123',
            bills: [
                { monthYear: '2023-01', payment: 120 },
                { monthYear: '2023-02', payment: 135 },
            ],
        },
    },
    {
        name: 'Mountain View Cottage',
        address: '456 Mountain Dr, Denver, CO 80201',
        shareholders: [
            { name: 'Alice Williams', shareValue: 50 },
            { name: 'Bob Brown', shareValue: 50 },
        ],
        rent: {
            price: 1200,
            tenant: { name: 'Charlie Davis' },
            rentPaymentDuration: 'quarterly',
        },
        electricity: {
            addressCode: 'MVC-456',
            bills: [
                { monthYear: '2023-01', payment: 95 },
                { monthYear: '2023-02', payment: 110 },
            ],
        },
    },
    {
        name: 'Lakeside Apartment',
        address: '789 Lake Ave, Chicago, IL 60601',
        shareholders: [
            { name: 'Emily White', shareValue: 70 },
            { name: 'Michael Green', shareValue: 30 },
        ],
        electricity: {
            addressCode: 'LA-789',
            bills: [
                { monthYear: '2023-01', payment: 85 },
                { monthYear: '2023-02', payment: 90 },
            ],
        },
    },
    {
        name: 'Downtown Loft',
        address: '101 Main St, New York, NY 10001',
        shareholders: [
            { name: 'David Miller', shareValue: 40 },
            { name: 'Sarah Wilson', shareValue: 30 },
            { name: 'James Taylor', shareValue: 30 },
        ],
        rent: {
            price: 2500,
            tenant: { name: 'Thomas Anderson' },
            rentPaymentDuration: 'monthly',
        },
        electricity: {
            addressCode: 'DL-101',
            bills: [
                { monthYear: '2023-01', payment: 150 },
                { monthYear: '2023-02', payment: 165 },
            ],
        },
    },
];
