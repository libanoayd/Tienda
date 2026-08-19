@echo off
color 0A
echo ===================================================
echo      Iniciando la Tienda Online - Libano AyD
echo ===================================================
echo.
echo Por favor, NO CIERRES esta ventana negra.
echo Si la cierras, el servidor se apagara.
echo.
echo Abriendo el navegador...

:: Esto asegura que siempre se ejecute en la carpeta donde esta el archivo .bat
cd /d "%~dp0"

timeout /t 3 /nobreak > NUL
start http://localhost:3000

npm run dev
pause
