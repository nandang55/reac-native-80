# Date-fns v3 Migration

## Changes Made

### Locale Import Changes

Date-fns v3 changed the locale import structure.

**Old (v2.x):**
```typescript
import en from 'date-fns/locale/en-US/index';
import id from 'date-fns/locale/id';
```

**New (v3.x):**
```typescript
import { enUS, id } from 'date-fns/locale';
```

### Files Updated

1. ✅ `src/utils/formatDate.ts`
   - Changed `en` → `enUS` import
   - Updated locale usage in format function

2. ✅ `src/utils/dateFormatter.ts`
   - Changed `en` → `enUS` import
   - Updated locale usage in format function

## Breaking Changes

- `en-US` locale is now imported as `enUS` (camelCase)
- All locales must be imported from `'date-fns/locale'` directly
- No more `/index` suffix in imports

## References

- [Date-fns v3 Upgrade Guide](https://date-fns.org/docs/Upgrade-Guide#v3)
- Package version in project: `date-fns@^3.6.0`

