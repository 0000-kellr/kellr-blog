# MEMORY.md - Long-Term Memory

## Michael - Persönliches

- Geboren am **7. Oktober 1982** (wird 42 in 2024)
- Freundin **Jasmine** - Mutter seiner beiden Kinder
- Söhne: **Leon** und **Louis**
- LinkedIn: linkedin.com/in/seidlm

## Beruflich

- **au2mator** — 2015 gegründet
- **au2mator GmbH** — ~2021/2022, komplett selbstständig gemacht

## Technisches Setup

- Nutzt **Ollama** lokal
- 2026-02-15: Download von **Mixtral 8x7B (~26 GB, Q4/Q5)** gestartet

## Konventionen

- **Account-/Zugriffs-Naming:** Alles mit Suffix `_Private` = **privat**. Alles ohne `_Private` = **geschäftlich**.
- **Kalender:** Es gibt **geschäftlich** und **privat** getrennte Kalender/Accounts (gleiche `_Private`-Konvention).
- **Tooling:** Wenn etwas auf einem gekoppelten Gerät laufen soll → bevorzugt **nodes** (z.B. `nodes.run`/`nodes.invoke`) statt **exec** (host-lokal), außer du sagst explizit „am Host ausführen“.
- **Chat-Logging:** Michael will, dass der komplette WhatsApp-Chatverlauf fortlaufend mitgeschrieben wird, damit er später darauf verweisen kann.

## Notion Setup

- **Tasks DB:** `31645ea5-eae3-4792-b4d9-5f0e7115fd44` — Property "Typ" (Task/Idee/Link/Shopping) seit 2026-02-23
- **Projects DB:** `416a22e6-76b2-498c-9760-3d58dcd3b377` — Title = "Project name"
- **Encoding:** Immer UTF-8 Bytes + Unicode Escapes für Umlaute, Rate Limiting 350-400ms
- **Inbox:** Status = "To Plan" UND kein Project verknüpft

## au2mator Strategie (Igelprinzip)

- **Leidenschaft:** Automatisierung
- **Best at:** Azure Automation für Mittelstand DACH
- **Economic Engine:** Managed Services / wiederkehrende Umsätze
- **Igel-Satz:** "Wir machen mittelständische Unternehmen im DACH-Raum durch Azure Automation effizienter – als Managed Service."

## Laufende Projekte

- **AA Youtube Videos:** 17 Episoden geplant, Episoden-DB in Notion, erstes Recording 11. März 2026
- **GitHub Einführung:** In Progress, One-Pager erstellt (DE+EN) in workspace/onepager/
- **GitHub Enterprise Migration:** DevOps → GitHub (`0000-au2mator`), Monorepo `au2mator-portal` (Backend + UI), Pipeline als GitHub Actions, in Test-Phase

## Kellr App — Version Status
- **v1.4.1 LIVE im App Store** ✅ (approved 2026-03-25, Dark Mode Fix + Auth Deep Link Fix + Registrierungs-Hint-Text)
- **v1.4.0** — ProductReadOnlyView / Tap-to-Detail (approved 2026-03-25)
- Nächste Build-Nummer: **326**
- changelog.html immer updaten wenn Release live geht

## Kellr Auth Deep Link Fix (2026-03-24) ✅ ERLEDIGT
- **Problem:** E-Mail Bestätigungslink öffnet Website statt App
- **Root Cause:** Mail-App WKWebView kann kein 302 Redirect zu kellr:// Custom URL Scheme folgen
- **Lösung:** Zwischenseite `https://kellr.app/auth-callback` (in kellr-blog deployed) leitet per JS zu `kellr://` weiter
- **redirect_to** im Swift Code: `https://kellr.app/auth-callback` (URL-encoded)
- **Supabase:** `https://kellr.app/auth-callback` als Redirect URL eingetragen ✅ — funktioniert!

## au2mator Development

- **Azure DevOps PAT:** `secrets/azuredevops_pat.txt`
- **Notion Work Items DB:** `7dd5c182-e4e4-4419-a428-a34ecdcd2636`
- **Notion Releases DB:** `90545595-2d42-4e37-ab72-6ee2463cabe9`
- **GitHub Enterprise Org:** `0000-au2mator` (SAML SSO), Token: `secrets/github_token.txt`
- **Externe Dev-Firma:** Papatia (Bitbucket: `papatia/a2m.newui`)
- **Release-Kosten:** ~€8.000 pro Release mit externen Devs
- **Angebot:** Ich (Groot) kann einfachere Features für ~$5-10/Feature umsetzen

