@echo off
echo Organizing files in the root directory...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { $ErrorActionPreference = 'Stop'; try { & '.\scripts\organize_root.ps1' } catch { Write-Error $_; exit 1 } }"
if %ERRORLEVEL% NEQ 0 (
    echo Failed to organize files. Please check the error above.
    pause
    exit /b %ERRORLEVEL%
)
echo Files have been organized successfully!
pause
