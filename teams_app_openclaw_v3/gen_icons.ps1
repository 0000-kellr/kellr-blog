$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing

$dir = Join-Path $env:USERPROFILE '.openclaw\workspace\teams_app_openclaw_v3'
New-Item -ItemType Directory -Force -Path $dir | Out-Null

# Color icon 192x192
$bmp = New-Object System.Drawing.Bitmap 192,192
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(43,138,62))
$font = New-Object System.Drawing.Font('Arial',72,[System.Drawing.FontStyle]::Bold)
$brush = [System.Drawing.Brushes]::White
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center
$g.DrawString('OC',$font,$brush,(New-Object System.Drawing.RectangleF 0,0,192,192),$sf)
$g.Dispose(); $bmp.Save((Join-Path $dir 'icon-color.png'), [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()

# Outline icon 32x32
$bmp2 = New-Object System.Drawing.Bitmap 32,32
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.Clear([System.Drawing.Color]::Transparent)
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White,2)
$g2.DrawRectangle($pen,1,1,30,30)
$g2.Dispose(); $pen.Dispose(); $bmp2.Save((Join-Path $dir 'icon-outline.png'), [System.Drawing.Imaging.ImageFormat]::Png); $bmp2.Dispose()

Write-Output 'OK'
