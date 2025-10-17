# Environment Variables Setup - Complete Guide

## ✅ Setup Completed for Android

### What Was Configured

#### 1. Android Build Configuration
**File**: `android/app/build.gradle`

Added react-native-config setup:
```gradle
// Load .env file using react-native-config
project.ext.envConfigFiles = [
    debug: ".env",
    release: ".env"
]

apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
```

This tells Gradle to:
- Read `.env` file during build time
- Inject all environment variables as `BuildConfig` constants
- Make them available through `react-native-config`

#### 2. Environment File
**File**: `.env` (already exists)

Contains all necessary configuration:
```env
APP_ID=sparkle-app
APP_REGION=sg
APP_SERVICE_URL=https://sit-sparkle-service-api.gajicermat.co
APP_ENV=_SIT_
ALGOLIA_APPID=9O35FH7LWB
ALGOLIA_APIKEY=a80ad6cca4e0866c745d747bdd6512cf
# ... and more
```

#### 3. Removed Fallback Values
**File**: `src/core/axios/axiosInstance.ts`

Now uses direct config values:
```typescript
const baseHeaders = {
  'x-platform': config.APP_ID,
  'x-region': config.APP_REGION,
  // ...
};

const instanceAuthOption: AxiosRequestConfig = {
  baseURL: config.APP_SERVICE_URL,
  // ...
};
```

## How It Works

### Build Time vs Runtime

**react-native-config** reads `.env` at **BUILD TIME**, not runtime:

1. **During Build**: Gradle/Xcode reads `.env` file
2. **Converts to Native**: Values become native constants (BuildConfig on Android, Info.plist on iOS)
3. **Runtime Access**: JavaScript reads these native constants via `react-native-config`

### Why Rebuild is Required

Because `.env` is read at build time, any changes to `.env` require a **full rebuild**:

❌ **Won't Work**: Metro reload/restart  
✅ **Required**: Native rebuild

## Android Setup - DONE ✅

### Build Command Used
```bash
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

### Verification
During build, you should see:
```
> Configure project :app
Reading env from: .env
```

This confirms `.env` is being read! ✅

### Testing After Build

Once app is built and running, test in JavaScript:
```javascript
import config from 'react-native-config';

console.log('API URL:', config.APP_SERVICE_URL);
console.log('App ID:', config.APP_ID);
console.log('Region:', config.APP_REGION);
```

All values should be defined (not `undefined`)!

## iOS Setup - TODO

iOS configuration already added but needs rebuild:

**Files Created/Modified:**
- `ios/Config.xcconfig` - Created ✅
- `ios/Podfile` - Updated with config path ✅

**Next Steps for iOS:**
```bash
# 1. Install pods
cd ios && pod install && cd ..

# 2. Build and run
npx react-native run-ios

# OR use Xcode:
# Open ios/SparkleRn80.xcworkspace
# Build and run
```

## Troubleshooting

### If Values Still `undefined`

**Check 1**: Verify `.env` file exists
```bash
ls -la .env
```

**Check 2**: Verify Android build reads it
```bash
cd android && ./gradlew clean
# Look for: "Reading env from: .env"
```

**Check 3**: Full rebuild required
```bash
# Clean everything
cd android && ./gradlew clean && cd ..
rm -rf android/app/build

# Rebuild
npx react-native run-android
```

### If Build Fails

**Error**: `project(':react-native-config') not found`

**Solution**: Ensure react-native-config is linked:
```bash
npm install react-native-config --save
cd android && ./gradlew clean && cd ..
```

## Environment Variables Available

From `.env` file:
- `APP_ID` - Platform identifier
- `APP_REGION` - Region (sg, id, etc)
- `APP_SERVICE_URL` - API base URL
- `APP_ENV` - Environment (_SIT_, _STAGING_, _PROD_)
- `ALGOLIA_APPID` - Algolia application ID
- `ALGOLIA_APIKEY` - Algolia API key
- `ONE_SIGNAL_APP_ID` - OneSignal app ID
- `DEEPLINK_PREFIX` - Deep link scheme
- And more...

## Multiple Environments (Optional)

You can create multiple env files:
```
.env.sit
.env.staging
.env.production
```

Then modify `build.gradle`:
```gradle
project.ext.envConfigFiles = [
    debug: ".env.sit",
    release: ".env.production"
]
```

## Summary

✅ **Android**: Configured and building  
⏳ **iOS**: Configured, needs rebuild  
✅ **`.env` file**: Exists with all values  
✅ **Build verification**: "Reading env from: .env" confirmed  

Network requests will now use real API endpoint from `.env`! 🚀

