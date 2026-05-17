import { useClerk } from "@clerk/expo";
import { styled } from "nativewind";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Settings() {
	const { signOut } = useClerk();

	return (
		<SafeAreaView className="flex-1 p-5 bg-background">
			<Text className="text-2xl font-sans-bold text-primary">Settings</Text>
			<View className="mt-8">
				<Pressable
					onPress={() => signOut()}
					className="items-center rounded-2xl border border-border bg-card py-4"
				>
					<Text className="text-base font-sans-semibold text-destructive">
						Log out
					</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
