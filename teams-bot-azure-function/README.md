# OpenClaw Teams Bot (Azure Function)

This is a minimal Bot Framework endpoint hosted as an Azure Function.

It exposes **POST /api/teams/messages**.

## Prereqs
- Node.js 20+
- Azure Functions Core Tools v4 (`npm i -g azure-functions-core-tools@4 --unsafe-perm true`)
- Azure CLI (`az`)

## Local run
1) Copy template settings:
```powershell
cp .\local.settings.json.template .\local.settings.json
```
2) Fill in `MicrosoftAppId` + `MicrosoftAppPassword`.

3) Install + run:
```powershell
npm i
func start
```

Local endpoint:
- http://localhost:7071/api/teams/messages

## Azure deploy (recommended)
### 1) Create resources
```powershell
az login
az group create -n rg-openclaw-teams -l westeurope
az storage account create -g rg-openclaw-teams -n stopenclawteams$RANDOM -l westeurope --sku Standard_LRS
az functionapp create -g rg-openclaw-teams -n fa-openclaw-teams-<unique> --storage-account <storageName> --consumption-plan-location westeurope --runtime node --runtime-version 20 --functions-version 4
```

### 2) Configure app settings
```powershell
az functionapp config appsettings set -g rg-openclaw-teams -n fa-openclaw-teams-<unique> --settings \
  MicrosoftAppId=<APP_ID> \
  MicrosoftAppPassword=<APP_SECRET>
```

### 3) Publish
```powershell
npm i
func azure functionapp publish fa-openclaw-teams-<unique>
```

## Bot behavior
The bot:
- stores a conversation reference (Azure Table) so it can send proactive replies later
- enqueues inbound messages (Azure Queue) for OpenClaw to pull

### Env vars (Azure Function App settings)
- `MicrosoftAppId`
- `MicrosoftAppPassword`
- `OPENCLAW_SHARED_SECRET` (for /api/openclaw/* endpoints)
- optional: `OPENCLAW_IN_QUEUE` (default: `openclaw-in`)
- optional: `OPENCLAW_CONV_TABLE` (default: `OpenClawConversations`)

### OpenClaw pull/reply endpoints
- `POST /api/openclaw/pull` (header `x-openclaw-secret`) → returns and deletes queued messages
- `POST /api/openclaw/reply` (header `x-openclaw-secret`) with `{ conversationId, text }` → sends message back into Teams
