# Water Tracker

A personal Android app for tracking daily water intake, built with React Native and Expo.

Log water throughout the day, track progress toward your daily goal, and view your history on a monthly calendar.

## Features

- **Daily tracking** — log water in ml with quick-add buttons (100, 200, 300, 500) or manual input
- **Progress visualization** — progress bar and character that changes based on intake
- **Monthly calendar** — see your history, days where you met your goal, and monthly stats
- **Persistent storage** — data saved locally with AsyncStorage
- **Dark mode UI** — dark theme with dark blue accents

## Project Structure

```
water-tracker/
├── App.js                          # Entry point, bottom tab navigator
├── src/
│   ├── theme.js                    # Central color palette (single source of truth)
│   ├── components/
│   │   ├── Animal.js               # Character that reacts to water intake
│   │   └── WaterEntry.js           # Single water log entry row
│   ├── screens/
│   │   ├── TodayScreen.js          # Main daily tracking screen
│   │   └── CalendarScreen.js       # Monthly calendar and stats
│   └── utils/
│       └── storage.js              # AsyncStorage helpers
├── assets/
│   └── animals/                    # Character images (image_01.png – image_06.png)
├── eas.json                        # EAS Build configuration
└── app.json                        # Expo configuration
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npx expo start --tunnel     # Scan QR with Expo Go on your phone
npx expo start --web        # Browser testing
```

## Building the APK

### 1. Create a free Expo account

Go to [expo.dev](https://expo.dev) and sign up.

### 2. Log in from the terminal

```bash
eas login
```

### 3. Configure the build

```bash
eas build:configure
```

This creates an `eas.json` file. Make sure it has a `preview` profile for APK builds:

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "production": {}
  }
}
```

### 4. Build the APK

```bash
eas build --platform android --profile preview
```

Once the build finishes, download the APK from [expo.dev](https://expo.dev) and install it on your phone.

## Customization

- **Daily goal** — edit `DAILY_GOAL` in `src/components/Animal.js` (default: 2000 ml)
- **Quick-add amounts** — edit the array in `TodayScreen.js` (default: 100, 200, 300, 500)
- **Colors** — edit `src/theme.js` to change the entire app's color scheme in one place
- **Character images** — replace PNGs in `assets/animals/` (image_01 = no water, image_06 = goal reached)
