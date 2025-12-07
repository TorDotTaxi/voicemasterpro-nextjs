@echo off
REM Setup Environment Variables for VoiceMaster Pro

echo ================================================
echo   VoiceMaster Pro - Environment Setup
echo ================================================
echo.

echo Creating .env.local file...
echo.

(
echo NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyAwYuKHRkLg7_uvZfmU7AnbrJSO2ykweQw
echo NEXT_PUBLIC_DEEPGRAM_API_KEY=4acc334413436e98e24c15b7e48dc2ced6216f2c
echo NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY=AIzaSyCKRoXy5fAYQENKhlDDCGnu4axn_hsok7s
echo NEXT_PUBLIC_FPT_AI_API_KEY=dIP80FYgNqy0U1iMb0MlyU5h95FVOmBi
echo NEXT_PUBLIC_ASSEMBLY_AI_API_KEY=abee456b3f9342fc90cfc44aeb2f2501
) > .env.local

if exist .env.local (
    echo.
    echo ================================================
    echo   SUCCESS! Environment file created
    echo ================================================
    echo.
    echo File: .env.local
    echo.
    echo API Keys configured:
    echo   - Gemini AI ^(Spelling correction^)
    echo   - Deepgram ^(Transcription^)
    echo   - Google Cloud ^(TTS/STT^)
    echo   - FPT AI ^(Vietnamese TTS/STT^)
    echo   - AssemblyAI ^(Transcription^)
    echo.
    echo ================================================
    echo   NEXT STEP: Restart the development server
    echo ================================================
    echo.
    echo 1. Stop the current server ^(Ctrl+C^)
    echo 2. Run: npm run dev
    echo 3. Refresh your browser
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


