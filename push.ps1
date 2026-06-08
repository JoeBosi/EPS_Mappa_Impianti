# push.ps1 - Commit e push sicuro: conserva sempre la versione remota di fornitori.csv
param(
    [Parameter(Mandatory=$true)]
    [string]$Messaggio
)

Write-Host "Recupero fornitori.csv da GitHub (versione remota)..." -ForegroundColor Cyan
git fetch origin
git checkout origin/master -- fornitori.csv

Write-Host "Commit e push..." -ForegroundColor Cyan
git add -A
git commit -m $Messaggio
git push origin master

Write-Host "Done." -ForegroundColor Green
