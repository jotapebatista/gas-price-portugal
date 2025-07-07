const siteTitle = "GasApp - Portugal";

export default defineNuxtConfig({
	app: {
		head: {
			title: siteTitle,
			meta: [
				{ charset: "utf-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1, user-scalable=no",
				},
				{ name: "theme-color", content: "#3b82f6" },
				{ name: "apple-mobile-web-app-capable", content: "yes" },
				{ name: "apple-mobile-web-app-status-bar-style", content: "default" },
				{ name: "apple-mobile-web-app-title", content: "GasApp" },

				// SEO
				{
					name: "description",
					content:
						"GasApp Portugal - Find the best gas prices in Portugal with real-time updates. Compare fuel prices by district and municipality.",
				},
				{
					name: "keywords",
					content:
						"gasolina, gasóleo, combustíveis, portugal, preços, postos de combustível, gasolina 95, gasolina 98, gasóleo simples, gasóleo especial",
				},
				{ name: "author", content: "GasApp Team" },

				// Open Graph (for social media sharing)
				{ property: "og:title", content: "GasApp - Portugal" },
				{
					property: "og:description",
					content:
						"Find the best gas prices in Portugal with real-time updates. Compare fuel prices by district and municipality.",
				},
				{ property: "og:url", content: "https://gasapp.jotapebatista.pt" },
				{ property: "og:type", content: "website" },
				{ property: "og:image", content: "/images/banner-gh.png" },

				// Twitter Card
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: "GasApp - Portugal" },
				{
					name: "twitter:description",
					content:
						"Find the best gas prices in Portugal with real-time updates.",
				},
			],

			link: [
				{ rel: "manifest", href: "pwa/manifest.json" },
				{
					rel: "apple-touch-icon",
					href: "pwa/icons/apple-touch-icon.png",
				},
				{ rel: "icon", type: "image/png", sizes: "32x32", href: "pwa/icons/icon48.png" },
				{ rel: "icon", type: "image/png", sizes: "16x16", href: "pwa/icons/icon48.png" },
			],
		},
		pageTransition: { name: "page", mode: "out-in" },
	},

	modules: [
		"nuxt-icon",
		"@nuxt/content",
		"@nuxtjs/color-mode",
		"@nuxtjs/tailwindcss",
		"@nuxtjs/leaflet",
	],

	components: {
		dirs: ["~/components", "~/components/library"],
	},

	tailwindcss: {
		cssPath: "~/assets/tailwind.css",
		configPath: "tailwind.config",
		exposeConfig: true,
		viewer: true, // Disable in production
	},

	colorMode: {
		classSuffix: "",
		preference: 'system',
		fallback: 'light',
	},
	
	runtimeConfig: {
		apiSecret: "123", 
		public: {
			apiBase: "/api",
			orsApiKey: process.env.ORS_API_KEY,
			supabaseUrl: process.env.SUPABASE_URL,
			supabaseKey: process.env.SUPABASE_KEY,
		},
	},

	compatibilityDate: "2025-04-15",
});
