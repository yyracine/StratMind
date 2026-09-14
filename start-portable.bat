@echo off
title StratMind - Application Portable PC
echo ===================================================
echo   StratMind - Cartographie Mentale et Strategie
echo   Mode Application Portable PC
echo ===================================================
echo.
echo Lancement du serveur portable local...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo [!] Node.js n'a pas ete detecte.
  echo     Veuillez ouvrir directement le dossier 'dist/index.html'
  echo     dans votre navigateur (Chrome, Edge, Firefox) ou installer Node.js.
  pause
  exit /b 1
)

echo Demarrage de l'application sur le port 3000...
npm run preview || npm run start

pause
