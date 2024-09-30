@echo off
echo Starting OVM
echo.

:: Backend Part
echo Starting backend...
start /MIN cmd /k "echo Setting Up Backend... && python -m pip install -r backend\requirment.txt && py backend\database.py"

:: Frontend Part
echo Starting frontend...
cd frontend
start /MIN cmd /k "echo Setting Up Frontend... && npm i"

echo Backend and frontend are being Setted Up in separate windows.