# Gazly - Fuel Price Finder

A Progressive Web App (PWA) for finding the best fuel prices in Portugal. Built with Nuxt 3, and modern web technologies.

## 🌟 Features

### 🔍 **Smart Search**
- Search fuel stations by district and municipality
- Filter by fuel types (Gasoline, Diesel, LPG, etc.)
- Use your current location for nearby stations

### 📍 **Interactive Map**
- View all stations on an interactive map
- Favorite stations highlighted with heart icons
- Click stations for detailed information and directions

### ❤️ **Favorites System**
- Save your favorite stations
- Quick access to frequently visited locations
- Persistent favorites across sessions

### 📱 **Progressive Web App**
- Install on mobile devices like a native app
- Works offline with cached data
- Fast loading and smooth performance
- Native app-like experience

### 🌍 **Internationalization**
- Support for English and Portuguese
- Automatic language detection
- Localized content and interface

### 🎨 **Modern UI/UX**
- Dark/Light theme support
- Responsive design for all devices
- Intuitive navigation with bottom tabs
- Beautiful, modern interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/jotapebatista/gas-price-portugal
cd gas-price-portugal

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 PWA Installation

### Mobile Devices
1. Open the app in your mobile browser
2. Look for the "Install App" prompt
3. Tap "Install" to add to your home screen

### Desktop
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Follow the installation prompts

## 🛠️ Tech Stack

### Frontend
- **Nuxt 3** - Vue.js framework
- **Tailwind CSS** - Utility-first CSS framework
- **Leaflet.js** - Interactive maps

### PWA & Performance
- **@vite-pwa/nuxt** - PWA support
- **Workbox** - Service worker for offline caching
- **@vueuse/nuxt** - Vue composition utilities

### Internationalization
- **@nuxtjs/i18n** - Multi-language support
- **English & Portuguese** - Supported languages

### Development Tools
- **TypeScript** - Type safety
- **ESLint & Prettier** - Code formatting
- **@nuxtjs/device** - Device detection

## 📁 Project Structure

```
gazly/
├── components/          # Vue components
│   ├── StationsMap.vue     # Interactive map
│   ├── ResultsPanel.vue    # Search results
│   ├── FiltersPanel.vue    # Search filters
│   ├── FavoritesPanel.vue  # Favorites list
│   └── SettingsPanel.vue   # App settings
├── composables/        # Reusable logic
│   ├── useGasStations.ts   # API integration
│   ├── useGeolocation.ts   # Location services
│   ├── useFavorites.ts     # Favorites management
│   └── usePWAInstall.ts    # PWA installation
├── i18n/              # Internationalization
│   └── locales/           # Translation files
├── public/            # Static assets
│   ├── manifest.json      # PWA manifest
│   ├── logo.png       # App icon
│   └── screenshots/       # PWA screenshots
└── scripts/           # Build scripts
    └── sync-version.js    # Version sync utility
```

## 🔧 Configuration

### Environment Variables
The app uses Nuxt's runtime config for configuration:

```typescript
// nuxt.config.ts
runtimeConfig: {
  public: {
    appName: 'Gazly',
    appVersion: '1.1.0',
  },
}
```

### PWA Settings
- **Manifest**: Configured for standalone mode
- **Service Worker**: Caches API responses and static assets
- **Icons**: Multiple sizes for different devices
- **Screenshots**: Rich install experience

## 📊 Data Source

Gazly uses the Portuguese government's fuel price API to provide real-time, accurate fuel prices across Portugal. All data is sourced from official government databases.
You can find it here: [Direção-Geral de Energia e Geologia (DGEG)](https://www.dgeg.gov.pt/)

## 🎯 Key Features Explained

### Search & Filter
- **District Selection**: Choose from all Portuguese districts
- **Municipality Filter**: Narrow down by specific municipalities
- **Fuel Type Selection**: Filter by gasoline, diesel, LPG, and more
- **Location Services**: Use GPS for nearby station discovery

### Map Integration
- **Interactive Map**: Powered by Leaflet.js
- **Station Markers**: Click for detailed information
- **User Location**: Blue dot shows your current position
- **Favorites Highlighting**: Heart icons for saved stations

### PWA Capabilities
- **Offline Support**: Cached data works without internet
- **App Installation**: Install on mobile home screens
- **Native Experience**: Full-screen, standalone mode
- **Fast Loading**: Optimized for performance

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod
```

### Other Platforms
The app can be deployed to any static hosting platform:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Portuguese government for providing the fuel price API
- Nuxt team for the excellent framework
- Vue.js community for the amazing ecosystem
- All contributors and users of Gazly

---

**Gazly** - Find the best fuel prices in Portugal with ease! ⛽🇵🇹
