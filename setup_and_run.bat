@echo off
echo ==========================================
echo   Mental Wellness System - One-Click Start
echo ==========================================
echo.
echo Installing root dependencies...
call npm install
echo.
echo Installing backend dependencies...
cd backend && call npm install && cd ..
echo.
echo Installing frontend dependencies...
cd frontend && call npm install && cd ..
echo.
echo Starting all services (AI, Backend, Frontend)...
echo.
npm run dev
pause
