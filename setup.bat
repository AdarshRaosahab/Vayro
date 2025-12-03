@echo off
echo ==========================================
echo       VAYRO Setup Script
echo ==========================================
echo.

echo [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing dependencies. Please check if Node.js is installed.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Setting up local database...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo Error running migrations.
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Seeding database...
call npm run db:seed
if %errorlevel% neq 0 (
    echo Error seeding database.
    pause
    exit /b %errorlevel%
)

echo.
echo ==========================================
echo       Setup Complete!
echo ==========================================
echo.
echo You can now run 'start.bat' or 'npm run dev' to launch VAYRO.
echo.
pause
