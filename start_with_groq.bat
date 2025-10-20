@echo off
echo ========================================
echo Starting RAG AI Assistant
echo ========================================
echo.
echo Using .env file for configuration...
echo Make sure you've added your GROQ_API_KEY to .env
echo See GROQ_API_SETUP.md for instructions
echo.

REM Start the Flask backend
cd /d "%~dp0"
echo Starting Flask backend...
python app.py

pause
