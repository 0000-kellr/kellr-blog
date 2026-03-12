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

## au2mator Development

- **Azure DevOps PAT:** `secrets/azuredevops_pat.txt`
- **Notion Work Items DB:** `7dd5c182-e4e4-4419-a428-a34ecdcd2636`
- **Notion Releases DB:** `90545595-2d42-4e37-ab72-6ee2463cabe9`
- **GitHub Enterprise Org:** `0000-au2mator` (SAML SSO), Token: `secrets/github_token.txt`
- **Externe Dev-Firma:** Papatia (Bitbucket: `papatia/a2m.newui`)
- **Release-Kosten:** ~€8.000 pro Release mit externen Devs
- **Angebot:** Ich (Groot) kann einfachere Features für ~$5-10/Feature umsetzen

## Credentials

- **MailerLite:** `secrets/mailerlite_api_key.txt`
- **GitHub:** `secrets/github_token.txt` (User: Seidlm, Enterprise SSO)
- **Azure DevOps:** `secrets/azuredevops_pat.txt`
- **Bitbucket:** `secrets/bitbucket_token.txt` (funktioniert nicht für papatia workspace)

## Bücher

- **Buchliste DB:** `82dfe54b-4c6c-4c18-bb18-0107a437d436`
- **Aktuell:** The ONE Thing (Gary Keller)
- **Zuletzt:** Good to Great (fertig 26.02.2026)

## au2mator LPR (Least Privileged Report)

- **Master Repo:** `0000-au2mator/0000-a2m-PROD-LeastPriviligedReport` — IMMER nur hierhin pushen! (Repo wurde renamed mit 0000- Prefix)
- **Kunden-Repos:** `au2mator/...` + `485-Polytec-Holding-AG/...` — NIEMALS direkt pushen, nur via Release-Sync!
- **Workflow:** Push auf Master (`0000-au2mator`) → synct automatisch ins interne AA zum Testen → wenn OK → Release (nur nach Freigabe!) → `release-sync.yml` synct zu Kunden (`customers.json`)
- **AA Variables Prefix:** `a2m-PROD-LeastPriv-`
- **PS-Version in AA:** 7.4 (NICHT 5.1! Alles auf PS 7.4 ausrichten)
- **Auth:** 2 App Registrations (Lese-App + Mail-App), KEINE Managed Identity
- **Mail-Credentials:** Nur via AA Variables (nicht als Script-Parameter)
- **PS-Version in AA:** 7.4
- **Design:** au2mator Brand (Inter Font, #2d2d2d dark, #96c15c green, weißer Hintergrund)
- **Versionierung:** Nur Patch-Increments (0.0.1) — v2.0.0 ist für den offiziellen Live-Launch reserviert!
- **Aktuell: v1.8.17** (leerer Release, 2026-03-11) — vorher v1.8.16 Endpoint Path Normalization & Grouping
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

## Cron Jobs

- **Reading Reminder:** Alle 2 Wochen So 19:00, frage ob Michael ein Buch liest (Job: 30724787)

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
- **Status:** App Store submitted! Build #294, 8. März 2026 16:28 Uhr — wartet auf Apple Review
- **App Icon:** K-Regal auf Forest Green #1B5E35 (Michael's eigenes Design)
- **Neue Features Tag 5:** #7 SupabaseService Split, #10 Actor Isolation, #24 Local-First Images, #18 NSCache, alle P2 fixes
- **Open Issues:** #3 Onboarding Tour (P3), #14-#20 P3 — alle P2 Issues ✅ erledigt

---

_Letzte Aktualisierung: 2026-03-01_
