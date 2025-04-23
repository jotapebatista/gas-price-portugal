# 🚗 Nuxt 3 Travel Distance & Routing App

This Nuxt 3 web app calculates real travel distances and estimated durations between a user's location and a selected station using the [OpenRouteService API](https://openrouteservice.org/), and visualizes routes on a map using [Leaflet.js](https://leafletjs.com/).

---

## ✨ Features

- 🌍 Real-time travel distance and duration calculation
- 🗺️ Leaflet map integration with route display
- 📍 User location and station destination support
- 🔐 Secure API key management via environment variables
- 📱 Mobile-friendly design

---

## 🧰 Tech Stack

- [Nuxt 3](https://nuxt.com/)
- [Leaflet](https://leafletjs.com/)
- [OpenRouteService API](https://openrouteservice.org/)
- TypeScript
- TailwindCSS

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies
```bash
npm install
```
### 3. Set up environment variables
Create a .env file in the root of the project and add your OpenRouteService API key:
```bash
ORS_API_KEY=your-api-key-here
```
Ensure your nuxt.config.ts includes the following:

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      orsApiKey: process.env.ORS_API_KEY
    }
  }
});
```

### 4. Run the app
```bash
npm run dev
```
Visit http://localhost:3000 in your browser.

---


## 📌 Buy Me a Coffee
If you find this project helpful, feel free to support me:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-orange?style=for-the-badge&logo=buymeacoffee&logoColor=white)](https://www.buymeacoffee.com/jotapebatista)

---

## 📝 License
MIT © 2025 João Batista