if not "%minimized%"=="" goto :minimized
set minimized=true
@echo off
cls

if "%ProgramFiles(x86)%" == "" (
    set "HomeCloudPath=%ProgramFiles%\HomeCloud\"
) else (
    set "HomeCloudPath=%ProgramFiles(x86)%\HomeCloud\"
)

for /f "tokens=1-2 delims=:" %%a in ('ipconfig^|find "IPv4"') do set ip=%%b
set ipAddress=%ip:~1%

cd %HomeCloudPath%/backend
start /min CMD /k "node server.js"

cd %HomeCloudPath%/frontend
start /min CMD /k "npm run start"

echo Do not close the other windows!
echo Your site will be available on: http://%ipAddress%:3000/

pause <null