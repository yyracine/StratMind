@echo off
REM Script de lancement portable StratMind

echo Lancement de StratMind...
cd /d "%~dp0"
start StratMind.exe

REM Attendre quelques secondes avant de fermer la fenêtre de commande
timeout /t 2 /nobreak
