import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    return (
        <ThemeProvider value={DefaultTheme}>
            <Stack>
                <Stack.Screen name="index" options={{ title: 'Home' }} />
                <Stack.Screen
                    name="[id]"
                    options={{
                        title: 'Property Details',
                        headerBackTitle: 'Back',
                    }}
                />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="dark" />
        </ThemeProvider>
    );
}
