// index is the entry point for the application. It does not have a tab associated with it

import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import {
	HOME_BALANCE,
	HOME_SUBSCRIPTIONS,
	HOME_USER,
	UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import image from "@/constants/image";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { styled } from "nativewind";
import React, { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Index() {
	const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
		string | null
	>(null);
	return (
		<SafeAreaView className="flex-1 p-5 bg-background">
			{/* The ListHeaderComponent Prop makes the entire screen scrollable */}
			<FlatList
				ListHeaderComponent={() => (
					<>
						<View className="home-header">
							<View className="home-user">
								<Image source={image.avatar} className="home-avatar" />
								<Text className="home-user-name">{HOME_USER.name}</Text>
							</View>
							<Image source={icons.add} className="home-add-icon" />
						</View>
						<View className="home-balance-card">
							<Text className="home-balance-label">Balance</Text>
							<View className="home-balance-row">
								<Text className="home-balance-amount">
									{formatCurrency(HOME_BALANCE.amount)}
								</Text>
								<Text className="home-balance-date">
									{dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
								</Text>
							</View>
						</View>
						<View className="mb-5">
							<ListHeading title="Upcoming" />
							{/* <UpcomingSubscriptionCard data={UPCOMING_SUBSCRIPTIONS[0]} /> */}
							<FlatList
								data={UPCOMING_SUBSCRIPTIONS}
								renderItem={({ item }) => (
									<UpcomingSubscriptionCard {...item} />
								)}
								keyExtractor={(item) => item.id}
								horizontal
								showsHorizontalScrollIndicator={false}
								ListEmptyComponent={
									<View className="upcoming-empty">
										<Text className="home-empty-state">
											No upcoming subscriptions
										</Text>
									</View>
								}
							/>
						</View>
						<ListHeading title="All Subscriptions" />
					</>
				)}
				data={HOME_SUBSCRIPTIONS}
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
					<Text className="home-empty-state">No subscriptions found</Text>
				}
				// Provides Padding at the bottom of the list to prevent the content from being cut off by the bottom of the screen
				contentContainerClassName="pb-20"
			/>
			{/* <SubscriptionCard
					{...HOME_SUBSCRIPTIONS[0]}
					expanded={expandedSubscriptionId === HOME_SUBSCRIPTIONS[0].id}
					onPress={() =>
						setExpandedSubscriptionId((currentId) =>
							currentId === HOME_SUBSCRIPTIONS[0].id
								? null
								: HOME_SUBSCRIPTIONS[0].id,
						)
					}
				/> */}
		</SafeAreaView>
	);
}
