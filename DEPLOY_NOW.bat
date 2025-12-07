@echo off
REM Quick Deploy to Vercel Script

echo ================================================
echo   VoiceMaster Pro - Deploy to Vercel
echo ================================================
echo.

echo Step 1: Login to Vercel
echo.
echo IMPORTANT: You will need to:
echo   1. Enter your email address
echo   2. Check your email
echo   3. Click the verification link
echo.
pause

vercel login

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ================================================
    echo   LOGIN FAILED
    echo ================================================
    echo.
    echo Please check your email and try again.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   Login successful! Now deploying...
echo ================================================
echo.

REM Deploy to Vercel
vercel --prod

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo   DEPLOYMENT SUCCESSFUL!
    echo ================================================
    echo.
    echo Your app is now live!
    echo.
    echo Next steps:
    echo   1. Add environment variables on Vercel Dashboard
    echo   2. Go to: https://vercel.com/dashboard
    echo   3. Select your project
    echo   4. Go to Settings -^> Environment Variables
    echo   5. Add all 5 API keys from .env.local
    echo.
    echo After adding environment variables:
    echo   - Redeploy: vercel --prod
    echo   - Or push new code to GitHub (auto-deploy)
    echo.
) else (
    echo.
    echo ================================================
    echo   DEPLOYMENT FAILED
    echo ================================================
    echo.
    echo Common issues:
    echo   1. First time deploying: Need to set up project
    echo   2. Run: vercel (without --prod first)
    echo   3. Answer the setup questions
    echo   4. Then run: vercel --prod
    echo.
    echo OR use Vercel website:
    echo   https://vercel.com/new
    echo.
)

pause

