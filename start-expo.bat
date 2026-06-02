@echo off
chcp 65001 > nul
title TheStillness - Expo
cd /d C:\Users\mvant\TheStillness

set EXPO_NO_TELEMETRY=1
set NODE_OPTIONS=--dns-result-order=ipv4first

echo Starting Expo... > expo-log.txt 2>&1
npx expo start --offline >> expo-log.txt 2>&1

echo.
echo Done. Check expo-log.txt for details.
pause
