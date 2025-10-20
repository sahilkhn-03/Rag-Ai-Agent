@echo off
if "%GROQ_API_KEY%"=="" (
	echo Please set GROQ_API_KEY in this shell before running this script.
	echo Example:
	echo    set GROQ_API_KEY=your_real_groq_key_here
	goto :eof
)
echo ✓ Groq API Key present in environment
echo Starting backend with Groq AI...
python app.py
