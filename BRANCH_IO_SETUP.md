# Branch.io Setup Fix

## Error Fixed
```
Attempt to read from field 'io.branch.referral.Branch$InitSessionBuilder 
io.branch.referral.Branch.deferredSessionBuilder' on a null object reference 
in method 'void io.branch.referral.Branch.notifyNativeToInit()'
```

## Problem
Branch.io SDK tidak di-initialize dengan benar di Android native code, menyebabkan crash saat app start.

## Solution

### 1. ✅ Updated MainActivity.kt
**File**: `android/app/src/main/java/com/uangcermat/sparkle/sit/MainActivity.kt`

Added Branch.io lifecycle methods:
```kotlin
import io.branch.rnbranch.RNBranchModule

override fun onStart() {
  super.onStart()
  RNBranchModule.initSession(intent.data, this)
}

override fun onNewIntent(intent: Intent) {
  super.onNewIntent(intent)
  setIntent(intent)
  RNBranchModule.onNewIntent(intent)
}
```

### 2. ✅ Updated MainApplication.kt
**File**: `android/app/src/main/java/com/uangcermat/sparkle/sit/MainApplication.kt`

Added Branch.io initialization in `onCreate()`:
```kotlin
import io.branch.rnbranch.RNBranchModule

override fun onCreate() {
  super.onCreate()
  
  // Branch.io initialization
  RNBranchModule.enableLogging()
  RNBranchModule.getAutoInstance(this)
  
  loadReactNative(this)
}
```

### 3. ✅ Updated AndroidManifest.xml
**File**: `android/app/src/main/AndroidManifest.xml`

Added:
- Branch.io metadata with test key
- Deep link intent filters
- OneSignal suppression meta-data

```xml
<!-- Branch.io Meta-Data -->
<meta-data 
  android:name="io.branch.sdk.BranchKey" 
  android:value="key_test_fnKzLcLT0aV8fVOq4A0odbjmtCmtjHzA" 
/>
<meta-data 
  android:name="io.branch.sdk.TestMode" 
  android:value="true" 
/>

<!-- Deep link intent filter -->
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="sparkle-mobile" />
</intent-filter>
```

## Configuration

### Test Mode (Current)
- **Branch Key**: `key_test_fnKzLcLT0aV8fVOq4A0odbjmtCmtjHzA`
- **Test Mode**: `true`
- For development and testing

### Production Mode
Update `AndroidManifest.xml`:
```xml
<meta-data 
  android:name="io.branch.sdk.BranchKey" 
  android:value="YOUR_PRODUCTION_BRANCH_KEY" 
/>
<meta-data 
  android:name="io.branch.sdk.TestMode" 
  android:value="false" 
/>
```

## How to Apply Changes

**Rebuild Android app** (native code changes require rebuild):
```bash
cd /Users/nandanghermawan/Project/akasia/SparkleRn80

# Clean build
cd android && ./gradlew clean && cd ..

# Rebuild and run
npx react-native run-android
```

## Testing Deep Links

### Custom Scheme
```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "sparkle-mobile://product/123"
```

### Branch Links
Test Branch.io deep links through the Branch.io dashboard or use test links.

## References
- [Branch.io React Native SDK](https://github.com/BranchMetrics/react-native-branch-deep-linking-attribution)
- [Branch.io Android Integration](https://help.branch.io/developers-hub/docs/android-basic-integration)

