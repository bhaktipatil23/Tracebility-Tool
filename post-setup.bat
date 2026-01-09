@echo off
echo Post-setup fixes...

REM Navigate to project directory
cd /d "d:\Tracebility Tool\TRF-Climaone-main"

REM Fix remaining vulnerability
echo Fixing remaining security vulnerability...
npm audit fix --force

echo.
echo All fixes applied!
echo Your traceability tool is now ready to use.
echo.
echo To start the development server:
echo npm run dev
echo.
pause