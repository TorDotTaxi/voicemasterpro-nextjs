@echo off
REM Setup Environment Variables for VoiceMaster Pro

echo ================================================
echo   VoiceMaster Pro - Environment Setup
echo ================================================
echo.

echo Creating .env.local template file...
echo.

echo ================================================
echo   IMPORTANT: Replace placeholder values with your actual API keys!
echo ================================================
echo.
echo Get your API keys from:
echo   - Gemini: https://makersuite.google.com/app/apikey
echo   - Deepgram: https://console.deepgram.com/
echo   - FPT AI: https://fpt.ai/
echo   - AssemblyAI: https://www.assemblyai.com/
echo.

(
echo NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
echo NEXT_PUBLIC_DEEPGRAM_API_KEY=your_deepgram_api_key_here
echo NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here
echo NEXT_PUBLIC_FPT_AI_API_KEY=your_fpt_ai_api_key_here
echo NEXT_PUBLIC_ASSEMBLY_AI_API_KEY=your_assemblyai_api_key_here
) > .env.local

if exist .env.local (
    echo.
    echo ================================================
    echo   SUCCESS! Environment template file created
    echo ================================================
    echo.
    echo File: .env.local
    echo.
    echo ================================================
    echo   NEXT STEPS ^(IMPORTANT^):
    echo ================================================
    echo.
    echo 1. Open .env.local in a text editor
    echo 2. Replace ALL placeholder values with your real API keys
    echo 3. Save the file
    echo 4. Restart the development server:
    echo    - Stop current server ^(Ctrl+C^)
    echo    - Run: npm run dev
    echo    - Refresh your browser
    echo.
    echo WARNING: Do NOT commit .env.local to git!
    echo ^(It's already in .gitignore^)
    echo.
) else (
    echo.
    echo ================================================
    echo   ERROR: Failed to create .env.local
    echo ================================================
    echo.
    echo Please create manually with these contents:
    echo.
    echo NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyAwYuKHRkLg7_uvZfmU7AnbrJSO2ykweQw
    echo NEXT_PUBLIC_DEEPGRAM_API_KEY=4acc334413436e98e24c15b7e48dc2ced6216f2c
    echo NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY=AIzaSyCKRoXy5fAYQENKhlDDCGnu4axn_hsok7s
    echo NEXT_PUBLIC_FPT_AI_API_KEY=dIP80FYgNqy0U1iMb0MlyU5h95FVOmBi
    echo NEXT_PUBLIC_ASSEMBLY_AI_API_KEY=abee456b3f9342fc90cfc44aeb2f2501
    echo.
)

pause


