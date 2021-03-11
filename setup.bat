@echo off
cls

if "%ProgramFiles(x86)%" == "" (
    set MySQLServerPath=%ProgramFiles%\MySQL Installer for Windows
) else (
    set MySQLServerPath=%ProgramFiles(x86)%\MySQL Installer for Windows
)

echo Starting MySQL install ...
%SystemRoot%\System32\msiexec.exe /a https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-web-community-8.0.23.0.msi /quiet
%MySQLServerPath%\MySQLInstallerConsole.exe community install server;5.6.24;x86:*:port=3306;rootpasswd=mysql;servicename=MySQL -silent
echo MySQL installed successfully.

rem if not "%PATH:~-1%" == ";" set "PATH=%PATH%;"
rem set "PATH=%PATH%%MySQLServerPath%"

echo Starting Nodejs install ...
%SystemRoot%\System32\msiexec.exe /a https://nodejs.org/dist/v14.16.0/node-v14.16.0-x86.msi /quiet
echo NodeJs installed successfully.

echo Configurating HomeCloud ...
if [ -f /root/.my.cnf ]; then
    mysql -e "CREATE DATABASE HomeCloud;"
    mysql -e "source .\db\init.sql;"

# If /root/.my.cnf doesn't exist then it'll ask for root password   
else
    mysql -uroot -pmysql -e "CREATE DATABASE HomeCloud;"
    mysql -uroot -pmysql -e "source .\db\init.sql;"
fi

for /f "tokens=1-2 delims=:" %%a in ('ipconfig^|find "IPv4"') do set ip=%%b
set ipAddress=%ip:~1%

echo MYSQL_PASS=mysl >> ./backend/.env
echo SENDGRID_API_KEY='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' >> ./backend/.env
echo UPLOAD_FOLDER = / >> ./backend/.env

echo REACT_APP_HOST_IP=%ipAddress% >> ./frontend/.env

cd ./backend
npm install

cd ../frontend
npm install

cd ../ && (cd ./backend && nodemon) && (cd ./frontend && npm run start)