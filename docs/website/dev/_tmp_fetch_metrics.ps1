[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "Checking health..."
try {
  $health = (New-Object System.Net.WebClient).DownloadString('http://localhost:9003/__metrics_health')
  Write-Host "HEALTH: $health"
} catch {
  Write-Host "HEALTH CHECK FAILED: $($_.Exception.Message)"
}

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
