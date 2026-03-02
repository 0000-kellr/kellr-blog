# Kellr â€” Architektur & Service-Ãœbersicht

> Letzte Aktualisierung: 2026-03-02 (CI/CD Signing-Logik ergänzt)
> Dieses Dokument beschreibt alle verwendeten Services, ihre Integration und Konfiguration.

---

## ðŸ—ï¸ GesamtÃ¼berblick

```
[Michael / Nutzer]
       â”‚
       â”‚ WhatsApp Voice/Text
       â–¼
[OpenClaw + Claude]  â—„â”€â”€â”€â”€ KI-Steuerung (Sonnet Default, Opus fÃ¼r Coding)
       â”‚
       â”œâ”€â”€â–º GitHub (0000-kellr)
       â”‚         â”œâ”€â”€ kellr (iOS App)
       â”‚         â””â”€â”€ kellr-blog (Website)
       â”‚
       â”œâ”€â”€â–º Supabase (Backend)
       â”‚
       â”œâ”€â”€â–º Apple (TestFlight / App Store)
       â”‚
       â”œâ”€â”€â–º Resend (E-Mail)
       â”‚
       â””â”€â”€â–º Notion (Tasks / Social Media Posts)
```

---

## ðŸ“± iOS App â€” Kellr

| Eigenschaft | Wert |
|-------------|------|
| **Repo** | https://github.com/0000-kellr/kellr |
| **Tech** | SwiftUI, iOS 17+ |
| **Bundle ID** | com.au2mator.kellr |
| **Team** | QV64L84RFS |
| **CI/CD** | GitHub Actions â†’ TestFlight (Push to main) |
| **TestFlight** | Internal: "Familie" Â· Public Link: https://testflight.apple.com/join/NGG31k6t |

### Signing
- **Distribution Certificate:** iOS Distribution: Michael Seidl (gespeichert als GitHub Secret `DIST_P12_BASE64`)
- **Certificate ID:** `MT8Z7MGMFU` · läuft bis 2027-03-02
- **P12 Passwort:** `DIST_P12_PASSWORD` (GitHub Secret)
- **Provisioning:** Manuelles Signing — Profil wird bei jedem Build frisch via App Store Connect API heruntergeladen
- **API Key:** `GY3WY8PX59` (in `secrets/apple_authkey_GY3WY8PX59.p8`, als GitHub Secret `APP_STORE_CONNECT_PRIVATE_KEY`)

### CI/CD Build-Logik (GitHub Actions)

**Workflow-Datei:** `.github/workflows/build-and-deploy.yml`  
**Trigger:** Manuell (`workflow_dispatch`) — **kein** automatischer Push-Trigger

#### Schritt 1 — Provisioning Profile herunterladen
Skript: `.github/scripts/download_profile.py`

```
1. pip install PyJWT
2. JWT mit App Store Connect API Key generieren
3. "APPLE_ID_AUTH" Capability am Profil aktivieren (falls fehlend)
4. Alle alten Profile gleichen Namens löschen
5. Neues Profil erstellen → mobileprovision-Binärdatei laden
6. UUID aus plist-Binärblock extrahieren:
   plistlib.loads(profile_data[plist_start:plist_end])["UUID"]
7. UUID → /tmp/profile_uuid schreiben
8. Profilname → /tmp/profile_name schreiben
```

> ⚠️ **Wichtig:** Die UUID muss aus dem plist-Binary der `.mobileprovision`-Datei gelesen werden.  
> Die Resource-ID der App Store Connect API ist NICHT die UUID, die Xcode braucht!

#### Schritt 2 — Xcode Build & Archive

```bash
xcodebuild archive \
  -project kellr.xcodeproj \
  -scheme kellr \
  -archivePath build/kellr.xcarchive \
  CODE_SIGN_STYLE=Manual \
  CODE_SIGN_IDENTITY="iPhone Distribution" \
  PROVISIONING_PROFILE="$(cat /tmp/profile_uuid)"
```

#### Schritt 3 — ExportOptions.plist generieren

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

> ⚠️ **Wichtig:** `-allowProvisioningUpdates` darf beim `exportArchive`-Schritt **nicht** verwendet werden!  
> Mit Manual Signing führt das zu einem Fehler ("unable to find provisioning profile").

#### Schritt 4 — Upload zu TestFlight

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

#### Bekannte Fallstricke (hart erarbeitet 🔥)

| Problem | Ursache | Fix |
|---------|---------|-----|
| `unable to find provisioning profile` | `-allowProvisioningUpdates` mit Manual Signing | Flag entfernen |
| UUID falsch | API Resource-ID statt Profil-UUID | UUID aus plist-Binary lesen |
| Build schlägt fehl nach Zertifikat-Erneuerung | Altes Profil noch aktiv | Profil-Delete + Neu-Erstellung im Skript |
| `time.sleep` Python SyntaxError | Sleep zwischen `try`/`except` ohne Code | Korrekte Einrückung |

---

## ðŸ—„ï¸ Backend â€” Supabase

