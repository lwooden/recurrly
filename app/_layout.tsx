import "@/global.css";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import * as WebBrowser from "expo-web-browser";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { useFonts } from "expo-font";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (!publishableKey) {
	throw new Error(
		"Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to your environment (see .env.example).",
	);
}

WebBrowser.maybeCompleteAuthSession();

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	// Load fonts
	const [fontsLoaded, error] = useFonts({
		"sans-regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
		"sans-bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
		"sans-medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
		"sans-semibold": require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
		"sans-extra-bold": require("@/assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
		"sans-light": require("@/assets/fonts/PlusJakartaSans-Light.ttf"),
	});

	// When using preventAutoHideAsync(), you must call hideAsync() or the splash
	// stays forever (looks like the app never loads in Expo Go).
	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded && !error) {
		return null;
	}

	return (
		<ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
			<RootLayoutNav />
		</ClerkProvider>
	);
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();

	return (
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(tabs)" />
				<Stack.Screen name="(auth)" />
				<Stack.Screen name="onboarding" />
				<Stack.Screen name="subscriptions/[id]" />
			</Stack>
		</ThemeProvider>
	);
}
