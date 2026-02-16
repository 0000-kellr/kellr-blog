param(
  [Parameter(Mandatory=$true, Position=0)][string]$Title
)

$ErrorActionPreference = 'Stop'

$ws = Split-Path -Parent $PSScriptRoot
Set-Location $ws

node .\scripts\notion-add-inbox-task.mjs "$Title"
