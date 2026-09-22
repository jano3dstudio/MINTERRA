@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Fuer die lokale Version wird Node.js 22 benoetigt.
  echo Die Browser-Version ist unter https://jonaschlegelmilch.de/minterra/play/ erreichbar.
  pause
  exit /b 1
)
echo MINTERRA lokal: http://127.0.0.1:5188
echo Browser unter dieser Adresse oeffnen. Strg+C beendet den Server.
node server.mjs
