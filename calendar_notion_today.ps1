$ErrorActionPreference = 'Stop'

$base = Join-Path $env:USERPROFILE '.openclaw\workspace'

# -------- Microsoft Graph (Calendar) --------
$cachePath = Join-Path $base 'secrets\msal_cache.json'
$clientId  = (Get-Content (Join-Path $base 'secrets\ms_client_id.txt') -Raw).Trim()
$tenantId  = (Get-Content (Join-Path $base 'secrets\ms_tenant_id.txt') -Raw).Trim()
$cache = Get-Content $cachePath -Raw | ConvertFrom-Json
$refreshTokenKey = $cache.RefreshToken.PSObject.Properties.Name | Select-Object -First 1
$refreshToken = $cache.RefreshToken.$refreshTokenKey.secret

$body = @{
  client_id     = $clientId
  grant_type    = 'refresh_token'
  refresh_token = $refreshToken
  scope         = 'Calendars.ReadWrite User.Read offline_access'
}
$tokenResp = Invoke-RestMethod -Uri ("https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token") -Method POST -Body $body
$accessToken = $tokenResp.access_token
$graphHeaders = @{ Authorization = 'Bearer ' + $accessToken }

$now = Get-Date
$start = Get-Date -Year $now.Year -Month $now.Month -Day $now.Day -Hour 0 -Minute 0 -Second 0
$end = $start.AddDays(1).AddSeconds(-1)
$startUtc = $start.ToUniversalTime()
$endUtc   = $end.ToUniversalTime()
$startIso = $startUtc.ToString("yyyy-MM-ddTHH:mm:ss'Z'")
$endIso   = $endUtc.ToString("yyyy-MM-ddTHH:mm:ss'Z'")

$startEnc = [System.Uri]::EscapeDataString($startIso)
$endEnc   = [System.Uri]::EscapeDataString($endIso)

$calendarUri = ('https://graph.microsoft.com/v1.0/me/calendarView?startDateTime={0}&endDateTime={1}&`$orderby=start/dateTime' -f $startEnc, $endEnc)
$cal = Invoke-RestMethod -Uri $calendarUri -Headers $graphHeaders -Method GET
$events = @($cal.value)

# -------- Notion (Tasks for today / MyDay) --------
$notionToken = (Get-Content (Join-Path $base 'secrets\notion_token.txt') -Raw).Trim()
$tasksDb = '31645ea5-eae3-4792-b4d9-5f0e7115fd44'
$notionHeaders = @{
  'Authorization'  = 'Bearer ' + $notionToken
  'Notion-Version' = '2022-06-28'
  'Content-Type'   = 'application/json'
}

$todayDate = $start.ToString('yyyy-MM-dd')
$filter = @{
  or = @(
    @{ property='MyDay'; checkbox=@{ equals=$true } },
    @{ property='Due'; date=@{ equals=$todayDate } }
  )
}
$payload = @{ filter=$filter; page_size=100 } | ConvertTo-Json -Depth 10
$notionUri = "https://api.notion.com/v1/databases/$tasksDb/query"
$tasksResp = Invoke-RestMethod -Uri $notionUri -Headers $notionHeaders -Method POST -Body $payload
$tasks = @($tasksResp.results)

# -------- Output --------
$out = [ordered]@{
  date = $todayDate
  calendar = $events | ForEach-Object {
    [ordered]@{
      subject   = $_.subject
      start     = $_.start.dateTime
      end       = $_.end.dateTime
      isAllDay  = $_.isAllDay
      location  = $_.location.displayName
      organizer = $_.organizer.emailAddress.name
      webLink   = $_.webLink
    }
  }
  notion = $tasks | ForEach-Object {
    $props = $_.properties
    $title = ($props.'Task Name'.title | ForEach-Object { $_.plain_text }) -join ''
    [ordered]@{
      title    = $title
      status   = $props.Status.status.name
      priority = $props.Priority.select.name
      due      = $props.Due.date.start
      myday    = $props.MyDay.checkbox
      url      = $_.url
    }
  }
}

$out | ConvertTo-Json -Depth 6
