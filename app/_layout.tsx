import { db } from '@/db/db';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import migrations from '../drizzle/migrations';
import '../global.css';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const { success, error } = useMigrations(db, migrations);

    useEffect(() => {
        if (!success) return;
        SplashScreen.hideAsync(); // TODO: success is false since no new migrations are found ???
    }, [success]);

    return (
        <ThemeProvider value={DefaultTheme}>
            <Stack>
                <Stack.Screen name="index" options={{ title: 'Home' }} />
                <Stack.Screen
                    name="[show_id]"
                    options={{
                        title: 'Property Details',
                    }}
                />
                <Stack.Screen name="home/[edit_id]" options={{ title: 'Edit Property' }} />
            </Stack>
            <StatusBar />
        </ThemeProvider>
    );
}
