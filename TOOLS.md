# TOOLS.md - Local Notes

---
## ⚠️ KRITISCH: ÖSTERREICH = UMLAUTE — IMMER UTF-8!

- HTML-Mails: `<meta charset="UTF-8">` — IMMER!
- PowerShell: direkte Umlaute (ä ö ü Ä Ö Ü ß), KEIN HTML-Entity
- Dateien schreiben: `-Encoding UTF8` bei `Set-Content`, `Out-File`
- JSON API Bodies: `[System.Text.Encoding]::UTF8.GetBytes($body)`
- GitHub/Notion API: immer `UTF8.GetBytes()` beim PUT/POST

---

## Notion

**Token:** `op://groot/Notion API Token/credential`

### Tasks Database
- **ID:** `31645ea5-eae3-4792-b4d9-5f0e7115fd44`
- Properties: `Task Name` (title), `Status`, `Priority`, `Project` (relation), `Due`, `Description`, `Estimates`, `Planing`, `MyDay`
- Status-IDs: To Plan = `SyrF` · In Progress = `in-progress` · WAIT = `fo:a` · Done = `done`
- Priority-IDs: Low = `priority_low` · Medium = `priority_medium` · High = `priority_high`
- Planing-IDs: Plan = `IW^;` · Best Effort = `EEQK`
- **Inbox-Regel:** Status = "To Plan" UND kein Project → Default-Priorität immer **Low**

### Projects Database
- **ID:** `416a22e6-76b2-498c-9760-3d58dcd3b377`
- **au2mator internal:** `aec614ca-4b78-45c2-8fcb-25f924e60d47`

---

## Notion File Upload (Bilder direkt in Notion)

- **API Version:** `2025-09-03` (NICHT 2022-06-28!)
- **Endpoint:** `POST https://api.notion.com/v1/file_uploads` ← Underscore!
- **curl.exe** für multipart verwenden — PowerShell multipart ist kaputt!
- Workflow: POST file_uploads → curl.exe .../send (multipart) → Property mit `{type:"file_upload", file_upload:{id:$uploadId}}`

---

## Notion Posts Planer (Social Media)

- **DB ID:** `b85c425b76a94007aa83a9cab5d2d45c`
- Kellr Posts: Status = **Placeholder**, Type = **kellr**, Area = **MichaelSeidl**, Socials = LinkedIn + Instagram
- Content in: **LINKEDIN SeidlM** + **INSTAGRAM SeidlM (POST)**
- Format: EN zuerst, dann DE, getrennt durch `---` · PostTime: **11:00** · +2 Tage Review-Buffer

---

## Microsoft 365 (Graph API)

- **Business:** `op://groot/Microsoft 365 Business/client_id` + `tenant_id` · Cache: `secrets/msal_cache.json`
- **Private:** `op://groot/Microsoft 365 Private/client_id` + `tenant_id` · Cache: `secrets/msal_cache_Private.json`
- Scopes: `Calendars.ReadWrite Mail.ReadWrite Mail.Send Contacts.ReadWrite offline_access`
- Access Token läuft nach ~1h ab → bei 401 via Refresh Token erneuern und Cache updaten

---

## Supabase (exec_sql)

- Endpoint: `POST $url/rest/v1/rpc/exec_sql` mit `{query: "..."}` Body
- Headers: `Authorization: Bearer $serviceRoleKey` + `apikey: $serviceRoleKey`
- Service Role Key (nicht Anon Key) · Einzelne Statements (kein Multi-Statement)
- URL + Keys via `op://groot/Supabase URL/url` + `op://groot/Supabase Service Role/credential`

---

## 1Password CLI (op)

- **Vault:** `groot` · **Token:** `secrets/op_service_account_token.txt`
- **Binary:** `$env:LOCALAPPDATA\Microsoft\WinGet\Packages\AgileBits.1Password.CLI_Microsoft.Winget.Source_8wekyb3d8bbwe\op.exe`

```powershell
$env:OP_SERVICE_ACCOUNT_TOKEN = (Get-Content "secrets/op_service_account_token.txt" -Raw).Trim()
$secret = & $opExe read "op://groot/ItemName/credential"
```

- **PowerShell stdin-Fix:** `cmd /c '"op.exe" read "op://..." < NUL'`
- Alle Items: `secrets/op-items.md`
