@echo off
chcp 65001 >nul
title 番茄工作法计时器
cd /d "D:\pro\pomodoro-timer"
echo.
echo  正在启动番茄工作法计时器...
echo  启动完成后会自动打开浏览器，关闭本窗口即可停止服务。
echo.
start "" cmd /c "timeout /t 4 /nobreak >nul & start http://localhost:5173/pomodoro-timer/"
npm run dev -- --host 127.0.0.1 --port 5173
