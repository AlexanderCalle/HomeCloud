if not "%minimized%"=="" goto :minimized
set minimized=true
@echo off
cls

if "%ProgramFiles(x86)%" == "" (
    set "HomeCloudPath=%ProgramFiles%\HomeCloud\"
    set "MySQLCommand=%ProgramFiles%\MySQL\MySQL Server 5.7\bin\"
) else (
    set "HomeCloudPath=%ProgramFiles(x86)%\HomeCloud\"
    set "MySQLCommand=%ProgramFiles(x86)%\MySQL\MySQL Server 5.7\bin\"
)

for %%i in ("%~dp0.") do set "mypath=%%~fi"

xcopy /e /v "%mypath%" "%HomeCloudPath%"

echo Configurating HomeCloud ...
cd %MySQLCommand%
mysql.exe --database=HomeCloud -uroot -pmysql -e "source %HomeCloudPath%db\update.sql"