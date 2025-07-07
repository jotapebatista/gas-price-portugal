# 🚀 GasApp Portugal - Offline Features

## Overview
GasApp Portugal now supports full offline functionality, allowing users to browse gas stations and prices even without an internet connection.

## ✨ Key Features

### 🔄 **Full Data Pre-loading**
- **All Districts**: Complete list of Portuguese districts cached locally
- **All Municipalities**: Every municipality in Portugal available offline
- **All Fuel Types**: Complete fuel type catalog cached
- **Gas Station Data**: All gas stations and prices cached by municipality

### 💾 **Smart Caching Strategy**
- **IndexedDB Storage**: Fast, persistent local database storage
- **Service Worker**: Intelligent caching with network-first fallback
- **Background Sync**: Automatic data updates when online
- **Cache Management**: Automatic cleanup of old data

### 📱 **Enhanced PWA Features**
- **Offline Indicator**: Visual feedback when using cached data
- **Data Preloader**: Progress indication during initial data download
- **Offline Page**: Dedicated page for completely offline scenarios
- **Push Notifications**: Ready for price update notifications

## 🛠 Technical Implementation

### Core Components

#### `useOfflineData.ts`
- IndexedDB management for local data storage
- CRUD operations for districts, municipalities, fuel types, and gas stations
- Data versioning and update tracking

#### `useEnhancedGasStationsAPI.ts`
- Enhanced API wrapper with offline fallback
- Automatic caching of API responses
- Network status monitoring

#### `DataPreloader.vue`
- Initial data download with progress indication
- Skip option for users who prefer online-only mode
- Offline mode detection and handling

#### `OfflineIndicator.vue`
- Real-time network status display
- Quick retry functionality
- Non-intrusive user notification

### Service Worker (`sw.js`)
- **Cache-First Strategy**: Static assets served from cache
- **Network-First with Cache Fallback**: API requests with offline fallback
- **Background Sync**: Automatic data updates
- **Push Notifications**: Ready for future price alerts

## 📊 Data Storage

### IndexedDB Schema
```
GasAppDB
├── appData (Object Store)
│   ├── districts: { key: 'districts', data: [...], lastUpdated: '...' }
│   ├── municipalities: { key: 'municipalities', data: [...], lastUpdated: '...' }
│   └── fuelTypes: { key: 'fuelTypes', data: [...], lastUpdated: '...' }
└── gasStations (Object Store)
    ├── municipality_1: { id: 'municipality_1', municipality: 1, data: [...], lastUpdated: '...' }
    ├── municipality_2: { id: 'municipality_2', municipality: 2, data: [...], lastUpdated: '...' }
    └── ...
```

## 🚀 User Experience

### First Time Users
1. **Data Preloader**: Shows download progress for all data
2. **Skip Option**: Users can skip and use online-only mode
3. **Background Download**: Data continues downloading in background

### Returning Users
1. **Instant Load**: App loads immediately with cached data
2. **Background Updates**: Data updates automatically when online
3. **Seamless Experience**: No difference between online/offline modes

### Offline Users
1. **Full Functionality**: All features work with cached data
2. **Visual Indicators**: Clear indication when using offline data
3. **Last Updated Info**: Shows when data was last refreshed

## 🔧 Configuration

### Environment Variables
```env
# Optional: Configure cache expiration
CACHE_DURATION=86400000  # 24 hours in milliseconds
```

### Service Worker Registration
The service worker is automatically registered in the app with:
- Automatic updates
- Background sync support
- Push notification capability

## 📈 Performance Benefits

### Load Times
- **First Load**: ~2-5 minutes (data download)
- **Subsequent Loads**: <1 second (cached data)
- **Offline Load**: <1 second (local data)

### Data Usage
- **Initial Download**: ~50-100MB (all Portugal data)
- **Background Updates**: ~1-5MB (incremental updates)
- **Offline Usage**: 0MB (local data only)

## 🔮 Future Enhancements

### Planned Features
- **Smart Preloading**: Only download frequently accessed areas
- **Data Compression**: Reduce initial download size
- **Incremental Updates**: Only download changed data
- **Push Notifications**: Price change alerts
- **Offline Analytics**: Track offline usage patterns

### Advanced Features
- **Predictive Caching**: Preload data based on user patterns
- **Multi-Device Sync**: Sync favorites across devices
- **Offline Maps**: Cached map tiles for offline navigation
- **Voice Search**: Offline voice commands

## 🐛 Troubleshooting

### Common Issues

#### Data Not Loading
1. Check IndexedDB support in browser
2. Clear browser cache and reload
3. Check service worker registration

#### Offline Mode Not Working
1. Ensure data was preloaded when online
2. Check service worker is active
3. Verify IndexedDB permissions

#### Slow Performance
1. Clear old cached data
2. Check available storage space
3. Restart the application

### Debug Commands
```javascript
// Check cached data
const { getAllCachedMunicipalities } = useOfflineData();
const cached = await getAllCachedMunicipalities();
console.log('Cached municipalities:', cached);

// Clear all data
const { clearAllData } = useOfflineData();
await clearAllData();

// Check service worker
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service workers:', registrations);
});
```

## 📝 License
This offline functionality is part of GasApp Portugal and follows the same license as the main project. 