$ErrorActionPreference = 'Stop'
$ws = Split-Path -Parent $PSScriptRoot
Set-Location $ws
node .\scripts\notion-list-inbox.mjs