| Eigenschaft | Wert |
|-------------|------|
| **Projekt** | bflxydqsutvpjzrevjlh |
| **URL** | https://bflxydqsutvpjzrevjlh.supabase.co |
| **Region** | Frankfurt (eu-central-1) |
| **Plan** | Free (Evaluation Pro fÃ¼r Custom Domain) |
| **Auth** | Supabase Auth (E-Mail + Magic Link) |
| **Storage** | Supabase Storage (Bucket: public-assets) |

### Wichtige Tabellen
- `profiles` â€” User-Profile, Household-VerknÃ¼pfung
- `households` â€” Haushalte (Seidl-Hofmeister)
- `products` â€” Vorratskammer-Items
- `product_categories` â€” Kategorien (Unique Constraint: household+name)
- `storage_locations` â€” Lagerorte
- `stock_transactions` â€” Bestandsbewegungen
- `affiliate_partners` â€” Amazon & Co.
- `category_affiliate_links` â€” Kategorie â†’ Affiliate-VerknÃ¼pfung

### Credentials (lokal)
- Service Role Key: `secrets/supabase_service_role.txt`
- Anon Key: `secrets/supabase_anon_key.txt`
- URL: `secrets/supabase_url.txt`

---

## ðŸŒ Website â€” kellr.app

| Eigenschaft | Wert |
|-------------|------|
| **Repo** | https://github.com/0000-kellr/kellr-blog |
| **Hosting** | GitHub Pages |
| **Domain** | https://kellr.app |
| **Tech** | Pure HTML/CSS/JS (kein Framework) |
| **Content** | data.js â€” JSON-basierte Blog-EintrÃ¤ge |
| **Sprachen** | DE + EN (Toggle) |

### Seiten
- **Hero** â€” Projektvorstellung
- **Journal** â€” TÃ¤gliche Build-Logs
- **Dashboard** â€” KI-Kosten, Commits, Features (live aus data.js)
- **About** â€” Ãœber Michael + WhatsApp Community
- **Community CTA** â€” WhatsApp Community Join-Link

---

## ðŸ“§ E-Mail â€” Resend

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

## ðŸ“¬ Kontakt â€” Microsoft 365 (geplant)

| Eigenschaft | Wert |
|-------------|------|
| **Postfach** | contact@kellr.app |
| **Status** | â³ Ausstehend â€” DNS noch einzurichten |
| **Tenant** | Privat (ms_client_id_Private.txt) |

---

## ðŸ¤– KI & Automatisierung â€” OpenClaw

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
- TestFlight Retry (alle 2h bis Upload erfolgreich)
- TestFlight Build nach Morgen 07:00 (einmalig)

---

## ðŸ“£ Social Media â€” Notion Posts Planer

| Eigenschaft | Wert |
|-------------|------|
| **DB** | b85c425b76a94007aa83a9cab5d2d45c |
| **KanÃ¤le** | LinkedIn (SeidlM) + Instagram (SeidlM) |
| **Rhythmus** | TÃ¤glich: DE 08:00, EN 14:00 |
| **Status Flow** | Placeholder â†’ ToPlan â†’ Published |
| **Inhalt** | Building in Public â€” Kellr Fortschritt |

---

## ðŸ”‘ GitHub

| Eigenschaft | Wert |
|-------------|------|
| **Organisation** | 0000-kellr |
| **App Repo** | 0000-kellr/kellr |
| **Blog Repo** | 0000-kellr/kellr-blog |
| **Token** | secrets/github_token.txt (User: Seidlm) |
| **Enterprise** | au2mator-gmbh (SAML SSO) |

### GitHub Secrets (kellr Repo)
- `APP_STORE_CONNECT_PRIVATE_KEY` â€” .p8 API Key
- `APP_STORE_CONNECT_KEY_ID` â€” GY3WY8PX59
- `APP_STORE_CONNECT_ISSUER_ID` â€” 360c0f64-...
- `APPLE_TEAM_ID` â€” QV64L84RFS
- `DIST_P12_BASE64` â€” Distribution Certificate
- `DIST_P12_PASSWORD` â€” P12 Passwort

---

## ðŸ’° Kosten-Ãœbersicht (Stand Tag 2)

| Service | Kosten |
|---------|--------|
| OpenClaw + Claude API | ~â‚¬200 (Tag 1-2, Opus-intensiv) |
| Supabase | â‚¬0 (Free Plan) |
| GitHub | â‚¬0 (Free fÃ¼r Public Repos) |
| Resend | â‚¬0 (Free: 3.000 Mails/Monat) |
| GitHub Pages | â‚¬0 |
| Apple Developer | $99/Jahr (bereits bezahlt) |
| **Total laufend** | **~â‚¬0/Monat** (excl. KI) |

---

## ðŸ“ Wo wird dieses Dokument gepflegt?

**Empfehlung:** Im `kellr-blog` Repo als `ARCHITECTURE.md` â€” damit es:
- Versioniert ist (Git History)
- Ã–ffentlich einsehbar (Building in Public)
- Von Groot automatisch aktualisiert werden kann

Alternativ als eigene Seite auf kellr.app einbaubar.

