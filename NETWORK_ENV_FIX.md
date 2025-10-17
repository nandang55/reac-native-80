# Network & Environment Configuration Fix

## Problem
Network requests failing karena `react-native-config` tidak membaca environment variables dengan benar, menyebabkan:
- `config.APP_SERVICE_URL` = `undefined`
- `config.APP_ID` = `undefined`  
- `config.APP_REGION` = `undefined`
- Dan semua config lainnya juga `undefined`

Akibatnya Axios mencoba hit API ke URL `undefined`, yang otomatis gagal.

## Root Cause
`react-native-config` memerlukan `.env` file atau native build configuration untuk membaca environment variables. Karena file `.env` di-ignore oleh git dan tidak tersedia, semua config values menjadi `undefined`.

## Solution

### ✅ Added Fallback Values in axiosInstance.ts

**File**: `src/core/axios/axiosInstance.ts`

Added default values untuk development:
```typescript
// Default values for development
const DEFAULT_APP_ID = 'sparkle-app';
const DEFAULT_APP_REGION = 'sg';
const DEFAULT_APP_VERSION = '1.0.0';
const DEFAULT_ALGOLIA_APPID = '9O35FH7LWB';
const DEFAULT_ALGOLIA_APIKEY = 'a80ad6cca4e0866c745d747bdd6512cf';
const DEFAULT_APP_SERVICE_URL = 'https://sit-sparkle-service-api.gajicermat.co';

const baseHeaders = {
  'x-platform': config.APP_ID || DEFAULT_APP_ID,
  'x-region': config.APP_REGION || DEFAULT_APP_REGION,
  'x-mobile-version': config.APP_VERSION || DEFAULT_APP_VERSION,
  'x-algolia-application-id': config.ALGOLIA_APPID || DEFAULT_ALGOLIA_APPID,
  'x-algolia-api-key': config.ALGOLIA_APIKEY || DEFAULT_ALGOLIA_APIKEY
};

const instanceAuthOption: AxiosRequestConfig = {
  baseURL: config.APP_SERVICE_URL || DEFAULT_APP_SERVICE_URL,
  ...axiosBaseConfigOptions
};
```

## Default Configuration

### API Endpoint
- **Base URL**: `https://sit-sparkle-service-api.gajicermat.co`
- **Environment**: SIT (Staging/Integration Testing)

### Headers
- **x-platform**: `sparkle-app`
- **x-region**: `sg` (Singapore)
- **x-mobile-version**: `1.0.0`
- **x-algolia-application-id**: `9O35FH7LWB`
- **x-algolia-api-key**: `a80ad6cca4e0866c745d747bdd6512cf`

## How to Use Custom Environment

If you need different API endpoint or configuration:

### Option 1: Create .env File (Recommended for local dev)
Create `.env` in project root:
```env
APP_ENV=_SIT_
APP_ID=sparkle-app
APP_SERVICE_URL=https://your-custom-api.com
APP_REGION=sg
APP_VERSION=1.0.0
ALGOLIA_APPID=your-algolia-id
ALGOLIA_APIKEY=your-algolia-key
```

**Note**: Requires rebuild (not just reload) because react-native-config reads at build time.

### Option 2: Update Mock File
Edit `__mocks__/react-native-config.js`:
```javascript
export default {
  APP_SERVICE_URL: 'https://your-custom-api.com',
  // ... other values
};
```

Then restart Metro bundler.

### Option 3: Update Default Values
Edit fallback values directly in `src/core/axios/axiosInstance.ts`

## Testing Network

### Check API Connection
```bash
curl -X GET https://sit-sparkle-service-api.gajicermat.co/health
# Or any available endpoint
```

### Debug Network in App
1. Enable Network Inspector in React Native Debugger
2. Check request headers and URL
3. Verify base URL is not `undefined`

## After Fix

**Restart Metro bundler:**
```bash
# Kill Metro
lsof -ti:8081 | xargs kill -9

# Start fresh
cd /Users/nandanghermawan/Project/akasia/SparkleRn80
npx react-native start --reset-cache
```

Then reload app. Network requests should now work with fallback values! 🚀