## Credentials

⚠️ **REGEL: NIEMALS Secrets in `secrets/*.txt` speichern! Immer direkt aus 1Password lesen!**

- **GitHub:** 1Password Item-ID `uwmv5a3yo5ztoyv77jwfiilwze`, Feld `token` → `op://groot/uwmv5a3yo5ztoyv77jwfiilwze/token`
- **MailerLite:** `op://groot/Mailerlite API Key/credential`
- **Azure DevOps:** `op://groot/Azure DevOps PAT/credential`
- **Bitbucket:** `op://groot/Bitbucket Token/credential` (funktioniert nicht für papatia workspace)

## Bücher

- **Buchliste DB:** `82dfe54b-4c6c-4c18-bb18-0107a437d436`
- **Aktuell:** The ONE Thing (Gary Keller)
- **Zuletzt:** Good to Great (fertig 26.02.2026)

## au2mator LPR Landing Page — Deployment (2026-03-13)
- **WP Rocket Fix:** Seite als statisches HTML via WP Media hosten → WP Rocket greift nie ran
- **Deploy-Pattern:** HTML bearbeiten → als WP Media hochladen (Content-Type: text/html) → WP Page 2166 redirect updaten → Cache PURGE
- **DE:** `lpr-landing-v2.html` → `lpr-landing-1.html` (WP Media ID 2226)
- **EN:** `lpr-landing-en.html` via `translate-lpr-en.js` → `lpr-landing-en.html` (WP Media ID 2212) ✅ deployed + WPML verknüpft
- **WPML:** DE Page 2166 ↔ EN Page 2213 verknüpft ✅
- **Logos:** WP Media ID 2202 (white), 2203 (regular), 2204 (symbol)
- **Scripts:** `fix-inline-styles.js`, `fix-inline-styles2.js`, `translate-lpr-en.js`

## au2mator LPR (Least Privileged Report)

