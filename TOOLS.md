# TOOLS.md - Local Notes

---
## âš ï¸ KRITISCH: Ã–STERREICH = UMLAUTE â€” IMMER UTF-8!

**FÃœR ALLE AUSGABEN GILT:**
- HTML-Mails: `<html><head><meta charset="UTF-8"></head>` â€” IMMER!
- PowerShell Strings: direkte Umlaute (Ã¤ Ã¶ Ã¼ Ã„ Ã– Ãœ ÃŸ) verwenden, KEIN HTML-Entity (&auml; etc.) in Plaintext
- Dateien schreiben: `-Encoding UTF8` bei `Set-Content`, `Out-File`
- JSON API Bodies: `[System.Text.Encoding]::UTF8.GetBytes($body)`
- GitHub API: immer `[System.Text.Encoding]::UTF8.GetBytes()` beim PUT/POST
- Notion API: direkte UTF-8 Zeichen, kein Escaping

**Michael ist Ã–sterreicher. Ã¤ Ã¶ Ã¼ ÃŸ kommen stÃ¤ndig vor. Immer UTF-8 deklarieren!**
---


Skills define _how_ tools work. This file is for _your_ specifics â€” the stuff that's unique to your setup.

---

## Notion

**Token:** `secrets/notion_token.txt`

### Tasks Database
- **ID:** `31645ea5-eae3-4792-b4d9-5f0e7115fd44`
- **URL:** https://www.notion.so/31645ea5eae34792b4d95f0e7115fd44

**Properties:**
- `Task Name` (title) â€” Pflichtfeld
- `Status` â€” status type
  - **To Plan** (Inbox) â€” `SyrF`
  - Not Started â€” `not-started`
  - In Progress â€” `in-progress`
  - WAIT â€” `fo:a`
  - Done â€” `done`
  - Archived â€” `archived`
- `Priority` â€” select (optional)
  - Low â€” `priority_low`
  - Medium â€” `priority_medium`
  - High â€” `priority_high`
- `Project` â€” relation zu Projects DB (leer lassen fÃ¼r Inbox)
- `Due` â€” date (optional)
- `Description` â€” rich_text (optional)
- `Estimates` â€” select (XXS/XS/S/M/L/XL)
- `Planing` â€” select (Kalenderintegration)
  - Plan â€” `IW^;`
  - Best Effort â€” `EEQK`
  - Least Effort â€” `c00a1338-93a9-4ba6-84be-b6b57f4177d7`
- `MyDay` â€” checkbox

**Inbox-Regel:** Status = "To Plan" **UND** kein Project verknÃ¼pft (beide Bedingungen mÃ¼ssen zutreffen!)
**Default-PrioritÃ¤t:** Wenn nicht explizit anders gesagt â†’ immer **Low**

### Bekannte Projects
- **au2mator internal** â€” `aec614ca-4b78-45c2-8fcb-25f924e60d47`

### Projects Database
- **ID:** `416a22e6-76b2-498c-9760-3d58dcd3b377`

---

## Microsoft 365 (Graph API)

**Credentials:** `secrets/`

Business/Default:
- `ms_client_id.txt` â€” App Client ID
- `ms_tenant_id.txt` â€” Tenant ID
- `msal_cache.json` â€” Token Cache (Access + Refresh + ID Token)

Private:
- `ms_client_id_Private.txt` â€” App Client ID (Private)
- `ms_tenant_id_Private.txt` â€” Tenant ID (Private)
- `msal_cache_Private.json` â€” Token Cache (Private)

**Scopes:** `User.Read Calendars.ReadWrite Mail.ReadWrite Mail.Send Contacts.ReadWrite offline_access`

### Token Refresh (PowerShell)

```powershell
$cache = Get-Content "secrets/msal_cache.json" | ConvertFrom-Json
$refreshTokenKey = $cache.RefreshToken.PSObject.Properties.Name | Select-Object -First 1
$refreshToken = $cache.RefreshToken.$refreshTokenKey.secret
$clientId = Get-Content "secrets/ms_client_id.txt"
$tenantId = Get-Content "secrets/ms_tenant_id.txt"

$body = @{
    client_id = $clientId
    grant_type = "refresh_token"
    refresh_token = $refreshToken
    scope = "Calendars.ReadWrite User.Read"
}

$response = Invoke-RestMethod -Uri "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token" -Method POST -Body $body
# $response.access_token, $response.refresh_token â€” dann Cache updaten!
```

### Kalender abfragen

```powershell
$token = "..." # aus Cache oder frisch refreshed
$headers = @{ "Authorization" = "Bearer $token" }
$today = (Get-Date).ToString("yyyy-MM-ddT00:00:00")
$nextWeek = (Get-Date).AddDays(7).ToString("yyyy-MM-ddT23:59:59")

Invoke-RestMethod -Uri "https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=$today&endDateTime=$nextWeek" -Headers $headers
```

**Hinweis:** Access Token lÃ¤uft nach ~1h ab. Bei 401 einfach refreshen und Cache updaten.

---

## Notion Posts Planer (Social Media)

- **DB ID:** `b85c425b76a94007aa83a9cab5d2d45c`
- **Settings fÃ¼r Kellr Posts:**
  - Status: **Placeholder** (ToPlan = auto-publish, erst spÃ¤ter)
  - Type: **kellr**
  - Area: **MichaelSeidl** (kein Leerzeichen!)
  - Socials: **LinkedIn, Instagram**
  - Content in: **LINKEDIN SeidlM** + **INSTAGRAM SeidlM (POST)**
  - Language: DE oder EN
  - PostTime: DE = 08:00, EN = 14:00
- **TÃ¤glicher Rhythmus:** 2 Posts pro Tag (DE + EN), Building in Public

---

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

---

## Swift / iOS Gotchas

### @Observable + Arrays
**PROBLEM:** Bei `@Observable`-Klassen triggert in-place Mutation von Array-Elementen KEIN SwiftUI-Re-Render:
```swift
products[idx].current_stock = newStock  // ❌ View updated nicht
```
**FIX:** Immer das gesamte Array neu zuweisen:
```swift
var updated = products
updated[idx].current_stock = newStock
products = updated  // ✅ @Observable erkennt Änderung
```

### onChange(of:) — Equatable Pflicht
Jeder Typ der in `onChange(of:)` oder `ForEach` verwendet wird muss `Equatable` (bzw. `Hashable`) conformieren.
Immer prüfen wenn neue Typen in SwiftUI Views verwendet werden.

### Manual Signing in CI
- `PROVISIONING_PROFILE` = echte UUID aus dem Profil-Binary (NICHT die API-Resource-ID)
- UUID aus Plist extrahieren: `plistlib.loads(profile_data[plist_start:plist_end])["UUID"]`
- `-allowProvisioningUpdates` beim `xcodebuild -exportArchive` WEGLASSEN wenn Manual Signing
- `/tmp/profile_name` UND `/tmp/profile_uuid` immer beide schreiben
