$ErrorActionPreference='Stop'
$dir = Join-Path $env:USERPROFILE '.openclaw\workspace\teams_app_openclaw_v3'
# generate icons (idempotent)
& (Join-Path $dir 'gen_icons.ps1') | Out-Null

$zip = Join-Path (Split-Path $dir -Parent) 'OpenClawChat-TeamsApp-v3.zip'
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $dir '*') -DestinationPath $zip
Write-Output $zip
