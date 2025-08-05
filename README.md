# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Project Structure & Best Practices

- **components/**: Vue components, auto-imported
- **composables/**: Reusable logic (auto-imported)
- **layouts/**: App layouts
- **pages/**: File-based routing
- **middleware/**: Route middleware
- **plugins/**: Nuxt/Vue plugins
- **assets/**: Uncompiled assets (images, fonts, styles)
- **public/**: Static files
- **store/**: Pinia stores
- **locales/**: i18n translations
- **utils/**: Utility functions

### Key Modules
- TailwindCSS for styling
- Pinia for state management
- VueUse for utility composables
- PWA support via @vite-pwa/nuxt
- i18n for localization
- Google Fonts
- Device detection
- Robots.txt and Sitemap for SEO

### Best Practices
- Use composables for logic reuse
- Use Pinia for state
- Use layouts for page structure
- Use middleware for auth/guards
- Use Tailwind utility classes
- Use i18n for translations
- Use PWA features for offline/installation
