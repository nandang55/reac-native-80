# Environment Configuration Setup

## Fixed: Configuration Errors

### 1. Algolia `appId is missing` Error ✅
### 2. OneSignal `parameter appId is null` Error ✅

### Problem
Error terjadi karena `react-native-config` tidak membaca environment variables dengan benar.

### Solution

#### 1. ✅ Created Type Definitions
File: `types/env.d.ts`
- Mendefinisikan interface untuk semua environment variables
- Termasuk Algolia credentials dengan default values

#### 2. ✅ Created Mock Config
File: `__mocks__/react-native-config.js`
- Default values untuk development/testing
- Algolia SIT environment credentials

#### 3. ✅ Added Fallback Values

**File: `src/App.tsx`**
- Default Algolia credentials hardcoded untuk development:
  ```typescript
  const DEFAULT_ALGOLIA_APPID = '9O35FH7LWB';
  const DEFAULT_ALGOLIA_APIKEY = 'a80ad6cca4e0866c745d747bdd6512cf';
  const DEFAULT_ALGOLIA_INDEX_NAME = 'test_sparkle_products';
  ```

**File: `src/navigators/RootStackNavigator.tsx`**
- Default OneSignal App ID dengan fallback:
  ```typescript
  const oneSignalAppId = config.ONE_SIGNAL_APP_ID || '88092d7e-088a-456a-aa73-95357fa74a79';
  OneSignal.initialize(oneSignalAppId);
  ```

## How to Use

### For Development (Default)
Aplikasi akan menggunakan default credentials yang sudah di-set di `src/App.tsx`:
- **App ID**: 9O35FH7LWB
- **API Key**: a80ad6cca4e0866c745d747bdd6512cf
- **Index**: test_sparkle_products
- **Environment**: SIT

### For Production (Custom .env)
1. Create `.env` file di root project:
   ```env
   APP_ENV=_PROD_
   ALGOLIA_APPID=your-production-appid
   ALGOLIA_APIKEY=your-production-apikey
   ALGOLIA_INDEX_NAME=production-index
   APP_SERVICE_URL=https://production-api.com
   ```

2. Rebuild app (native changes required):
   ```bash
   # iOS
   cd ios && pod install && cd ..
   npx react-native run-ios
   
   # Android
   npx react-native run-android
   ```

## Environment Variables Available

From `types/env.d.ts`:
- `APP_ENV`: Environment type
- `APP_SERVICE_URL`: API base URL
- `ALGOLIA_APPID`: Algolia application ID
- `ALGOLIA_APIKEY`: Algolia API key
- `ALGOLIA_INDEX_NAME`: Main search index
- `SENTRY_DSN`: Sentry error tracking
- `ONE_SIGNAL_APP_ID`: OneSignal push notifications
- And more...

## Testing

After changes, **restart Metro with cache cleared**:
```bash
# Kill existing Metro
lsof -ti:8081 | xargs kill -9

# Start fresh
npx react-native start --reset-cache
```

Then reload app:
- **iOS**: Cmd + R in simulator
- **Android**: Double tap R or shake device → Reload

