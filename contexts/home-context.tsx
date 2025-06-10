'use client';

import type { ElectricityBill, Home } from '@/lib/data';
import { homes as initialHomes } from '@/lib/data';
import * as db from '@/lib/db';
import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type HomeContextType = {
    homes: Home[];
    loading: boolean;
    error: string | null;
    getHomeById: (id: string) => Home | undefined;
    addHome: (home: Home) => Promise<void>;
    updateHome: (home: Home) => Promise<void>;
    deleteHome: (name: string) => Promise<void>;
    addBillToHome: (homeName: string, bill: Omit<ElectricityBill, 'id'>) => Promise<void>;
    deleteBillFromHome: (homeName: string, billId: string) => Promise<void>;
    deleteBillsInDateRange: (homeName: string, startDate: Date, endDate: Date) => Promise<number>;
};

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export function HomeProvider({ children }: { children: React.ReactNode }) {
    const [homes, setHomes] = useState<Home[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize the database and load homes
    useEffect(() => {
        async function initializeData() {
            try {
                setLoading(true);

                // Initialize the database
                await db.initDB();

                // Seed initial data if the database is empty
                await db.seedInitialData(initialHomes);

                // Load all homes from the database
                const loadedHomes = await db.getAllHomes();
                setHomes(loadedHomes);

                setLoading(false);
            } catch (err) {
                console.error('Failed to initialize database:', err);
                setError('Failed to load data. Please try again.');
                setLoading(false);
            }
        }

        initializeData();
    }, []);

    const getHomeById = (id: string): Home | undefined => {
        return homes.find(home => home.id === id);
    };

    const addHome = async (home: Home): Promise<void> => {
        try {
            await db.addHome(home);
            setHomes(prevHomes => [...prevHomes, home]);
        } catch (err) {
            console.error('Failed to add home:', err);
            setError('Failed to add home. Please try again.');
            throw err;
        }
    };

    const updateHome = async (updatedHome: Home): Promise<void> => {
        try {
            await db.updateHome(updatedHome);
            setHomes(prevHomes =>
                prevHomes.map(home => (home.name === updatedHome.name ? updatedHome : home))
            );
        } catch (err) {
            console.error('Failed to update home:', err);
            setError('Failed to update home. Please try again.');
            throw err;
        }
    };

    const deleteHome = async (name: string): Promise<void> => {
        try {
            await db.deleteHome(name);
            setHomes(prevHomes => prevHomes.filter(home => home.name !== name));
        } catch (err) {
            console.error('Failed to delete home:', err);
            setError('Failed to delete home. Please try again.');
            throw err;
        }
    };

    const addBillToHome = async (
        homeName: string,
        bill: Omit<ElectricityBill, 'id'>
    ): Promise<void> => {
        try {
            await db.addBillToHome(homeName, bill);

            // Update the local state
            setHomes(prevHomes =>
                prevHomes.map(home => {
                    if (home.name === homeName) {
                        const newBill: ElectricityBill = {
                            ...bill,
                            id: `bill-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                        };
                        return {
                            ...home,
                            electricityBills: [...home.electricityBills, newBill],
                        };
                    }
                    return home;
                })
            );
        } catch (err) {
            console.error('Failed to add bill:', err);
            setError('Failed to add bill. Please try again.');
            throw err;
        }
    };

    const deleteBillFromHome = async (homeName: string, billId: string): Promise<void> => {
        try {
            await db.deleteBillFromHome(homeName, billId);

            // Update the local state
            setHomes(prevHomes =>
                prevHomes.map(home => {
                    if (home.name === homeName) {
                        return {
                            ...home,
                            electricityBills: home.electricityBills.filter(
                                bill => bill.id !== billId
                            ),
                        };
                    }
                    return home;
                })
            );
        } catch (err) {
            console.error('Failed to delete bill:', err);
            setError('Failed to delete bill. Please try again.');
            throw err;
        }
    };

    const deleteBillsInDateRange = async (
        homeName: string,
        startDate: Date,
        endDate: Date
    ): Promise<number> => {
        try {
            // Get the home
            const home = getHomeById(homeName);
            if (!home) {
                throw new Error(`Home with name ${homeName} not found`);
            }

            // Filter bills that fall within the date range
            const billsToDelete = home.electricityBills.filter(bill => {
                const billDate = new Date(bill.date);
                return billDate >= startDate && billDate <= endDate;
            });

            if (billsToDelete.length === 0) {
                return 0;
            }

            // Create a new home object with the filtered bills
            const updatedHome = {
                ...home,
                electricityBills: home.electricityBills.filter(bill => {
                    const billDate = new Date(bill.date);
                    return billDate < startDate || billDate > endDate;
                }),
            };

            // Update the database
            await db.updateHome(updatedHome);

            // Update the local state
            setHomes(prevHomes =>
                prevHomes.map(home => {
                    if (home.name === homeName) {
                        return updatedHome;
                    }
                    return home;
                })
            );

            return billsToDelete.length;
        } catch (err) {
            console.error('Failed to delete bills in date range:', err);
            setError('Failed to delete bills. Please try again.');
            throw err;
        }
    };

    return (
        <HomeContext.Provider
            value={{
                homes,
                loading,
                error,
                getHomeById,
                addHome,
                updateHome,
                deleteHome,
                addBillToHome,
                deleteBillFromHome,
                deleteBillsInDateRange,
            }}
        >
            {children}
        </HomeContext.Provider>
    );
}

export function useHomes() {
    const context = useContext(HomeContext);
    if (context === undefined) {
        throw new Error('useHomes must be used within a HomeProvider');
    }
    return context;
}
