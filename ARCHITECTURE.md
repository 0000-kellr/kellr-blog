# Kellr - Architektur & Service-Ubersicht

> Letzte Aktualisierung: 2026-03-02 (CI/CD Signing-Logik ergaenzt)
> Dieses Dokument beschreibt alle verwendeten Services, ihre Integration und Konfiguration.

---

## Gesamtuberblick

```
[Michael / Nutzer]
       |
       | WhatsApp Voice/Text
       v
[OpenClaw + Claude]  <---- KI-Steuerung (Sonnet Default, Opus fuer Coding)
       |
       |-- GitHub (0000-kellr)
       |         |-- kellr (iOS App)
       |         `-- kellr-blog (Website)
       |
       |-- Supabase (Backend)
       |
       |-- Apple (TestFlight / App Store)
       |
       |-- Resend (E-Mail)
       |
       `-- Notion (Tasks / Social Media Posts)
```

---

## iOS App - Kellr

| Eigenschaft | Wert |
|-------------|------|
| **Repo** | https://github.com/0000-kellr/kellr |
| **Tech** | SwiftUI, iOS 17+ |
| **Bundle ID** | com.au2mator.kellr |
| **Team** | QV64L84RFS |
| **CI/CD** | GitHub Actions -> TestFlight (manuell ausgeloest) |
| **TestFlight** | Internal: "Familie" - Public Link: https://testflight.apple.com/join/NGG31k6t |

### Signing

- **Distribution Certificate:** iOS Distribution: Michael Seidl (gespeichert als GitHub Secret `DIST_P12_BASE64`)
- **Certificate ID:** `MT8Z7MGMFU` - laeuft bis 2027-03-02
- **P12 Passwort:** `DIST_P12_PASSWORD` (GitHub Secret)
- **Provisioning:** Manuelles Signing - Profil wird bei jedem Build frisch via App Store Connect API heruntergeladen
- **API Key:** `GY3WY8PX59` (in `secrets/apple_authkey_GY3WY8PX59.p8`, als GitHub Secret `APP_STORE_CONNECT_PRIVATE_KEY`)

### CI/CD Build-Logik (GitHub Actions)

**Workflow-Datei:** `.github/workflows/build-and-deploy.yml`
**Trigger:** Manuell (`workflow_dispatch`) - kein automatischer Push-Trigger

#### Schritt 1 - Provisioning Profile herunterladen

Skript: `.github/scripts/download_profile.py`

```
1. pip install PyJWT
2. JWT mit App Store Connect API Key generieren
3. "APPLE_ID_AUTH" Capability am Profil aktivieren (falls fehlend)
4. Alle alten Profile gleichen Namens loeschen
5. Neues Profil erstellen -> mobileprovision-Binaerdatei laden
6. UUID aus plist-Binaerblock extrahieren:
   plistlib.loads(profile_data[plist_start:plist_end])["UUID"]
7. UUID -> /tmp/profile_uuid schreiben
8. Profilname -> /tmp/profile_name schreiben
```

> WICHTIG: Die UUID muss aus dem plist-Binary der `.mobileprovision`-Datei gelesen werden.
> Die Resource-ID der App Store Connect API ist NICHT die UUID, die Xcode braucht!

#### Schritt 2 - Xcode Build & Archive

```bash
xcodebuild archive \
  -project kellr.xcodeproj \
  -scheme kellr \
  -archivePath build/kellr.xcarchive \
  CODE_SIGN_STYLE=Manual \
  CODE_SIGN_IDENTITY="iPhone Distribution" \
  PROVISIONING_PROFILE="$(cat /tmp/profile_uuid)"
```

#### Schritt 3 - ExportOptions.plist generieren

```xml
<dict>
  <key>method</key><string>app-store</string>
  <key>signingStyle</key><string>manual</string>
  <key>teamID</key><string>QV64L84RFS</string>
  <key>provisioningProfiles</key>
  <dict>
    <key>com.au2mator.kellr</key>
    <string>[Profilname aus /tmp/profile_name]</string>
  </dict>
</dict>
```

> WICHTIG: `-allowProvisioningUpdates` darf beim `exportArchive`-Schritt NICHT verwendet werden!
> Mit Manual Signing fuehrt das zu einem Fehler ("unable to find provisioning profile").

#### Schritt 4 - Upload zu TestFlight

```bash
xcodebuild -exportArchive \
  -archivePath build/kellr.xcarchive \
  -exportPath build/export \
  -exportOptionsPlist /tmp/ExportOptions.plist
# (kein -allowProvisioningUpdates!)

xcrun altool --upload-app \
  -f build/export/kellr.ipa \
  --apiKey GY3WY8PX59 \
  --apiIssuer 360c0f64-c428-4121-a5b4-05b3bcc90e92
```

#### Bekannte Fallstricke (hart erarbeitet)

| Problem | Ursache | Fix |
|---------|---------|-----|
| `unable to find provisioning profile` | `-allowProvisioningUpdates` mit Manual Signing | Flag entfernen |
| UUID falsch | API Resource-ID statt Profil-UUID | UUID aus plist-Binary lesen |
| Build schlaegt fehl nach Zertifikat-Erneuerung | Altes Profil noch aktiv | Profil-Delete + Neu-Erstellung im Skript |
| `time.sleep` Python SyntaxError | Sleep zwischen `try`/`except` ohne Code | Korrekte Einrueckung |

