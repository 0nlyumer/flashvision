@echo off
title FlashVision Firebase Reauthorization and Deploy
echo ======================================================================
echo   FlashVision ERP - Firebase Live Hosting Deployer
echo ======================================================================
echo.
cd /d "D:\Flashvision12\sale_orders_app"
echo [1/2] Reauthorizing Firebase with your Google Account...
echo (A browser window will open. Please select your Google account and click Allow)
echo.
call firebase login --reauth
echo.
echo [2/2] Deploying latest build to https://flashvision-erp.web.app...
echo.
call firebase deploy --only hosting
echo.
echo ======================================================================
echo   DEPLOYMENT FINISHED!
echo   Latest live app: https://flashvision-erp.web.app
echo ======================================================================
pause
