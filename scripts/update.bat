if not "%minimized%"=="" goto :minimized
set minimized=true
@echo off
cls

if "%ProgramFiles(x86)%" == "" (
    set "HomeCloudPath=%ProgramFiles%\HomeCloud\"
) else (
    set "HomeCloudPath=%ProgramFiles(x86)%\HomeCloud\"
)

for %%i in ("%~dp0.") do set "mypath=%%~fi"

xcopy /e /v "%mypath%" "%HomeCloudPath%"