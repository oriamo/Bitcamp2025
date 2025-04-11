# Android Build Guide for CookMateAI

This guide will help you successfully build an APK or development build of the CookMateAI app for your Android device without needing the Android SDK locally installed.

## Prerequisites

- Node.js and npm installed on your machine
- An Expo account (sign up at https://expo.dev)
- The Expo Go app installed on your Android device (optional, for testing)

## Building the APK

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2: Log in to your Expo account

```bash
eas login
```

### Step 3: Configure the build

The necessary configuration files are already set up in this project:
- `eas.json` - Contains build profiles and configuration
- `app.json` - Contains app metadata and permissions
- `package.json` - Contains dependency information and Expo configuration

### Step 4: Start the build process

For a standard APK that can be installed on any Android device:

```bash
npm run build:android
```

This command will:
1. Start a build in Expo's cloud service
2. Show you a URL where you can monitor the build progress
3. Provide a download link for the APK once the build is complete

### Step 5: Install the APK

Once the build is complete:
1. Download the APK from the provided URL
2. Transfer the APK to your Android device if necessary
3. On your Android device, open the APK file to install it
4. You may need to allow "Install from Unknown Sources" in your device settings

## Alternative Build Options

### Development Build

If you want a development build that you can update without rebuilding:

```bash
eas build --profile development --platform android
```

### Production Build

For a full production build:

```bash
eas build --profile production --platform android
```

## Troubleshooting Common Issues

### "Package 'dotenv' has no metadata in React Native Directory"

Fixed by adding the following to your package.json:
```json
"expo": {
  "doctor": {
    "reactNativeDirectoryCheck": {
      "listUnknownPackages": false
    }
  },
  "install": {
    "exclude": ["dotenv"]
  }
}
```

### Version mismatch errors

Fixed by installing the exact version required by Expo:
```bash
npx expo install @react-native-async-storage/async-storage@1.23.1
```

### Environment variables not being included in the build

Make sure your environment variables are defined in the `eas.json` file under each build profile:
```json
"env": {
  "GEMINI_API_KEY": "your_api_key_here"
}
```

### Missing permissions

This project is configured with the following permissions:
- `RECORD_AUDIO` - For potential voice features
- `READ_EXTERNAL_STORAGE` - For accessing local files
- `WRITE_EXTERNAL_STORAGE` - For saving data locally
- `INTERNET` - For API communication

## Testing Locally with Expo Go

If you want to test changes before building:

1. Install the Expo Go app on your Android device
2. Run `npm start` on your development machine
3. Scan the QR code with the Expo Go app on your Android device

## Additional Resources

- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [APK vs App Bundle](https://docs.expo.dev/build-reference/apk/)
- [Troubleshooting EAS Build](https://docs.expo.dev/build/troubleshooting/)