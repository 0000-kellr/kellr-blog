# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

---

## Notion

**Token:** `secrets/notion_token.txt`

### Tasks Database
- **ID:** `31645ea5-eae3-4792-b4d9-5f0e7115fd44`
- **URL:** https://www.notion.so/31645ea5eae34792b4d95f0e7115fd44

**Properties:**
- `Task Name` (title) — Pflichtfeld
- `Status` — status type
  - **To Plan** (Inbox) — `SyrF`
  - Not Started — `not-started`
  - In Progress — `in-progress`
  - WAIT — `fo:a`
  - Done — `done`
  - Archived — `archived`
- `Priority` — select (optional)
  - Low — `priority_low`
  - Medium — `priority_medium`
  - High — `priority_high`
- `Project` — relation zu Projects DB (leer lassen für Inbox)
- `Due` — date (optional)
- `Description` — rich_text (optional)
- `Estimates` — select (XXS/XS/S/M/L/XL)
- `Planing` — select (Kalenderintegration)
  - Plan — `IW^;`
  - Best Effort — `EEQK`
  - Least Effort — `c00a1338-93a9-4ba6-84be-b6b57f4177d7`
- `MyDay` — checkbox

**Inbox-Regel:** Status = "To Plan" + kein Project verknüpft

### Bekannte Projects
- **au2mator internal** — `aec614ca-4b78-45c2-8fcb-25f924e60d47`

### Projects Database
- **ID:** `416a22e6-76b2-498c-9760-3d58dcd3b377`

---

## Microsoft 365 (Graph API)

**Credentials:** `secrets/`
- `ms_client_id.txt` — App Client ID
- `ms_tenant_id.txt` — Tenant ID  
- `msal_cache.json` — Token Cache (Access + Refresh + ID Token)

**Scopes:** `Calendars.ReadWrite User.Read`

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
# $response.access_token, $response.refresh_token — dann Cache updaten!
```

### Kalender abfragen

```powershell
$token = "..." # aus Cache oder frisch refreshed
$headers = @{ "Authorization" = "Bearer $token" }
$today = (Get-Date).ToString("yyyy-MM-ddT00:00:00")
$nextWeek = (Get-Date).AddDays(7).ToString("yyyy-MM-ddT23:59:59")

Invoke-RestMethod -Uri "https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=$today&endDateTime=$nextWeek" -Headers $headers
```

**Hinweis:** Access Token läuft nach ~1h ab. Bei 401 einfach refreshen und Cache updaten.

---

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
