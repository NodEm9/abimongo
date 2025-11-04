# Inspect current listener on 9003
$portInfo = Get-NetTCPConnection -LocalPort 9003 -ErrorAction SilentlyContinue | Select-Object LocalAddress,LocalPort,State,OwningProcess
if ($portInfo) {
  $pid = $portInfo.OwningProcess
  Write-Host "Found listener on port 9003: PID=$pid"
  try {
    Get-Process -Id $pid | Select-Object Id,ProcessName,Path,StartTime | Format-List
  } catch { Write-Host "Could not get more process info for PID $pid: $($_.Exception.Message)" }
  Write-Host "Killing PID $pid..."
  taskkill /PID $pid /F | Out-Null
  Start-Sleep -Seconds 1
} else {
  Write-Host "No listener found on port 9003"
}

# Start metrics server
Write-Host "Starting metrics server..."
Start-Process -FilePath node -ArgumentList 'docs/website/dev/metrics-server.js' -WorkingDirectory 'C:\Users\User\Documents\GitHub\abimongo' -NoNewWindow -PassThru | Out-Host
Start-Sleep -Seconds 2

# Check health
Write-Host "Checking health..."
try {
  $health = (New-Object System.Net.WebClient).DownloadString('http://localhost:9003/__metrics_health')
  Write-Host "HEALTH: $health"
} catch {
  Write-Host "HEALTH CHECK FAILED: $($_.Exception.Message)"
}

# Fetch npm-downloads
Write-Host "Fetching /api/npm-downloads (may take a few seconds)..."
try {
  $wc = New-Object System.Net.WebClient
  $wc.Headers.Add('User-Agent','abimongo-dev-agent')
  $npm = $wc.DownloadString('http://localhost:9003/api/npm-downloads')
  Write-Host "NPM DOWNLOADS:" 
  Write-Output $npm
} catch {
  Write-Host "NPM DOWNLOADS FETCH FAILED: $($_.Exception.Message)"
}
