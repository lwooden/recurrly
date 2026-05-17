import { Text, View } from "react-native";

export function AuthBrandHeader() {
	return (
		<View className="auth-brand-block">
			<View className="auth-logo-wrap">
				<View className="auth-logo-mark">
					<Text className="auth-logo-mark-text">R</Text>
				</View>
				<View>
					<Text className="auth-wordmark">Recurrly</Text>
					<Text className="auth-wordmark-sub">Subscription tracker</Text>
				</View>
			</View>
		</View>
	);
}
