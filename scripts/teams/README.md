# Teams <-> OpenClaw (Pull model)

## Secrets to add
Create these files:
- `secrets/teams_function_url.txt`  (example: `https://openclawteamschat-gke4ateaheafh8be.westeurope-01.azurewebsites.net`)
- `secrets/teams_shared_secret.txt` (a random string)

## Azure Function App settings to add
In the Function App (Configuration / Application settings):
- `OPENCLAW_SHARED_SECRET` = same as `teams_shared_secret.txt`

Optional:
- `OPENCLAW_IN_QUEUE` = `openclaw-in`
- `OPENCLAW_CONV_TABLE` = `OpenClawConversations`

## Test manually
1) Write in Teams to the bot: `hello`
2) Pull:
```powershell
powershell -File scripts/teams/teams_pull.ps1
```
You should see messages incl. `conversationId`.

3) Reply:
```powershell
powershell -File scripts/teams/teams_reply.ps1 -ConversationId "<id>" -Text "Hallo aus OpenClaw"
```
