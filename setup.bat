@echo off
echo Setting up Traceability Tool...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Navigate to project directory
cd /d "d:\Tracebility Tool\TRF-Climaone-main"

REM Install dependencies
echo Installing dependencies...
npm install

REM Create environment file if it doesn't exist
if not exist ".env.local" (
    echo Creating environment file...
    copy ".env.example" ".env.local"
    echo Please update .env.local with your configuration values
)

REM Run linting
echo Running linter...
npm run lint

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Update .env.local with your configuration
echo 2. Run 'npm run dev' to start development server
echo 3. Open http://localhost:3000 in your browser
echo.
pause