import { sql } from '@/models/schema';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

async function initDatabase(db: SQLite.SQLiteDatabase) {
    await db.execAsync(sql);
}

export default function RootLayout() {
    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);

    return (
        <SQLiteProvider
            databaseName="homemanagement.db"
            onInit={async db => {
                await initDatabase(db);
            }}
        >
            <ThemeProvider value={DefaultTheme}>
                <Stack>
                    <Stack.Screen name="index" options={{ title: 'Home' }} />
                    <Stack.Screen
                        name="[id]"
                        options={{
                            title: 'Property Details',
                        }}
                    />
                    <Stack.Screen name="home/[index]" options={{ title: 'Edit Property' }} />
                </Stack>
                <StatusBar />
            </ThemeProvider>
        </SQLiteProvider>
    );
}
