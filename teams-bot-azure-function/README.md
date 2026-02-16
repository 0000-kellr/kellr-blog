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
Currently this bot is an **echo bot** and a small command router stub.

You can extend `src/bot.js` to forward messages into OpenClaw (HTTP call / websocket / whatever we decide).
