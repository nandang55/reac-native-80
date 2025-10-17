# React Query v4 Downgrade Fix

## Error Fixed
```
(0, _classPrivateFieldLooseBase2(...)[_client].defaultMutationOptions 
is not a function (it is undefined)
```

## Problem
SparkleRn80 was initially set up with **React Query v5** (`^5.90.3`), but the source code from `sparkle-mobile-app` was written for **React Query v4** (`^4.35.2`).

React Query v5 introduced breaking changes in the API, causing compatibility issues with the existing codebase.

## Solution

### 1. Downgraded to React Query v4
```bash
npm install @tanstack/react-query@~4.35.0 --legacy-peer-deps
```

**Version Change:**
- ❌ Before: `@tanstack/react-query@^5.90.3`
- ✅ After: `@tanstack/react-query@~4.35.0`

### 2. Added react-dom Mock
React Query v4 tries to import `react-dom`, but React Native doesn't use it.

**Created**: `__mocks__/react-dom.js`
```javascript
export const unstable_batchedUpdates = (callback) => {
  callback();
};
```

**Updated**: `metro.config.js`
```javascript
resolver: {
  extraNodeModules: {
    'react-dom': require.resolve('./__mocks__/react-dom.js')
  }
}
```

## Breaking Changes in React Query v5

Some key breaking changes that caused issues:
1. `defaultMutationOptions` API changed
2. Query key management updates
3. Cache structure modifications
4. Hook API changes

## Why Not Upgrade to v5?

Upgrading the entire codebase to React Query v5 would require:
- Refactoring all custom hooks that use React Query
- Updating query configurations across the app
- Testing all data fetching and mutations
- Potentially rewriting cache management logic

This is better suited for Phase 3 or a future refactoring phase.

## References
- [React Query v4 Docs](https://tanstack.com/query/v4/docs/react/overview)
- [React Query v5 Migration Guide](https://tanstack.com/query/v5/docs/react/guides/migrating-to-v5)

## After Fix

Restart Metro bundler:
```bash
# Kill existing Metro
lsof -ti:8081 | xargs kill -9

# Start fresh
npx react-native start --reset-cache
```

Then reload app in emulator/simulator.

