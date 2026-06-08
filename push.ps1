# push.ps1 - Push automatico: allinea alla versione più recente (locale o remoto)
# Non richiede parametri

Write-Host "Verifica versione di fornitori.csv..." -ForegroundColor Cyan

# Fetch info dal remoto
git fetch origin

# Scarica versione remota in un file temporaneo
$tempFile = [System.IO.Path]::GetTempFileName()
git show origin/master:fornitori.csv | Out-File -FilePath $tempFile -Encoding UTF8

# Leggi contenuto di entrambi i file
$localContent = Get-Content fornitori.csv -Raw
$remoteContent = Get-Content $tempFile -Raw

# Rimuovi file temporaneo
Remove-Item $tempFile

# Confronta contenuti
if ($localContent -eq $remoteContent) {
    Write-Host "File identici - nessuna azione necessaria." -ForegroundColor Green
} else {
    # Verifica se locale ha modifiche non committate
    $hasLocalChanges = git status --porcelain fornitori.csv
    
    if ($hasLocalChanges) {
        Write-Host "Versione LOCALE modificata - faccio push..." -ForegroundColor Green
        git add -A
        $msg = "aggiornamento fornitori.csv - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        git commit -m $msg
        git push origin master
    } else {
        Write-Host "Versione REMOTA diversa - aggiorno locale..." -ForegroundColor Yellow
        git checkout origin/master -- fornitori.csv
        Write-Host "Locale aggiornato alla versione remota." -ForegroundColor Green
    }
}

Write-Host "Done." -ForegroundColor Green
