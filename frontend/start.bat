@echo off

echo ================================
echo       Iniciando ClassFocus
echo ================================

cd frontend

if not exist node_modules (
    echo.
    echo Instalando dependencias...
    call npm install
)

echo.
echo Iniciando servidor...
echo.

call npm run dev

pause