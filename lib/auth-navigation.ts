import * as Linking from "expo-linking";
import type { Href, Router } from "expo-router";

type FinalizeSession = {
	currentTask?: { key: string };
} | null;

/**
 * Navigation handler for `signIn.finalize` / `signUp.finalize`.
 * Uses in-app routing for app paths; opens the system browser for http(s) URLs.
 * This a function that returns a function (factory) that is used to navigate to the home path after authentication.
 */
export function createPostAuthNavigate(router: Router, homePath: Href = "/(tabs)") {
	return ({
		session,
		decorateUrl,
	}: {
		session: FinalizeSession;
		decorateUrl: (url: string) => string;
	}) => {
		if (session?.currentTask) {
			// When your Clerk instance defines session tasks, add a dedicated route per task key.
			const url = decorateUrl(homePath as string);
			if (!url.startsWith("http")) {
				router.replace(url as Href);
			}
			return;
		}

		const url = decorateUrl(homePath as string);
		if (url.startsWith("http")) {
			void Linking.openURL(url);
			return;
		}
		router.replace(url as Href);
	};
}
