$ErrorActionPreference = 'Stop'

$base = Join-Path $env:USERPROFILE '.openclaw\workspace'
$token = (Get-Content (Join-Path $base 'secrets\notion_token.txt') -Raw).Trim()
if ([string]::IsNullOrWhiteSpace($token)) { throw 'Notion token is empty' }

$headers = @{
  Authorization   = "Bearer $token"
  'Notion-Version'= '2022-06-28'
  'Content-Type'  = 'application/json'
}

# From task URL: https://www.notion.so/Cloud-Lizenz-kl-ren-308362008e86816e9575e57d25bce9d5
$pageIdRaw = '308362008e86816e9575e57d25bce9d5'
$pageId = $pageIdRaw -replace '^(.{8})(.{4})(.{4})(.{4})(.{12})$','$1-$2-$3-$4-$5'

$bodyObj = @{ properties = @{ Status = @{ status = @{ name = 'Done' } } } }
$body = $bodyObj | ConvertTo-Json -Depth 10

$uri = "https://api.notion.com/v1/pages/$pageId"
$resp = Invoke-RestMethod -Method Patch -Uri $uri -Headers $headers -Body $body

$title = (($resp.properties.'Task Name'.title | ForEach-Object { $_.plain_text }) -join '')
$status = $resp.properties.Status.status.name
Write-Output "UPDATED: $title -> $status"
