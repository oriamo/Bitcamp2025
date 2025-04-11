#!/bin/bash

# Script to build Android APK for CookMateAI
echo "=========== CookMateAI Android Build Script ==========="
echo "This script will help you build an APK for your Android device."
echo ""

# Check if eas-cli is installed
if ! command -v eas &> /dev/null; then
    echo "Installing EAS CLI..."
    npm install -g eas-cli
fi

# Login to Expo
echo "You'll need to log in to your Expo account."
eas login

# Configure project if needed
if [ ! -f "eas.json" ]; then
    echo "Creating EAS configuration..."
    cat > eas.json << 'EOL'
{
  "cli": {
    "version": ">= 5.9.3"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "buildConfiguration": "Debug"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
EOL
fi

# Build options
echo ""
echo "Select build type:"
echo "1) Preview APK (installable on any device, cannot be updated over-the-air)"
echo "2) Development Build (can be updated during development)"
echo "3) Production Build (optimized for performance)"
echo ""
read -p "Choose an option (1-3): " option

case $option in
    1)
        echo "Building preview APK..."
        eas build -p android --profile preview
        ;;
    2)
        echo "Building development client..."
        eas build -p android --profile development
        ;;
    3)
        echo "Building production version..."
        eas build -p android --profile production
        ;;
    *)
        echo "Invalid option. Exiting."
        exit 1
        ;;
esac

echo ""
echo "Build process started! You'll receive a URL to download your build when it completes."
echo "This process may take 10-20 minutes depending on the Expo build queue."
echo "You will be notified by email when your build is complete."
echo ""