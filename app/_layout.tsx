import { db } from '@/db/db';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import migrations from '../drizzle/migrations';
import '../global.css';
import '../i18n/i18n.config';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const { success, error } = useMigrations(db, migrations);
    const { t } = useTranslation();

    useEffect(() => {
        if (!success) return;
        SplashScreen.hideAsync(); // TODO: success is false since no new migrations are found ???
    }, [success]);

    return (
        <ThemeProvider value={DefaultTheme}>
            <Stack>
                <Stack.Screen name="index" options={{ title: t('Home') }} />
                <Stack.Screen
                    name="[show_id]"
                    options={{
                        title: t('Property Details'),
                    }}
                />
                <Stack.Screen name="home/[edit_id]" options={{ title: t('Edit Property') }} />
            </Stack>
            <StatusBar />
        </ThemeProvider>
    );
}
