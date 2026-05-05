// index is the entry point for the application. It does not have a tab associated with it

import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Index() {
	return (
		<SafeAreaView className="flex-1 p-5 bg-background">
			<Text className="text-5xl font-sans-bold">Home</Text>

			<Link
				href="/onboarding"
				className="mt-4 rounded bg-primary text-white p-4 font-sans-bold"
			>
				Onboarding
			</Link>
			<Link
				href="/sign-in"
				className="mt-4 rounded bg-primary text-white p-4 font-sans-bold"
			>
				Sign In
			</Link>
			<Link
				href="/sign-up"
				className="mt-4 rounded bg-primary text-white p-4 font-sans-bold"
			>
				Sign Up
			</Link>
		</SafeAreaView>
	);
}
