import SubscriptionCard from "@/components/SubscriptionCard";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { colors } from "@/constants/theme";
import { styled } from "nativewind";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

/** Delay before applying the filter so rapid typing does not re-filter on every keystroke. */
const SEARCH_DEBOUNCE_MS = 300;

function subscriptionMatchesQuery(sub: Subscription, q: string): boolean {
	const fields: (string | undefined)[] = [
		sub.name,
		sub.category,
		sub.plan,
		sub.status,
		sub.billing,
		sub.paymentMethod,
	];
	return fields.some((f) => f?.toLowerCase().includes(q));
}

export default function Subscriptions() {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
	const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
		string | null
	>(null);

	useEffect(() => {
		const id = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, SEARCH_DEBOUNCE_MS);
		return () => clearTimeout(id);
	}, [searchQuery]);

	const filteredSubscriptions = useMemo(() => {
		const q = debouncedSearchQuery.trim().toLowerCase();
		if (!q) {
			return HOME_SUBSCRIPTIONS;
		}
		return HOME_SUBSCRIPTIONS.filter((s) => subscriptionMatchesQuery(s, q));
	}, [debouncedSearchQuery]);

	useEffect(() => {
		if (
			expandedSubscriptionId &&
			!filteredSubscriptions.some((s) => s.id === expandedSubscriptionId)
		) {
			setExpandedSubscriptionId(null);
		}
	}, [filteredSubscriptions, expandedSubscriptionId]);

	const hasActiveSearch = debouncedSearchQuery.trim().length > 0;

	return (
		<SafeAreaView className="flex-1 p-5 bg-background">
			<Text className="mb-4 text-2xl font-sans-bold text-primary">Subscriptions</Text>
			<TextInput
				className="auth-input mb-5"
				value={searchQuery}
				onChangeText={setSearchQuery}
				placeholder="Search subscriptions..."
				placeholderTextColor={colors.mutedForeground}
				autoCorrect={false}
				autoCapitalize="none"
				returnKeyType="search"
			/>
			<FlatList
				className="flex-1"
				data={filteredSubscriptions}
				renderItem={({ item }) => (
					<SubscriptionCard
						{...item}
						expanded={expandedSubscriptionId === item.id}
						onPress={() =>
							setExpandedSubscriptionId((currentId) =>
								currentId === item.id ? null : item.id,
							)
						}
					/>
				)}
				keyExtractor={(item) => item.id}
				showsVerticalScrollIndicator={false}
				extraData={expandedSubscriptionId}
				ItemSeparatorComponent={() => <View className="h-4" />}
				ListEmptyComponent={
					<Text className="home-empty-state">
						{hasActiveSearch
							? "No matching subscriptions"
							: "No subscriptions found"}
					</Text>
				}
				contentContainerClassName="pb-20"
			/>
		</SafeAreaView>
	);
}
