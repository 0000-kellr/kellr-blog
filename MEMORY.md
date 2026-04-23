# MEMORY.md - Long-Term Memory

## Michael - Persönliches

- Geboren am **7. Oktober 1982** (43 in 2026)
- Freundin **Jasmine** - Mutter seiner beiden Kinder
- Söhne: **Leon** und **Louis**
- LinkedIn: linkedin.com/in/seidlm

## Beruflich

- **au2mator** — 2015 gegründet, seit ~2021/2022 GmbH, komplett selbstständig
- **Buch:** "From scripting basics to enterprise automation with Azure, Entra ID, and APIs" (co-author mit Ahmed Uzejnovic) — Amazon: https://amzn.eu/d/0aQLLOyK
- **PowerShell Summit 2026** (Bellevue/Seattle, 13.–16. April 2026): 2 Sessions
  - Di: "Get started with PowerShell and MS GRAPH API and become a Pro" (1:15pm, Room 406)
  - Do: "8 Ways to Screw Your Azure Automation" (2:00pm, Room 405)
  - Buch-Vorstellung + Verlosung + Manner Wafferl 🧇

## Konventionen

- **Account-Naming:** Suffix `_Private` = privat, ohne = geschäftlich (gilt für Kalender, Accounts, etc.)
- **Tooling:** Gerät → **nodes** bevorzugen statt exec (außer Michael sagt „am Host ausführen")
- **Chat-Logging:** kompletter WhatsApp-Chatverlauf soll mitgeschrieben werden

## Notion Setup

- **Tasks DB:** `31645ea5-eae3-4792-b4d9-5f0e7115fd44` — Property "Typ" (Task/Idee/Link/Shopping)
- **Projects DB:** `416a22e6-76b2-498c-9760-3d58dcd3b377`
- **Encoding:** Immer UTF-8, Rate Limiting 350-400ms
- **Inbox:** Status = "To Plan" UND kein Project verknüpft

### Kundenprojekte
- **Organizations DB:** `1cbd0a63-9c4f-4933-a80e-3d1246e7c177`
- **Projects Doings DB:** `124e2066-cdfc-4254-8ff0-218d78535e6e`
- **Doing Status Text:** IMMER als Notion `mention` mit `type: date`, NIE Freitext `@today`
- Format: `[{type:"mention", mention:{type:"date", date:{start:"YYYY-MM-DD"}}}, {type:"text", text:{content:" \n- Erfasst"}}]`

### Task Planung — Pflichtfelder
Bei geplanten Tasks (Due Date) IMMER: Status, Estimates, Planing
- Plan = `IW^;` · Best Effort = `EEQK` · Least Effort = `c00a1338-93a9-4ba6-84be-b6b57f4177d7`

## au2mator Strategie

- **Igel-Satz:** "Mittelständische Unternehmen im DACH-Raum durch Azure Automation effizienter — als Managed Service."

## Laufende Projekte

- **AA Youtube Videos:** 17 Episoden geplant, Episoden-DB in Notion, erstes Recording 11. März 2026
- **GitHub Einführung:** One-Pager erstellt (DE+EN) in workspace/onepager/
- **GitHub Enterprise Migration:** DevOps → GitHub (`0000-au2mator`), Monorepo `0000-au2mator-portal` ✅ FERTIG (2026-03-26), Build bei Push auf master, Version Bump aktiv
  - **TODO: IIS Auto-Deploy** — Azure VM → Azure CLI + VM Run Command + Blob Storage. Details: Subscription ID, RG+VM Name, IIS Site+Name nötig.

## Zuverlässigkeit — Non-Negotiable

Michael soll **nie derjenige sein, der mir sagt dass etwas falsch gelaufen ist.**
- Jeder Cron/Script/Sub-Agent braucht Fehler-Alerting. Kein Job ohne `failureAlert`.
- Ich bin die Überwachungsinstanz, nicht Michael.
- Bei Heartbeats: Cron-Job-Status prüfen, bei `consecutiveErrors > 0` sofort WhatsApp.

## au2mator Development

- **Notion Work Items DB:** `7dd5c182-e4e4-4419-a428-a34ecdcd2636`
- **Notion Releases DB:** `90545595-2d42-4e37-ab72-6ee2463cabe9`
- **GitHub Enterprise Org:** `0000-au2mator` (SAML SSO)
- **Externe Dev-Firma:** Papatia (Bitbucket: `papatia/a2m.newui`)
- **Release-Kosten:** ~€8.000 pro Release mit externen Devs

## au2mator LPR (Least Privileged Report)

- **Master Repo:** `0000-au2mator/0000-a2m-PROD-LPR` — IMMER nur hierhin pushen!
- **Kunden-Repos:** `485-Polytec-Holding-AG/485-a2m-PROD-LPR` + `764-WINTERSTEIGER-Holding-AG/764-a2m-PROD-LPR` — NIE direkt pushen!
- **PS-Version in AA:** 7.4 | **Auth:** 2 App Registrations, KEINE Managed Identity
- **Versionierung:** Nur Patch-Increments (0.0.1) — v2.0.0 für offiziellen Live-Launch reserviert!
- **Aktuell: v1.8.19** (2026-03-16)
- **GitHub App:** `a2m-PROD-LPR-syncapp`, App ID `3092323`, Key: `op://groot/a2m-PROD-LPR-syncapp Private Key/a2m-PROD-LPR-syncapp.pem`
- **LPR API App:** `a2m-PROD-LPR-API`, AppId `a17bf6c8-67a5-4332-a3e0-3776d670464f`
- **PS Gotchas:** `$var = if(...)` nur PS 7+; `Write-Verbose` statt `Write-Output`; `$PID` ist reserviert → `$spId`; StrictMode: `.PSObject.Properties['name']`; JS in PS Here-Strings: kein Template Literals

## au2mator LPR Landing Page

- **DE:** WP Page 2166, WP Media ID 2226 | **EN:** WP Page 2213, WP Media ID 2212 ✅
- **Deploy-Pattern:** HTML → WP Media → Page redirect → Cache PURGE

## au2mator Internal Runbooks — Notion Schema
- **Header:** `@{"Authorization"="Bearer $Notion_API"; "Notion-Version"="2021-08-16"}`
- **Referenz:** RB_073 (höchste Nummer = bester Code)

## au2mator Consulting Website

- **Domain:** au2mator-consulting.com (WordPress, live ✅)
- **WP Credentials:** 1Password `kn6nc2zdpqnp6bhibyw5nht4ii`, User: `openclaw`
- **Sprachen:** DE (default) + EN via Polylang
- **Projekte:** 5 Cases (BauMit, Wintersteiger, Playtika, Energie AG, Greiwing)

## Credentials

⚠️ **REGEL: NIEMALS Secrets in `secrets/*.txt`! Immer aus 1Password!**

- **GitHub:** `op://groot/uwmv5a3yo5ztoyv77jwfiilwze/token`
- **MailerLite:** `op://groot/Mailerlite API Key/credential`
- **Azure DevOps:** `op://groot/Azure DevOps PAT/credential`
- **Bitbucket:** `op://groot/Bitbucket Token/credential`

## 1Password Integration

- Vault: `groot` — alle Credentials (29+ Items)
- Service Account Token: `secrets/op_service_account_token.txt` (bleibt als Datei)
- op.exe: im User-PATH (WinGet), Details in TOOLS.md

## Bücher

- **Buchliste DB:** `82dfe54b-4c6c-4c18-bb18-0107a437d436`
- **Aktuell:** Selbstbild (Carol S. Dweck, Audible) | **Zuletzt:** The ONE Thing (fertig 09.04.2026)

## Pipedrive — Monday Outreach Flow

Jeden Montag auf Michaels Anstoß:
1. Filter 74 ("New Community Downloads") — Business-Mail, noch nicht kontaktiert, kein Fake
2. **VOR dem Erstellen prüfen (BEIDE Checks):**
   - `email_messages_count > 0` → bereits per Mail kontaktiert → Überspringen!
   - Note mit "EMAIL DRAFT" bereits vorhanden → ebenfalls Überspringen!
   - API: `GET /persons/{id}?fields=email_messages_count`
3. Personalisierte Mail-Entwürfe (EN default, DE wenn DACH klar)
4. Als pinned Note in Pipedrive: "EMAIL DRAFT\n\nTO: ...\nSUBJECT: ...\n\nBody"
5. Michael sendet selbst → danach Drafts löschen
- Meeting-Link: https://click.au2mator.com/MEET_CommunityDownload
- Free-Mail ausschließen: gmail, yahoo, hotmail, outlook, live, icloud, gmx, web.de, t-online, libero.it, etc.

## Kellr Push Notifications (v1.6.0) — LIVE ✅ (2026-04-04)
- **APNs Key:** ID `892653Q99T`, Team `QV64L84RFS`
- **1Password:** "Kellr APNs Key (AuthKey_892653Q99T.p8)"

## Kellr Roadmap
- **v1.6.0** → ✅ LIVE (2026-04-04): Push Notifications + Deep Links + Action Buttons
- **v2.0.2** → ✅ LIVE (2026-04-11): Kellr Pro Paywall + Privacy/Terms Links Fix
- **v2.0.3** → ✅ LIVE
- **v2.0.6** → ✅ LIVE (2026-04-21): Preisvergleich + Stock-Bugfix #85
- **v2.0.5** → ✅ LIVE (2026-04-17): Paket-Tracking, ConsumptionBarChart, Long Press Copy, Subscription-Logic Refactor
- **v2.0.6** → ✅ LIVE (2026-04-21): Preisvergleich Feature, Stock-Bugfix (#85 quantity persistence)
- **v2.0.7** → ✅ LIVE (2026-04-23): Tracking Status-Dot (grün/rot), Carrier-Bugfix Webhook
- **v3.0** → Apple Watch App (Issue #56)

## Kellr App — Version Status
- **v1.5.0 LIVE** ✅ (2026-03-26) | **v1.6.0 LIVE** ✅ | **v2.0.2 LIVE** ✅ (2026-04-11) | **v2.0.3** eingereicht | **v2.0.5 LIVE** ✅ (2026-04-17)
- changelog.html immer updaten wenn Release live geht

## Kellr Stats Dashboard
- **Live URL:** `kellr.app/stats/`
- **Repo:** `0000-kellr/kellr-metrics`, täglich 06:00 UTC
- **App Store Connect:** Key `V8PRSQAK93` (App-Manager, Groot App Manager), Issuer `360c0f64-c428-4121-a5b4-05b3bcc90e92`, App-ID `6759869739`, Vendor `94063707`
- **Statistik Key:** `7H9LF88CVV` (Sales/Trends only, kein Reviews-Zugriff)
- **GoatCounter:** Token in 1Password `j24a4r5oclfz4ahp2xly3mndwu`, API: start/end Parameter (nicht period=week!)

## Kellr X (@kellr_app)
- **Account:** @kellr_app, User ID: `2035411178349047808`
- **1Password:** `2kygrqd7nguhiseitxg6znldhu`
- **Hashtags:** #Vorratskammer #Haushaltstipps #Kellermanagement #Prepper #Blackoutvorsorge
- **Scripts:** `scripts/kellr-daily-post.mjs`, `scripts/kellr-engagement.mjs`, `scripts/x-post.mjs`

## Kellr Social Media
- **Facebook Page:** "kellr" (ID: `1011515808714434`)
- **Instagram:** @kellr_app (ID: `17841438133721668`) — via Facebook Page Token
- **App:** "Kellr App Business" (App ID: `951620470661905`) — 1Password: "Kellr Social Media API"
- **System User:** "Kellr bot" — Token läuft nicht ab

## Cron Jobs
- **Reading Reminder:** So 19:00 alle 2 Wochen (Job: 30724787)
- **Kellr Daily Post (X + FB + IG):** täglich 10:00 Wien (Job: a4f0881c) — failureAlert + gpt-4o Fallback
- **Kellr Engagement (X + FB + IG):** 12:00 + 18:00 Wien (Job: 423d5650) — failureAlert aktiv
- **Kellr X Weekly Report:** Mo 09:00 Wien → WhatsApp (Job: 2eafa616)
- **Morning Dream Briefing:** täglich 06:00 Wien → WhatsApp an Michael (Job: be62eafb) — failureAlert aktiv

## Kellr App — Wichtige Learnings
- **COMMIT-REGEL:** NIEMALS ohne explizites OK von Michael committen/pushen.
- **ASC SUBMIT-REGEL:** Vor dem Submit immer in ASC prüfen welcher Build die korrekte Marketing Version hat. Build-Nummer ≠ Marketing Version! Nie blind nach Build-Nummer submitten.
- **BUILD-REGEL:** IMMER `[skip ci]` in Commit-Message. Build NUR wenn Michael explizit "Build" sagt. Mehrere Fixes in EINEM Commit bündeln.
- **pbxproj:** Neue Swift-Dateien brauchen manuellen Eintrag. Dateinamen mit `+` müssen gequotet werden. BOM-Problem mit PowerShell → `[System.Text.UTF8Encoding]::new($false)`.
- **Sub-Agent Encoding:** Sub-Agents machen Encoding-Fehler bei Umlauten in Swift → lieber selbst machen.
- **macos-26 Runner:** Kann stundenlang queued sein.

## Kellr pbxproj — ID-Vergabe (KRITISCH)
**Belegte IDs (Stand 2026-03-27):**
- A1.../A2...0001–0021, 0030–0037, 0040, 0042, 0049–0051, 0060–0061
- BB.../DD...: ProductGroup, ProductCategory, PendingStockOp, KellrModelContainer, SyncEngine, SupabaseModels, SupabaseService+*
- **Nächste freie ID: A200...0062 / A100...0062**
- Vor neuem File → pbxproj vom aktuellen Commit holen und letzte ID prüfen!

## Kellr Social Media — Release Posts
- Bei Release-Posts: **Bild muss zur Version passen!** Nie ein altes Release-Bild recyceln.
- Workflow: Neues Bild generieren (Imagen/DALL-E) mit korrekter Versionsnummer → Upload zu kellr-blog → dann posten
- Bild-Format: Dark green (#1B5E35), weiß bold Versionsnummer + "Now Live", Kellr K-Logo
- Release-Bild Naming: `kellr-vX.X.X-release.jpg` in `assets/social/`

## Kellr App — Konventionen
- **KRITISCH: [skip ci] bei JEDEM Kellr Commit!**
- **BUILD-REGEL ERWEITERT:** Immer sammeln, dann auf explizites "OK bauen" von Michael warten — NIEMALS automatisch bauen/deployen ohne Freigabe!
- Notion = Orga/Tasks, GitHub = Code/Doku (`docs/`)
- **TOOLS.md** für kritische Details: Supabase-URL, Bundle ID, Signing etc.

## Kellr App (Infrastruktur)
- **GitHub Org:** `0000-kellr` (repos: kellr, kellr-blog)
- **Website:** https://kellr.app | **Bundle ID:** com.au2mator.kellr
- **Supabase:** bflxydqsutvpjzrevjlh.supabase.co (Frankfurt)
- **TestFlight:** https://testflight.apple.com/join/NGG31k6t (Internal: "Familie")
- **Distribution Cert:** MT8Z7MGMFU (läuft bis 2027-03-02)
- **App Icon:** K-Regal auf Forest Green #1B5E35 (Michaels Design)
- **Haushalt:** "Seidl-Hofmeister" | Jasmine Apple ID: Jasmine1@gmx.at

## Freie Schule Kremstal
- URL: http://fsk.m-seidl.com/ — WordPress, live ✅
- MU-Plugins: fsk-dropdown-plugin.php, fsk-events-hero.php
- WP Custom CSS sanitisiert `>` zu `&gt;` → Dropdown-CSS immer als MU-Plugin!
- Seiten: Startseite=9, Unsere Schule=10, Pädagogik=11, Team=12, Aktuelles=13, Kontakt=14

---

_Letzte Aktualisierung: 2026-04-09_

## Promoted From Short-Term Memory (2026-04-17)

<!-- openclaw-memory-promotion:memory:memory/2026-03-10.md:1:28 -->
- # 2026-03-10 — KELLR GOLIVE + LPR v1.8.16 ## 🎉 KELLR IST IM APP STORE LIVE! - **App Store Link:** https://apps.apple.com/app/kellr/id6759869739 - **App Store ID:** id6759869739 - Apple Review bestanden, "1.0 Bereit für Vertrieb" - Homepage kellr.app updated mit echtem App Store Link (war id0000000000 Platzhalter) - EU Händlerstatus: Michael hat Privatperson-Daten in App Store Connect eingetragen (EU Digital Markets Act Pflicht, auch für kostenlose Apps) - Developer Account: Privat (nicht GmbH) ## LPR v1.8.16 - **Endpoint Path Normalization:** GUIDs → `{id}`, volle URLs → relative Pfade - **Endpoint Grouping:** Gleiche Patterns zusammengefasst mit Call-Count statt einzelne Zeilen - **Header Fix:** Category + Calls Spalten hinzugefügt - Release v1.8.16 erstellt + an alle 3 Kunden synced - **Kunden-Repo-Namen (korrekt!):** - au2mator: `au2mator/a2m-PROD-LeastPriviligedReport` - Polytec: `485-Polytec-Holding-AG/485-a2m-PROD-LeastPriviligedReport` - Wintersteiger: `764-WINTERSTEIGER-Holding-AG/764-a2m-PROD-LeastPriviligedReport` - Leerer Commit für Sync-Workflow-Trigger - Script heißt jetzt `Invoke-LeastPrivilegedReport.ps1` (umbenannt) ## LPR OnePager - OnePager im au2mator PIM-Design erstellt (Montserrat, Nexa Bold, #2d2d2d/#96c15c) - Vorlage: `workspace/onepager/pim-feature-comparison.html` - Mehrere Iterationen: weniger Tabellen, mehr Cards, alles auf eine Seite - Feature Cards, Risk Category Cards (Optimal/Excessive/Unmatched/No Activity), Benefit Cards - Prerequisites: Azure Automation, Entra ID P1/P2, Log Analytics [score=0.841 recalls=5 avg=0.399 source=memory/2026-03-10.md:1-28]
