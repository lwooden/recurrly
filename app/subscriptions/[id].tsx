import { colors } from "@/constants/theme";
import { useAuth } from "@clerk/expo";
import { Link, Redirect, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

const SubscriptionDetails = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { isSignedIn, isLoaded } = useAuth();

	if (!isLoaded) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<ActivityIndicator size="large" color={colors.accent} />
			</View>
		);
	}

	if (!isSignedIn) {
		return <Redirect href="/(auth)/sign-in" />;
	}

	return (
		<View className="flex-1 bg-background p-5">
			<Text className="text-lg font-sans-bold text-primary">
				Subscription Details: {id}
			</Text>
			<Link href="/" asChild>
				<Pressable className="mt-4">
					<Text className="text-base font-sans-semibold text-accent">
						Go back
					</Text>
				</Pressable>
			</Link>
		</View>
	);
};

export default SubscriptionDetails;
