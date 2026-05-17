import { AuthBrandHeader } from "@/components/auth/AuthBrandHeader";
import { createPostAuthNavigate } from "@/lib/auth-navigation";
import { useAuth, useSSO } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import { useCallback, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/constants/theme";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignUpScreen() {
	const router = useRouter();
	const { isSignedIn, isLoaded: authLoaded } = useAuth();
	const { startSSOFlow } = useSSO();

	const [oauthError, setOauthError] = useState<string | null>(null);
	const [oauthBusy, setOauthBusy] = useState(false);

	const navigate = useMemo(() => createPostAuthNavigate(router), [router]);

	const clearOauthError = useCallback(() => {
		setOauthError(null);
	}, []);

	const onGoogleSignUp = async () => {
		clearOauthError();
		setOauthBusy(true);
		try {
			const { createdSessionId, setActive, authSessionResult } =
				await startSSOFlow({
					strategy: "oauth_google",
				});

			if (
				authSessionResult?.type === "cancel" ||
				authSessionResult?.type === "dismiss"
			) {
				return;
			}

			if (!createdSessionId || !setActive) {
				setOauthError("Could not finish signing up. Please try again.");
				return;
			}

			await setActive({
				session: createdSessionId,
				navigate,
			});
		} catch {
			setOauthError("Something went wrong. Please try again.");
		} finally {
			setOauthBusy(false);
		}
	};

	if (!authLoaded) {
		return (
			<SafeAreaView className="auth-safe-area">
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color={colors.accent} />
				</View>
			</SafeAreaView>
		);
	}

	if (isSignedIn) {
		return null;
	}

	return (
		<SafeAreaView className="auth-safe-area">
			<ScrollView
				className="auth-scroll"
				keyboardShouldPersistTaps="handled"
				contentContainerClassName="auth-content"
			>
				<AuthBrandHeader />
				<Text className="auth-title">Create your account</Text>
				<Text className="auth-subtitle">
					Use your Google account to save subscriptions and track renewals.
				</Text>

				<View className="auth-card">
					<View className="auth-form">
						{oauthError ? (
							<Text className="auth-error text-center">{oauthError}</Text>
						) : null}

						<Pressable
							disabled={oauthBusy}
							onPress={onGoogleSignUp}
							className={`auth-button flex-row justify-center gap-3 ${oauthBusy ? "auth-button-disabled" : ""}`}
						>
							{oauthBusy ? (
								<ActivityIndicator color={colors.primary} />
							) : (
								<>
									<Ionicons
										name="logo-google"
										size={22}
										color={colors.primary}
									/>
									<Text className="auth-button-text">Continue with Google</Text>
								</>
							)}
						</Pressable>
					</View>
				</View>

				<View className="auth-link-row">
					<Text className="auth-link-copy">Already have an account?</Text>
					<Link href="/(auth)/sign-in" asChild>
						<Pressable>
							<Text className="auth-link">Log in</Text>
						</Pressable>
					</Link>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
