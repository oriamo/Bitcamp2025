# Build Instructions for CookMateAI

This document provides detailed instructions on how to build an APK or development build of the CookMateAI app for Android.

## Prerequisites

- Node.js (v14 or newer)
- npm (v6 or newer)
- An Expo account (sign up at https://expo.dev/signup)
- Expo Go app installed on your Android device (for testing)

## Option 1: Build with Expo EAS (Recommended)

EAS (Expo Application Services) allows you to build native binaries in the cloud without needing the Android SDK locally.

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Log in to your Expo account

```bash
eas login
```

### 3. Build an APK for internal distribution

This will create an APK file that you can install directly on any Android device.

```bash
eas build -p android --profile preview
```

The build will be processed on Expo's servers. When complete, you'll receive a URL to download the APK.

### 4. Install the APK on your device

- Download the APK from the URL provided after the build completes
- On your Android device, open the APK file to install it
- You may need to enable "Install from Unknown Sources" in your device settings

## Option 2: Expo Development Build

If you want a development build that you can update without rebuilding:

```bash
eas build --profile development --platform android
```

This creates a development client that can load updated JavaScript code from your development server.

## Option 3: Use Expo Go for Testing

For quick testing without building:

1. Install the Expo Go app on your Android device
2. Run the app in development mode:

```bash
npm start
```

3. Scan the QR code with the Expo Go app

## Option 4: Build locally with Expo prebuild (Requires Android SDK)

If you later decide to install the Android SDK:

```bash
npx expo prebuild
cd android
./gradlew assembleDebug
```

The APK will be located at `android/app/build/outputs/apk/debug/app-debug.apk`

## Environment Variables and API Keys

Make sure your `.env` file contains all necessary API keys before building:

```
GEMINI_API_KEY=your_api_key
```

## Troubleshooting

- **Build fails**: Check that all dependencies are installed and your Expo account has available build minutes
- **APK won't install**: Make sure "Install from Unknown Sources" is enabled in your device settings
- **App crashes on startup**: Ensure your environment variables and API keys are correctly set up
- **Images or assets missing**: Verify that all assets referenced in the app.json file exist in the project

## Additional Resources

- [Expo EAS Documentation](https://docs.expo.dev/build/introduction/)
- [Building APKs with Expo](https://docs.expo.dev/build-reference/apk/)
- [Android App Bundles](https://docs.expo.dev/build-reference/aab/)