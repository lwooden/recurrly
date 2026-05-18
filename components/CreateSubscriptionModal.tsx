import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import clsx from "clsx";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from "react-native";

const CATEGORIES = [
	"Entertainment",
	"AI Tools",
	"Developer Tools",
	"Design",
	"Productivity",
	"Cloud",
	"Music",
	"Other",
] as const;

type Category = (typeof CATEGORIES)[number];
type Frequency = "Monthly" | "Yearly";

const CATEGORY_COLORS: Record<Category, string> = {
	Entertainment: "#f8b4c4",
	"AI Tools": "#b8d4e3",
	"Developer Tools": "#e8def8",
	Design: "#f5c542",
	Productivity: "#fde68a",
	Cloud: "#bfdbfe",
	Music: "#86efac",
	Other: "#e5e7eb",
};

interface CreateSubscriptionModalProps {
	visible: boolean;
	onClose: () => void;
	onCreate: (subscription: Subscription) => void;
}

const defaultForm = () => ({
	name: "",
	price: "",
	frequency: "Monthly" as Frequency,
	category: "Entertainment" as Category,
});

function parsePositivePrice(value: string): number | null {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const parsed = Number.parseFloat(trimmed);
	if (!Number.isFinite(parsed) || parsed <= 0) return null;
	return parsed;
}

export default function CreateSubscriptionModal({
	visible,
	onClose,
	onCreate,
}: CreateSubscriptionModalProps) {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [frequency, setFrequency] = useState<Frequency>("Monthly");
	const [category, setCategory] = useState<Category>("Entertainment");

	const resetForm = useCallback(() => {
		const defaults = defaultForm();
		setName(defaults.name);
		setPrice(defaults.price);
		setFrequency(defaults.frequency);
		setCategory(defaults.category);
	}, []);

	useEffect(() => {
		if (!visible) {
			resetForm();
		}
	}, [visible, resetForm]);

	const isValid = useMemo(() => {
		return name.trim().length > 0 && parsePositivePrice(price) !== null;
	}, [name, price]);

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleSubmit = () => {
		const parsedPrice = parsePositivePrice(price);
		if (!name.trim() || parsedPrice === null) return;

		const startDate = dayjs().toISOString();
		const renewalDate =
			frequency === "Yearly"
				? dayjs().add(1, "year").toISOString()
				: dayjs().add(1, "month").toISOString();

		const subscription: Subscription = {
			id: `subscription-${Date.now()}`,
			name: name.trim(),
			price: parsedPrice,
			category,
			status: "active",
			startDate,
			renewalDate,
			icon: icons.wallet,
			billing: frequency,
			color: CATEGORY_COLORS[category],
			currency: "USD",
		};

		onCreate(subscription);
		resetForm();
		onClose();
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={handleClose}
		>
			<KeyboardAvoidingView
				className="flex-1"
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<View className="modal-overlay">
					<Pressable className="flex-1" onPress={handleClose} />
					<View className="modal-container">
						<View className="modal-header">
							<Text className="modal-title">New Subscription</Text>
							<Pressable
								onPress={handleClose}
								className="modal-close"
								accessibilityRole="button"
								accessibilityLabel="Close"
							>
								<Text className="modal-close-text">×</Text>
							</Pressable>
						</View>

						<ScrollView
							keyboardShouldPersistTaps="handled"
							showsVerticalScrollIndicator={false}
						>
							<View className="modal-body">
								<View className="auth-field">
									<Text className="auth-label">Name</Text>
									<TextInput
										className="auth-input"
										value={name}
										onChangeText={setName}
										placeholder="Netflix, Spotify..."
										placeholderTextColor={colors.mutedForeground}
										autoCapitalize="words"
										returnKeyType="next"
									/>
								</View>

								<View className="auth-field">
									<Text className="auth-label">Price</Text>
									<TextInput
										className="auth-input"
										value={price}
										onChangeText={setPrice}
										placeholder="9.99"
										placeholderTextColor={colors.mutedForeground}
										keyboardType="decimal-pad"
										returnKeyType="done"
									/>
								</View>

								<View className="auth-field">
									<Text className="auth-label">Frequency</Text>
									<View className="picker-row">
										{(["Monthly", "Yearly"] as const).map((option) => (
											<Pressable
												key={option}
												onPress={() => setFrequency(option)}
												className={clsx(
													"picker-option",
													frequency === option && "picker-option-active",
												)}
											>
												<Text
													className={clsx(
														"picker-option-text",
														frequency === option &&
															"picker-option-text-active",
													)}
												>
													{option}
												</Text>
											</Pressable>
										))}
									</View>
								</View>

								<View className="auth-field">
									<Text className="auth-label">Category</Text>
									<View className="category-scroll">
										{CATEGORIES.map((option) => (
											<Pressable
												key={option}
												onPress={() => setCategory(option)}
												className={clsx(
													"category-chip",
													category === option && "category-chip-active",
												)}
											>
												<Text
													className={clsx(
														"category-chip-text",
														category === option &&
															"category-chip-text-active",
													)}
												>
													{option}
												</Text>
											</Pressable>
										))}
									</View>
								</View>

								<Pressable
									onPress={handleSubmit}
									disabled={!isValid}
									className={clsx(
										"auth-button",
										!isValid && "auth-button-disabled",
									)}
								>
									<Text className="auth-button-text">Add Subscription</Text>
								</Pressable>
							</View>
						</ScrollView>
					</View>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}
