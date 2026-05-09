import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { colors } from "@/constants/theme";

export default function AuthGroupLayout() {
	const { isSignedIn, isLoaded } = useAuth();

	if (!isLoaded) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<ActivityIndicator size="large" color={colors.accent} />
			</View>
		);
	}

	if (isSignedIn) {
		return <Redirect href="/(tabs)" />;
	}

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="sign-in" />
			<Stack.Screen name="sign-up" />
		</Stack>
	);
}
