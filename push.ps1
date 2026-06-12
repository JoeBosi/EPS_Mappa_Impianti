# push.ps1 - Push automatico: allinea la versione PIU' RECENTE (locale o remoto)
# Non richiede parametri - confronta le DATE

Write-Host "Verifica versione di fornitori.csv..." -ForegroundColor Cyan

# Fetch info dal remoto
git fetch origin

# Data ultima modifica del FILE LOCALE
$localDate = (Get-Item fornitori.csv).LastWriteTime

# Data ultimo commit remoto che ha modificato fornitori.csv
$remoteDateStr = git log origin/master --fornitori.csv -1 --format=%cd --date=iso
$remoteDate = [datetime]::Parse($remoteDateStr)

Write-Host "  Locale modificato: $localDate" -ForegroundColor Gray
Write-Host "  Remoto modificato: $remoteDate" -ForegroundColor Gray

# Confronta date
if ($localDate -gt $remoteDate) {
    Write-Host "Versione LOCALE piu recente - faccio push..." -ForegroundColor Green
    git add fornitori.csv
    $msg = "aggiornamento fornitori.csv - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git commit -m $msg
    git pull origin master --rebase
    git push origin master
} elseif ($remoteDate -gt $localDate) {
    Write-Host "Versione REMOTA piu recente - creo backup..." -ForegroundColor Yellow
    $backupFile = "fornitori_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').csv"
    Copy-Item fornitori.csv $backupFile
    Write-Host "Backup creato: $backupFile" -ForegroundColor Cyan
    git checkout origin/master -- fornitori.csv
    Write-Host "Locale aggiornato alla versione remota." -ForegroundColor Green
} else {
    Write-Host "File aggiornati (stessa data) - nessuna azione." -ForegroundColor Green
}

Write-Host "Done." -ForegroundColor Green
