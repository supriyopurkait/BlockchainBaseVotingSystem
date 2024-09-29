@echo off
echo Starting OVM
echo.

:: Backend Part
echo Starting backend...
start cmd /k "echo Starting Backend... && python -m pip install -r backend\requirment.txt && py backend\database.py && py backend\app.py"

:: Frontend Part
echo Starting frontend...
cd frontend
start cmd /k "echo Starting Frontend... && npm i && npm start"

echo Backend and frontend started in separate windows.
