# Quick actions (Notion + Home Assistant)

Goal: make common actions *fast* (single command) without ad-hoc PowerShell.

## Config
Edit: `quick-actions.json`

- Notion page IDs are safe to store.
- Tokens stay in `secrets/` (gitignored).

## Commands
From workspace:

### Notion
Mark alias as Done:
```powershell
node scripts/quick/quick.mjs notion done cloudlizenz
```

Toggle MyDay for alias:
```powershell
node scripts/quick/quick.mjs notion myday cloudlizenz on
node scripts/quick/quick.mjs notion myday cloudlizenz off
```

### Home Assistant
Turn on all lights in area (uses `ha_export/construct.json`):
```powershell
node scripts/quick/quick.mjs ha light on buero
```

(If you don’t have `ha_export/construct.json` yet, run the HA export flow first.)
