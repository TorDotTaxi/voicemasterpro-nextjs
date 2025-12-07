@echo off
REM Add Environment Variables to Vercel

echo ================================================
echo   Adding Environment Variables to Vercel
echo ================================================
echo.

echo Adding NEXT_PUBLIC_GEMINI_API_KEY...
vercel env add NEXT_PUBLIC_GEMINI_API_KEY production
echo AIzaSyBxuMbv-_RZ4pnBZ4ZnStA9d3jjiutnNbw

echo.
echo Adding NEXT_PUBLIC_DEEPGRAM_API_KEY...
vercel env add NEXT_PUBLIC_DEEPGRAM_API_KEY production
echo 8e55215be0a88d21cb0130e8f6d9e9b1d5d62de7

echo.
echo Adding NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY...
vercel env add NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY production
echo AIzaSyBxuMbv-_RZ4pnBZ4ZnStA9d3jjiutnNbw

echo.
echo Adding NEXT_PUBLIC_FPT_AI_API_KEY...
vercel env add NEXT_PUBLIC_FPT_AI_API_KEY production
echo xdb2uuexSeDDt0hZlgewLovZ1jDRGr2W

echo.
echo Adding NEXT_PUBLIC_ASSEMBLY_AI_API_KEY...
vercel env add NEXT_PUBLIC_ASSEMBLY_AI_API_KEY production
echo 2d93eb4e3840438e9349d4a912e58d29

echo.
echo ================================================
echo   Environment variables added!
echo   Now deploying to production...
echo ================================================
echo.

vercel --prod

pause

