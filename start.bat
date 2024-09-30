@echo off
echo Starting OVM
echo.

:: Backend Part
echo Starting backend...
start /MIN cmd /k "echo Starting Backend... && py backend\app.py"

:: Frontend Part
echo Starting frontend...

start /MIN cmd /k "cd frontend && echo Starting Frontend... && npm start"

echo Backend and frontend started in separate windows.
