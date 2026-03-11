# Water Tracker — Project Context

## What This Is
A personal Android water tracker app built with React Native + Expo (blank template). Tracks daily water intake with two screens and a motivational animal companion.

## Tech Stack
- **Framework**: React Native with Expo (blank template, classic `App.js` entry point — NOT expo-router)
- **Navigation**: React Navigation bottom tabs (`@react-navigation/native`, `@react-navigation/bottom-tabs`)
- **Storage**: `@react-native-async-storage/async-storage` (key format: `water-YYYY-MM-DD` → JSON array of numbers)
- **No TypeScript** — plain JavaScript throughout
- **No external UI library** — all styling via React Native `StyleSheet`

## Project Structure
```
water-tracker/
├── App.js                        # Entry point, sets up bottom tab navigator (Today + Calendar)
├── src/
│   ├── theme.js                  # Central color palette — all colors defined here, imported everywhere
│   ├── components/
│   │   ├── Animal.js             # Character image that changes based on water intake vs DAILY_GOAL
│   │   └── WaterEntry.js         # Single row in the water log list (amount + delete button)
│   ├── screens/
│   │   ├── TodayScreen.js        # Main screen: water entry list, sum, animal, input + quick-add buttons
│   │   └── CalendarScreen.js     # Monthly calendar grid with per-day totals and monthly summary
│   └── utils/
│       └── storage.js            # AsyncStorage helpers: getEntries, saveEntries, getDayTotal, getMonthTotals
├── assets/
│   └── animals/                  # 6 character PNGs (transparent bg), image_01.png through image_06.png
├── eas.json                      # EAS Build config (preview profile builds APK)
└── app.json                      # Expo config
```

## Key Constants
- `DAILY_GOAL`: 2000 ml (defined and exported in `src/components/Animal.js`)
- Quick-add amounts: 100, 200, 300, 500 ml (defined in `TodayScreen.js`)

## How Data Works
- Each day's data is stored as a JSON array of integers under key `water-YYYY-MM-DD`
- Example: `water-2026-03-11` → `[250, 300, 500, 250]`
- `getMonthTotals()` uses `AsyncStorage.multiGet` to batch-fetch an entire month
- Data persists across app restarts

## Design Decisions
- Dark mode color scheme defined centrally in `src/theme.js`
- Colors: dark bg (`#0D1117`), dark blue highlights (`#1E3A5F`), blue accent (`#5B9CF6`), green for success
- Character uses 6 PNG images (transparent bg) in `assets/animals/`, mapped to intake tiers (0%, <25%, <50%, <75%, <100%, 100%)
- Calendar weeks start on Monday
- Days where goal was met are highlighted green

## Running
```bash
npx expo start --web        # browser testing
npx expo start              # Expo Go on phone (scan QR)
```

## Building APK
```bash
eas login
eas build --platform android --profile preview
```
