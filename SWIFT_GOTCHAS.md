# Swift / iOS Gotchas

## @Observable + Arrays
**PROBLEM:** In-place Mutation von Array-Elementen triggert KEIN SwiftUI-Re-Render:
```swift
products[idx].current_stock = newStock  // ❌
```
**FIX:** Ganzes Array neu zuweisen:
```swift
var updated = products; updated[idx].current_stock = newStock; products = updated  // ✅
```

## onChange(of:) — Equatable Pflicht
Typen in `onChange(of:)` / `ForEach` müssen `Equatable` (bzw. `Hashable`) conformieren.

## Manual Signing in CI
- `PROVISIONING_PROFILE` = echte UUID aus Profil-Binary (NICHT API-Resource-ID)
- UUID via `plistlib.loads(profile_data[plist_start:plist_end])["UUID"]`
- `-allowProvisioningUpdates` beim `xcodebuild -exportArchive` WEGLASSEN bei Manual Signing
- `/tmp/profile_name` UND `/tmp/profile_uuid` immer beide schreiben