---

## Backend - Supabase

| Eigenschaft | Wert |
|-------------|------|
| **Projekt** | bflxydqsutvpjzrevjlh |
| **URL** | https://bflxydqsutvpjzrevjlh.supabase.co |
| **Region** | Frankfurt (eu-central-1) |
| **Plan** | Free |
| **Auth** | Supabase Auth (E-Mail + Magic Link) |
| **Storage** | Supabase Storage (Bucket: public-assets) |

### Wichtige Tabellen

- `profiles` - User-Profile, Household-Verknuepfung
- `households` - Haushalte (Seidl-Hofmeister)
- `products` - Vorratskammer-Items
- `product_categories` - Kategorien (Unique Constraint: household+name)
- `storage_locations` - Lagerorte
- `stock_transactions` - Bestandsbewegungen
- `affiliate_partners` - Amazon & Co.
- `category_affiliate_links` - Kategorie -> Affiliate-Verknuepfung

### Credentials (lokal)

- Service Role Key: `secrets/supabase_service_role.txt`
- Anon Key: `secrets/supabase_anon_key.txt`
- URL: `secrets/supabase_url.txt`

---

## Website - kellr.app

| Eigenschaft | Wert |
|-------------|------|
| **Repo** | https://github.com/0000-kellr/kellr-blog |
| **Hosting** | GitHub Pages |
| **Domain** | https://kellr.app |
| **Tech** | Pure HTML/CSS/JS (kein Framework) |
| **Content** | data.js - JSON-basierte Blog-Eintraege |
| **Sprachen** | DE + EN (Toggle) |

### Seiten

- **Hero** - Projektvorstellung
- **Journal** - Taegliche Build-Logs
- **Dashboard** - KI-Kosten, Commits, Features (live aus data.js)
- **About** - Ueber Michael + WhatsApp Community
- **Community CTA** - WhatsApp Community Join-Link

---

## E-Mail - Resend

| Eigenschaft | Wert |
|-------------|------|
| **Provider** | Resend (resend.com) |
| **Domain** | kellr.app |
| **Sender** | noreply@kellr.app |
| **SMTP Host** | smtp.resend.com |
| **SMTP Port** | 465 |
| **User** | resend |
| **Zweck** | Supabase Auth-Mails (Einladungen, Password Reset) |
| **Limit** | 3.000 Mails/Monat (Free) |
| **Admin API** | secrets/resend_admin_api_key.txt |
| **Send API** | secrets/resend_api_key.txt |

---

## Kontakt - Microsoft 365 (geplant)

| Eigenschaft | Wert |
|-------------|------|
| **Postfach** | contact@kellr.app |
| **Status** | Ausstehend - DNS noch einzurichten |
| **Tenant** | Privat (ms_client_id_Private.txt) |

---

## KI & Automatisierung - OpenClaw

| Eigenschaft | Wert |
|-------------|------|
| **Platform** | OpenClaw (lokal auf Michaels PC) |
| **Haupt-Modell** | Claude Sonnet 4.6 (Routine) |
| **Coding Sub-Agents** | Claude Opus 4.6 (on demand) |
| **Steuerung** | WhatsApp Voice/Text |
| **Workspace** | C:\Users\Micha\.openclaw\workspace |
| **Agent** | Groot (main session) |

### Automatisierte Jobs (Cron)

- Resend Domain-Verifikation (alle 5 Min bis verified)
- kellr.app DNS Check (alle 5 Min bis propagiert)
- Daily LinkedIn Reminder (21:00 Vienna)

---

## Social Media - Notion Posts Planer

| Eigenschaft | Wert |
|-------------|------|
| **DB** | b85c425b76a94007aa83a9cab5d2d45c |
| **Kanaele** | LinkedIn (SeidlM) + Instagram (SeidlM) |
| **Rhythmus** | Taeglich: DE 08:00, EN 14:00 |
| **Status Flow** | Placeholder -> ToPlan -> Published |
| **Inhalt** | Building in Public - Kellr Fortschritt |

---

## GitHub

| Eigenschaft | Wert |
|-------------|------|
| **Organisation** | 0000-kellr |
| **App Repo** | 0000-kellr/kellr |
| **Blog Repo** | 0000-kellr/kellr-blog |
| **Token** | secrets/github_token.txt (User: Seidlm) |

### GitHub Secrets (kellr Repo)

- `APP_STORE_CONNECT_PRIVATE_KEY` - .p8 API Key
- `APP_STORE_CONNECT_KEY_ID` - GY3WY8PX59
- `APP_STORE_CONNECT_ISSUER_ID` - 360c0f64-...
- `APPLE_TEAM_ID` - QV64L84RFS
- `DIST_P12_BASE64` - Distribution Certificate
- `DIST_P12_PASSWORD` - P12 Passwort

---

## Kosten-Ubersicht (Stand Tag 2)

| Service | Kosten |
|---------|--------|
| OpenClaw + Claude API | ~200 EUR (Tag 1-2, Opus-intensiv) |
| Supabase | 0 EUR (Free Plan) |
| GitHub | 0 EUR (Free fuer Public Repos) |
| Resend | 0 EUR (Free: 3.000 Mails/Monat) |
| GitHub Pages | 0 EUR |
| Apple Developer | $99/Jahr (bereits bezahlt) |
| **Total laufend** | **~0 EUR/Monat** (excl. KI) |