- **Master Repo:** `0000-au2mator/0000-a2m-PROD-LPR` — IMMER nur hierhin pushen! (renamed von `0000-a2m-PROD-LeastPriviligedReport`)
- **Kunden-Repos:** `485-Polytec-Holding-AG/485-a2m-PROD-LPR` + `764-WINTERSTEIGER-Holding-AG/764-a2m-PROD-LPR` — NIEMALS direkt pushen, nur via Release-Sync!
- **Workflow:** Push auf Master (`0000-au2mator`) → synct automatisch ins interne AA zum Testen → wenn OK → Release (nur nach Freigabe!) → `release-sync.yml` synct zu Kunden (`customers.json`)
- **AA Variables Prefix:** `a2m-PROD-LPR-`
- **PS-Version in AA:** 7.4 (NICHT 5.1! Alles auf PS 7.4 ausrichten)
- **Auth:** 2 App Registrations (Lese-App + Mail-App), KEINE Managed Identity
- **Mail-Credentials:** Nur via AA Variables (nicht als Script-Parameter)
- **PS-Version in AA:** 7.4
- **Design:** au2mator Brand (Inter Font, #2d2d2d dark, #96c15c green, weißer Hintergrund)
- **Versionierung:** Nur Patch-Increments (0.0.1) — v2.0.0 ist für den offiziellen Live-Launch reserviert!
- **Aktuell: v1.8.19** (2026-03-16) — Credential Expiry Monitor: App Reg + SP Secrets/Zertifikate mit Status (Expired/Critical/Warning/OK) im HTML Report. Neue Funktion `Get-CredentialExpiryData`, neue Sektion mit KPI-Cards + Tabelle (sortierbar/filterbar), beide Sprachen (DE/EN).
- **License Fallback: KEIN Fallback** — `Get-PermissionsMap` wirft bei jedem Fehler (403/401/429/500), kein embedded JSON, kein stiller Durchlauf ✅
- **dev-au2mator End-to-End Test: ERFOLGREICH** ✅ (2026-03-15)
- **GitHub App:** Name `a2m-PROD-LPR-syncapp`, App ID `3092323`, Private Key: `op://groot/a2m-PROD-LPR-syncapp Private Key/a2m-PROD-LPR-syncapp.pem`
- **LPR API App Registration:** Name `a2m-PROD-LPR-API`, AppId `a17bf6c8-67a5-4332-a3e0-3776d670464f`, ObjectId `c76379ae-505c-4658-b2f5-4ab477d6bf51`, Identifier URI `api://a17bf6c8-67a5-4332-a3e0-3776d670464f`, AppRole `LPR.Access` (ID: `5ac2d7a0-6621-4b00-9d51-30fa6438e930`), Scope: `api://a17bf6c8-67a5-4332-a3e0-3776d670464f/.default`
- **permissions-map.json:** 340 Endpoints, embedded im Script als Fallback (AA kann keine externen Files)
- **PowerShell Gotcha:** `$var = if(...)` nur PS 7+, in Hashtables IMMER `$(if(...))`
- **Log Analytics Gotcha:** `make_set()` liefert JSON-Strings, manuell parsen mit ConvertFrom-Json
- **OData Cast Segments:** `/graph.servicePrincipal` muss gestrippt werden für Endpoint-Matching
- **Wichtig:** `Write-Verbose` statt `Write-Output` (sonst Token-Pollution in Funktionen)
- **`$PID` ist reserviert** in PowerShell — `$spId` verwenden
- **StrictMode:** `.PSObject.Properties['name']` statt direktem Property-Zugriff; `@()` um `.Count`
- **JS in PS Here-Strings:** Kein Template Literals — nur String-Concatenation; `<script>` als `@'...'@` (single-quoted)
- **Release-Sync Workflow:** Nach Repo-Rename kaputt — manueller Sync als Workaround
- **Manueller Kunden-Sync:** PS-Script das Script von Master holt, `__VERSION__` ersetzt, zu allen Kunden pusht
- **Aktueller Stand:** v1.8.5 (nächster: v1.8.6 mit Mail-i18n)

## 1Password Integration (ab 2026-03-12)

- Vault: `groot` — alle Credentials migriert (29 Items: API Keys, Logins, Dokumente)
- Service Account Token: `secrets/op_service_account_token.txt` (Bootstrap-Einstieg, bleibt als Datei)
- op.exe: im User-PATH (WinGet), Details in TOOLS.md
- Zugriff in Scripts: Node.js `spawnSync(opExe, ['read', 'op://groot/Item/field'], { stdio: ['ignore',...] })`
- PowerShell stdin-Fix: `cmd /c '"op.exe" item ... < NUL'`
- `.txt` Secrets noch als Fallback vorhanden

## Composio + Canva (entfernt 2026-03-12)

- Getestet, aber Canva API erlaubt kein programmatisches Zeichnen von Elementen
- Autofill nur mit leeren Template-Feldern möglich — zu wenig für Architecture Diagrams
- Composio maskiert OAuth-Token → kein direkter Asset-Upload möglich
- **Entscheidung:** Composio/Canva entfernt. Diagramme als HTML/SVG oder PowerPoint erstellen.

## Notion Task Planung — Pflichtfelder
Wenn ein Task geplant wird (Due Date gesetzt), IMMER folgende Felder setzen — wenn nicht erwähnt: NACHFRAGEN!
- **Status** → "Not Started"
- **Estimates** → Zeitschätzung (z.B. "30min", "2h")
- **Planing** → Plan (`IW^;`) · Best Effort (`EEQK`) · Least Effort (`c00a1338-93a9-4ba6-84be-b6b57f4177d7`)
  - Plan = strikt an diesem Tag · Best Effort = erster freier Slot · Least Effort = nächster freier Slot zum Due Date

## Kellr Stats Dashboard — Deployment (2026-03-15)

- **Live URL:** `kellr.app/stats/`
- **Private Repo:** `0000-kellr/kellr-metrics` — GitHub Actions Workflow ID `246538085`
- **Workflow:** täglich 06:00 UTC → fetcht Daten → pusht `data/metrics.json` + `stats/index.html` nach `kellr-blog`
- **Design:** Kellr-Style (Dark Mode, #34C759 grün, System Font)
- **Nav-Link:** `index.html` updated: `#stats` → `/stats/`
- **Quellen:** GoatCounter ✅ · App Store Connect ✅ · Supabase ✅ · Amazon (manuell)
- **App Store Connect:** Team Key ID `7H9LF88CVV`, Issuer `360c0f64-c428-4121-a5b4-05b3bcc90e92`, Vendor Nr `94063707`
- **1Password:** "appstore connect statistik key" (item `tfohrjo224ug37ld2trlrgq3l4`) — Key ID, Issuer ID, Vendor Nr, .p8 File
- **GitHub Secrets (kellr-metrics):** GOATCOUNTER_TOKEN, GOATCOUNTER_SITE, APPSTORE_KEY_ID, APPSTORE_ISSUER_ID, APPSTORE_PRIVATE_KEY, APPSTORE_VENDOR_NO, APPSTORE_APP_ID, SUPABASE_URL, SUPABASE_SERVICE_KEY, KELLR_BLOG_TOKEN
- **Supabase Fix:** REST API `?select=id` + `Prefer: count=exact` + `Range: 0-0` → Count aus `Content-Range` Header (kein exec_sql!)
- **Stand 2026-03-15:** Downloads 7d=23, Rating=5.0★, Reviews=1, HH=16, Users=20, Visitors 7d=83

## Anthropic Kosten (API Format geändert)

- API gibt jetzt Token-Counts statt cost_usd — Preise: Input $3/MTok, Cache Write $3.75/MTok, Cache Read $0.30/MTok, Output $15/MTok
- 13.3.: **$74.81** | 14.3.: **$61.55** | 15.3.: noch nicht verfügbar (1 Tag Delay)
- Hauptkostentreiber: Cache Writes (~80% der Kosten)

## Pipedrive — Monday Outreach Flow

**Jeden Montag** auf Michaels Anstoß hin:
1. Pipedrive Filter 74 ("New Community Downloads") abfragen
2. Filter: aktuelles Jahr, Business-Mail (kein Gmail/Yahoo/Libero/Hotmail/etc.), noch nicht kontaktiert (`email_messages_count == 0`), keine Fake/Test-Daten
3. Duplikate zusammenführen (gleicher Name mehrfach → einmal behalten)
4. Personalisierte Mail-Entwürfe schreiben (EN Standard, DE wenn Person/Firma klar DACH)
5. Als pinned Note in Pipedrive anlegen (Format: "EMAIL DRAFT\n\nTO: ...\nSUBJECT: ...\n\nBody")
6. Michael geht Liste durch und sendet selbst
7. Nach Abschluss: alle EMAIL DRAFT Notes löschen
- Meeting-Link immer einbauen: https://click.au2mator.com/MEET_CommunityDownload
- Free-Mail-Domains ausschließen: gmail, yahoo, hotmail, outlook, live, icloud, gmx, web.de, t-online, libero.it, tiscali.it, virgilio.it, home.nl, sapo.pt, naver.com, proton.me, email.com

## au2mator Consulting Website (au2mator-consulting.com)

- **Domain:** au2mator-consulting.com (WordPress, live ✅)
- **WP Credentials:** 1Password Item `kn6nc2zdpqnp6bhibyw5nht4ii` ("openclaw consulting HP"), User: `openclaw`, API Key im Feld "API"
- **Rolle:** Groot ist permanenter **Webadmin** — zuständig für Content, Security, Performance, Plugin-Hygiene
- **Aufgabe:** Consulting-Portfolio-Site, zeigt Projekte nach Technologie gefiltert (au2mator Portal / ServiceNow / Jira)
- **Plugins (aktiv):** Elementor Pro, Polylang + Connect Polylang for Elementor, Yoast SEO, WP Mail SMTP Pro, Antispam Bee, Code Snippets
- **Impressum-Daten:** workspace/au2mator-consulting-impressum-data.md (au2mator GmbH, Wilhelm-Fein-Strasse 37, 4540 Pfarrkirchen, FN 609158x, ATU79770507)
- **Sprachen:** DE (default) + EN via Polylang
- **Projekte:** 5 Consulting Cases aus Notion (BauMit, Wintersteiger, Playtika, Energie AG, Greiwing)
- **Build:** Sub-Agent `a2c-website-build` läuft (gestartet 2026-03-18 ~14:00)
- **Webadmin-Pflichten:** Plugins aktuell halten, Security-Headers, Performance, Inhalte pflegen, Leads generieren

## Kellr X (@kellr_app)

- **Account:** @kellr_app (Twitter/X), User ID: `2035411178349047808`
- **1Password:** Item `2kygrqd7nguhiseitxg6znldhu` ("X (Twitter) API - Kellr"), Vault: groot
- **Auth:** OAuth2 User Token (Access + Refresh Token in 1Password)
- **Strategie:** Deutsch, Hashtags: #Vorratskammer #Haushaltstipps #Kellermanagement #Prepper #Blackoutvorsorge #Krisenvorsorge #Notvorrat
- **Scripts:** `scripts/x-daily-post.mjs`, `scripts/x-refresh-token.mjs`, `scripts/x-post.mjs`
- **npm:** `twitter-api-v2` installiert im workspace

## Cron Jobs

- **Reading Reminder:** Alle 2 Wochen So 19:00, frage ob Michael ein Buch liest (Job: 30724787)
- **Kellr Daily Post (X + FB + IG):** täglich 10:00 Uhr Wien → `scripts/kellr-daily-post.mjs` (Job: 942162d8-ac7c-4332-8a92-6b4d7017e664)
- **Kellr Engagement (X + FB + IG):** täglich 12:00 + 18:00 Uhr Wien → `scripts/kellr-engagement.mjs` (Job: 3a0499f4-429f-4762-8519-85990d570ec5)
- **Kellr X Weekly Report:** jeden Montag 09:00 Uhr Wien → WhatsApp Report (Job: 470e0ec0-1607-468e-b1ef-9f729c959d42)

## Kellr Social Media (ab 2026-03-22)

- **Facebook Page:** "kellr" (ID: `1011515808714434`) — Page Token in 1Password
- **Instagram:** @kellr_app (ID: `17841438133721668`) — via Facebook Page Token
- **App:** "Kellr App Business" (App ID: `951620470661905`) — 1Password Item: "Kellr Social Media API"
- **System User:** "Kellr bot" — Token läuft nicht ab
- **Scripts:** `kellr-daily-post.mjs` (alle 3 Kanäle), `kellr-engagement.mjs` (Comments/Likes/Mentions)

## SC Basic Landing Page — Deployment
- **WP Page (DE):** ID 2236, URL `https://au2mator.com/ma-sourcecontrol/` (slug: `ma-sourcecontrol`) *(neu erstellt 2026-03-15, war 2232)*
- **WPML:** DE Page 2236 ↔ EN Page 2234 verknüpft ✅ (2026-03-15)
- **WP Media (DE):** ID 2238, URL `https://au2mator.com/wp-content/uploads/2026/03/sc-landing-de.html`
- **WP Page (EN):** ID 2234, URL `https://au2mator.com/ma-sourcecontrol-en/` (slug: `ma-sourcecontrol-en`)
- **WP Media (EN):** ID 2239, URL `https://au2mator.com/wp-content/uploads/2026/03/sc-landing-en.html`
- **Local source (DE):** `workspace/sc-landing-v1.html` (CTAs → `https://au2mator.com/ma-sourcecontrol/`)
- **Local source (EN):** `workspace/sc-landing-en.html` (via `scripts/translate-sc-en.js` + `translate-sc-en-fix.js`)
- **Deploy-Pattern:** HTML bearbeiten → DELETE altes Media → POST neues → Page bleibt → PURGE
- **WPML:** DE↔EN noch nicht verknüpft (manuell in WP Backend erledigen)

## Freie Schule Kremstal Website
- URL: http://fsk.m-seidl.com/ (WordPress, live!)
- **Rechtliches (erledigt 2026-03-05):**
  - Impressum (ID 103): ZVR 527942996, Bildungswerkstatt Kremstal, Obmann Harald Zehetner, Kassier Dietmar Amon, BH Kirchdorf, §5 ECG
  - Datenschutzerklärung (ID 113, /datenschutz/): DSGVO-konform, YouTube-Consent-Hinweis, DSB-Beschwerde-Recht
  - Footer-Menü (ID 3): Impressum (105) + Datenschutz (116) ✅
  - YouTube Click-to-Play Consent: fsk-yt-consent widget auf Startseite, lädt youtube-nocookie.com erst nach Klick
  - CSS-Klassen: `.fsk-yt-consent` (YouTube-Overlay) + `.fsk-legal-wrap` (Legal-Seiten-Typography) in fsk-dropdown.css
- Theme: Hello Elementor, Plugin: Elementor 3.35.6 + The Events Calendar
- 2 Design-Mockups lokal: workspace/fsk-mockups/
- **WP Custom CSS sanitisiert `>` zu `&gt;`** → Dropdown-CSS immer als MU-Plugin!
- **wp_update_nav_menu_item** immer mit vollständigen Parametern (url+object+type) → sonst URLs weg!
- MU-Plugins: fsk-dropdown-plugin.php, fsk-events-hero.php
- Seiten: Startseite=9, Unsere Schule=10, Pädagogik=11, Team=12, Aktuelles=13, Kontakt=14, Der Verein=86, Aufnahmeverfahren=96, Unterstützer=101
- Nav: Über Uns (ID 88, parent) → Team, Der Verein, Aufnahmeverfahren, Unterstützer
- Menüpunkt "Termine" (war Aktuelles) → /events/
- Transparentes Logo: Freie_Schule_Kremstal-Logo_trans.png (im fsk-mockups Ordner)
- 18 Schulfotos (IDs 64-81) mit Gaussian Blur σ=12 verarbeitet

## Kellr App — Wichtige Learnings
- **COMMIT-REGEL (kritisch):** NIEMALS ohne explizites OK von Michael committen/pushen. Lösung zeigen → warten → erst auf "ok"/"commit" pushen.
- **BUILD-REGEL (kritisch):** TestFlight hat ein tägliches Build-Limit (~90/Tag über ALLE Apps). JEDEN Commit mit `[skip ci]` pushen. Builds NUR manuell triggern wenn Michael sagt "Build" oder "TestFlight". NIEMALS automatische Builds durch normalen Push. Mehrere Fixes IMMER in EINEM Commit bündeln. Diese Regel wurde 8 Tage in Folge gebrochen — NIE WIEDER.
- **project.pbxproj**: Neue Swift-Dateien via GitHub API brauchen manuellen Eintrag in pbxproj (sonst "cannot find in scope")
- **pbxproj Dateinamen mit `+`**: MÜSSEN gequotet werden: `path = "SupabaseService+Auth.swift";` (unquoted = Parse Error)
- **pbxproj BOM**: Immer vom git-Baseline holen (nicht lokal cachen). PowerShell `Set-Content -Encoding UTF8` fügt BOM hinzu → Xcode Parse Error. Fix: `[System.Text.UTF8Encoding]::new($false)` + `.TrimStart([char]0xFEFF)`
- **pbxproj Baseline**: Für Patches immer `?ref=<commit-sha>` vom letzten bekannt-guten Commit holen
- **Build Race Condition**: Mehrere Commits schnell hintereinander → parallele Builds → TestFlight kriegt ältere Version. Immer Commits bündeln.
- **Sub-Agent Encoding**: Sub-Agents machen IMMER Encoding-Fehler bei Umlauten in Swift. Lieber selbst direkt machen.
- **macos-26 Runner**: Apple Silicon GitHub Actions Runner kann stundenlang queued sein. `workflow_dispatch` Trigger zum manuellen Auslösen hinzufügen.
- **Compositing**: Schwarzer Hintergrund PNG/JPEG → einfach zu ersetzen (keine AA-Probleme). Weiß → schwierig.
- **App Icon**: AppIcon-1024.png = Michael's K-Regal-Design auf Forest Green #1B5E35. Alle 13 Größen in AppIcon.appiconset/

## Kellr pbxproj — ID-Vergabe (KRITISCH, kein Subagent darf das ignorieren!)
Beim Hinzufügen neuer Swift-Dateien via GitHub API IMMER die nächste freie ID verwenden.
**Belegte IDs (Stand 2026-03-26):**
- A100.../A200...0001–0021: Kern-Views/Models
- A100.../A200...0030–0037: Services, Auth, Onboarding etc.
- A100.../A200...0040, 0042: Kellr.entitlements, ExpiryDateScannerView
- A100.../A200...0049: ProductReadOnlyView
- **A100.../A200...0050: Config.swift** ← BELEGT! Nicht nochmal vergeben!
- **A100.../A200...0051: KeychainHelper.swift**
- A100.../A200...0060: ChangePasswordView (neu, 2026-03-26)
- BB.../DD...: ProductGroup, ProductCategory, PendingStockOp, KellrModelContainer, SyncEngine, SupabaseModels, SupabaseService+*
- **Nächste freie ID: A200...0061 / A100...0061**

**Regel:** Vor jedem neuen File → pbxproj vom aktuellen Commit holen, grep nach letzter ID, erst dann neue vergeben. NIE blind hochzählen ohne Check.

## Kellr App — Konventionen
- **KEINE lokalen Files** für Kellr-Content. Alles entweder in **GitHub** (Doku, Code) oder **Notion** (Tasks, Orga).
- Notion = To-dos + organisatorischer Kontext. GitHub = Code + Dokumentation (`docs/`).
- Wenn ein Notion-Task Infos braucht → in den Task schreiben oder auf GitHub verlinken.
- `docs/` im Repo: appstore-listing.md, media-kit.md (+ brand-guidelines.md, privacy-policy.md geplant)

## Kellr App (Projekt)

### Infrastruktur
- **GitHub Org:** `0000-kellr` (repos: kellr, kellr-blog)
- **Website:** https://kellr.app (GitHub Pages, live ✅)
- **E-Mail:** noreply@kellr.app via Resend (SMTP in Supabase konfiguriert, Domain verified ✅)
- **Kontakt:** contact@kellr.app via O365 ✅
- **WhatsApp Community:** https://chat.whatsapp.com/GLYnFf0Orue5seSZevmP1h
- **Architektur-Doku:** ARCHITECTURE.md in `kellr-internal` (privat!) + lokal in workspace/kellr-architecture.md — NICHT in kellr-blog (public)

### Signing
- Distribution Cert: MT8Z7MGMFU (iOS Distribution: Michael Seidl, läuft bis 2027-03-02)
- Private Key: secrets/dist_private_key.pem, P12: secrets/dist_signing.p12 (Passwort: kellr2026)
- GitHub Secrets: DIST_P12_BASE64 + DIST_P12_PASSWORD

### Resend
- Admin API Key: secrets/resend_admin_api_key.txt
- Send API Key: secrets/resend_api_key.txt
- Domain ID: 136da6c9-daef-48a3-a48b-a02f2988a73a ✅ verified (2026-03-05)

### Cron Jobs aktiv
- keine aktiven Kellr-spezifischen Crons (TestFlight Retry war einmalig, erledigt)

### App Details
- **Was:** Vorratskammer-Tracker iOS App mit Supabase Backend
- **Repo:** https://github.com/0000-kellr/kellr (Org: 0000-kellr — umgezogen von 0000-au2mator)
- **Tech:** SwiftUI + Supabase (Frankfurt) + GitHub Actions → TestFlight
- **Bundle ID:** com.au2mator.kellr
- **Supabase:** bflxydqsutvpjzrevjlh.supabase.co
- **TestFlight:** Internal Gruppe "Familie", Public Link: https://testflight.apple.com/join/NGG31k6t
- **Amazon Affiliate:** kellr-21
- **Haushalt:** "Seidl-Hofmeister" (Michael + Jasmine)
- **Jasmine Apple ID:** Jasmine1@gmx.at
- **Status:** Live im App Store ✅ (approved nach Submit 8. März 2026)
- **App Icon:** K-Regal auf Forest Green #1B5E35 (Michael's eigenes Design)
- **Neue Features Tag 5:** #7 SupabaseService Split, #10 Actor Isolation, #24 Local-First Images, #18 NSCache, alle P2 fixes
- **Open Issues:** #3 Onboarding Tour (P3), #14-#20 P3 — alle P2 Issues ✅ erledigt

---

_Letzte Aktualisierung: 2026-03-01_
