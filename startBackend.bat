if not "%minimized%"=="" goto :minimized
set minimized=true
@echo off
cls

if "%ProgramFiles(x86)%" == "" (
    set "HomeCloudPath=%ProgramFiles%\HomeCloud\"
) else (
    set "HomeCloudPath=%ProgramFiles(x86)%\HomeCloud\"
)

cd %HomeCloudPath%/backend

start /min cmd /k "node server.js"