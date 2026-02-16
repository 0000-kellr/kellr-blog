$ErrorActionPreference='Stop'

$base = Join-Path $env:USERPROFILE '.openclaw\workspace'
$fnUrl = (Get-Content (Join-Path $base 'secrets\teams_function_url.txt') -Raw).Trim().TrimEnd('/')
$secret = (Get-Content (Join-Path $base 'secrets\teams_shared_secret.txt') -Raw).Trim()

$headers = @{ 'x-openclaw-secret' = $secret; 'content-type'='application/json' }
$body = @{ max = 10 } | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "$fnUrl/api/openclaw/pull" -Headers $headers -Body $body -TimeoutSec 30 | ConvertTo-Json -Depth 6
