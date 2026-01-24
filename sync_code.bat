@echo off
echo ===================================================
echo SYNCING CODE TO GITHUB
echo ===================================================
echo.

echo 1. Adding all changes...
git add .
echo Done.
echo.

echo 2. Committing changes...
git commit -m "update: latest project updates"
echo.

echo 3. Pushing to https://github.com/NaveenAkalanka/DailyBurn...
git push https://github.com/NaveenAkalanka/DailyBurn main
echo.

echo ===================================================
echo PROCESS COMPLETE
echo If 'git push' asked for login, hopefully you provided it.
echo If you see "Everything up-to-date", that is good!
echo.
pause
exit
