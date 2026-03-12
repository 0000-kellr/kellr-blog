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

## Supabase SQL Migrations (exec_sql)

Du kannst direkt DDL-Statements gegen Supabase ausführen via stored procedure:

```powershell
$url = (Get-Content secrets/supabase_url.txt -Raw).Trim()
$key = (Get-Content secrets/supabase_service_role.txt -Raw).Trim()
$headers = @{"Authorization"="Bearer $key"; "apikey"=$key; "Content-Type"="application/json; charset=utf-8"}
$body = [System.Text.Encoding]::UTF8.GetBytes((@{ query = "CREATE TABLE ..." } | ConvertTo-Json))
Invoke-RestMethod "$url/rest/v1/rpc/exec_sql" -Method POST -Headers $headers -Body $body -ContentType "application/json; charset=utf-8"
```

- Funktion: `exec_sql(query text)` — gibt leeren String zurück (kein Result-Set)
- Service Role Key verwenden (nicht Anon Key)
- Mehrere Statements: einzeln aufrufen (kein Multi-Statement in einem Call)

---

## Notion File Upload (Bilder direkt in Notion)

**API Version:** `2025-09-03` (NICHT 2022-06-28!)
**Endpoint:** `POST https://api.notion.com/v1/file_uploads` ← Underscore, KEIN Bindestrich!

**Workflow:**
```powershell
# 1. Upload-Objekt erstellen
$r = Invoke-RestMethod "https://api.notion.com/v1/file_uploads" -Method POST `
  -Headers @{"Authorization"="Bearer $token"; "Notion-Version"="2025-09-03"} `
  -Body '{"filename":"bild.jpg","content_type":"image/jpeg"}' -ContentType "application/json"
$uploadId = $r.id

# 2. Datei hochladen (curl.exe verwenden, PowerShell multipart ist kaputt!)
curl.exe -s -X POST "https://api.notion.com/v1/file_uploads/$uploadId/send" `
  -H "Authorization: Bearer $token" -H "Notion-Version: 2025-09-03" `
  -F "file=@bild.jpg;type=image/jpeg"

# 3. In Notion Page Property setzen
# files: [{ type: "file_upload", file_upload: { id: $uploadId } }]
```

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
- **TÃ¤glicher Rhythmus:** 1 Post pro Tag, EN+DE kombiniert in einer Notion-Seite
- **Format:** Englisch zuerst, dann Deutsch, getrennt durch "---"
- **PostTime:** 11:00 Uhr
- **Planung:** Posts immer +2 Tage (Review-Buffer) - Day 3 Recap → PostTime 04.03.

---

## 1Password CLI (op)

**Vault:** `groot` — hier liegen alle meine Credentials
**Service Account Token:** `secrets/op_service_account_token.txt`
**Binary:** `$env:LOCALAPPDATA\Microsoft\WinGet\Packages\AgileBits.1Password.CLI_Microsoft.Winget.Source_8wekyb3d8bbwe\op.exe`
*(im User-PATH eingetragen, ab neuer Session einfach `op`)*

### Verwendung in PowerShell

```powershell
$opExe = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\AgileBits.1Password.CLI_Microsoft.Winget.Source_8wekyb3d8bbwe\op.exe"
$env:OP_SERVICE_ACCOUNT_TOKEN = (Get-Content "secrets/op_service_account_token.txt" -Raw).Trim()

# Secret lesen:
$secret = & $opExe read "op://groot/ItemName/credential"

# Alle Items im Vault auflisten:
& $opExe item list --vault groot
```

### Konvention
- Neue Credentials → immer zuerst in Vault `groot` anlegen, dann via `op read` abrufen
- `secrets/*.txt` Dateien können schrittweise durch `op read` ersetzt werden

### Item-Referenzen (op://groot/...)

| Vault-Item                  | Feld              | Verwendung                    |
|-----------------------------|-------------------|-------------------------------|
| Notion API Token            | credential        | Notion API                    |
| GitHub Token                | credential        | GitHub / Actions              |
| Azure DevOps PAT            | credential        | Azure DevOps                  |
| Bitbucket Token             | credential        | Bitbucket                     |
| OpenAI API Key              | credential        | OpenAI                        |
| Mailerlite API Key          | credential        | MailerLite                    |
| Brave API Key               | credential        | Brave Search API              |
| Resend Admin API Key        | credential        | Resend (Admin)                |
| Resend Send API Key         | credential        | Resend (Send)                 |
| Supabase Service Role       | credential        | Supabase Service Role Key     |
| Supabase Anon Key           | credential        | Supabase Anon Key             |
| Supabase URL                | url               | Supabase Project URL          |
| Teams Shared Secret         | credential        | MS Teams Webhook Secret       |
| Teams Function URL          | url               | MS Teams Function URL         |
| Home Assistant              | url + credential  | HA URL + Token                |
| FSK WordPress               | url/user/password/app_password | FSK WP          |
| FSK FTP                     | host/user/password| FSK FTP                       |
| WordPress                   | username/password | WP (au2mator)                 |
| Openclaw au2mator Website   | username/Openclaw App Password | WP au2mator (REST API) |
| Microsoft 365 Business      | client_id/tenant_id | MS Graph Business           |
| Microsoft 365 Private       | client_id/tenant_id | MS Graph Private            |
| Apple Developer             | issuer_id/key_id/team_id | ASC API                |
| Kellr Dist Cert (P12 Password) | password       | P12 Passwort = kellr2026      |
| Apple AuthKey 2C92NAJK9V    | (document)        | ASC API Key (alt)             |
| Apple AuthKey GY3WY8PX59    | (document)        | ASC API Key (aktiv)           |
| Kellr Dist Private Key      | (document)        | iOS Distribution Private Key  |
| Kellr Dist Signing P12      | (document)        | iOS Distribution P12          |
| Apple Signing Key PEM       | (document)        | Apple Signing Key PEM         |
| Apple Signing PFX           | (document)        | Apple Signing PFX             |

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
