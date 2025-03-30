import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <ThemeProvider value={DefaultTheme}>
            <Stack>
                <Stack.Screen name="index" options={{ title: 'Home' }} />
                <Stack.Screen
                    name="[id]"
                    options={{
                        title: 'Property Details',
                    }}
                />
                <Stack.Screen name="edit/[index]" options={{ title: 'Edit Property' }} />
            </Stack>
            <StatusBar />
        </ThemeProvider>
    );
}
