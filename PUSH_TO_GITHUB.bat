@echo off
REM Auto-Deploy Script - Push to GitHub

echo ================================================
echo   VoiceMaster Pro - Push to GitHub
echo   Auto-Deploy Enabled!
echo ================================================
echo.

echo Checking git status...
git status

echo.
echo ================================================
echo   IMPORTANT: You need Personal Access Token
echo ================================================
echo.
echo 1. Create token at: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Select scopes: repo, workflow
echo 4. Copy the token
echo 5. Use token as password when pushing
echo.
echo Token format: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
echo.
pause

echo.
echo ================================================
echo   Pushing to GitHub...
echo ================================================
echo.
echo Username: TorDotTaxi
echo Password: [PASTE YOUR TOKEN]
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo   SUCCESS! Code pushed to GitHub
    echo ================================================
    echo.
    echo Your repository:
    echo    https://github.com/TorDotTaxi/voicemasterpro-nextjs
    echo.
    echo Next steps:
    echo    1. Go to https://vercel.com
    echo    2. Import your repository
    echo    3. Add environment variables
    echo    4. Deploy!
    echo.
    echo After that, every git push will auto-deploy!
    echo.
) else (
    echo.
    echo ================================================
    echo   PUSH FAILED
    echo ================================================
    echo.
    echo Common issues:
    echo    1. Repository doesn't exist - create at https://github.com/new
    echo    2. Wrong token - create new at https://github.com/settings/tokens
    echo    3. Token needs 'repo' scope
    echo.
)

pause

