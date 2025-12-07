@echo off
REM Auto-Deploy Script - Update and Push

echo ================================================
echo   VoiceMaster Pro - Auto Deploy
echo ================================================
echo.

REM Get commit message from user
set /p COMMIT_MSG="Enter commit message (or press Enter for default): "

if "%COMMIT_MSG%"=="" (
    set COMMIT_MSG=Update code
)

echo.
echo Commit message: %COMMIT_MSG%
echo.

echo [1/3] Adding all changes...
git add .

echo [2/3] Creating commit...
git commit -m "%COMMIT_MSG%"

echo [3/3] Pushing to GitHub (auto-deploy will start)...
git push

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo   SUCCESS! Auto-Deploy Started
    echo ================================================
    echo.
    echo What happens next:
    echo    1. GitHub receives your code
    echo    2. GitHub Actions runs tests
    echo    3. Vercel detects push
    echo    4. Vercel builds and deploys
    echo    5. Live in ~2-3 minutes!
    echo.
    echo Check status:
    echo    GitHub: https://github.com/TorDotTaxi/voicemasterpro-nextjs/actions
    echo    Vercel: https://vercel.com/dashboard
    echo.
) else (
    echo.
    echo ================================================
    echo   PUSH FAILED
    echo ================================================
    echo.
    echo Run PUSH_TO_GITHUB.bat first to setup
    echo.
)

pause

