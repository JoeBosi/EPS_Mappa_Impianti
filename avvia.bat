@echo off
title Mappa Italia
echo ============================================
echo   Mappa Italia - Avvio server
echo ============================================
echo.

:: Verifica Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRORE: Python non trovato.
    echo Installa Python da https://www.python.org/downloads/
    pause
    exit /b 1
)

:: Installa Flask se necessario
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Installazione Flask in corso...
    pip install flask
    echo.
)

echo Avvio del server...
echo Apri il browser su: http://localhost:5000
echo.
echo Premi CTRL+C per fermare il server.
echo.

python "%~dp0app.py"
pause
