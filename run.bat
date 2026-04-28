@echo off
echo Running the environmental monitor...

echo Checking dependencies...
call npm install
cd frontend
call npm install
cd ..
cd backend
call dotnet restore
cd ..

echo Starting backend and frontend...
npm run dev
pause