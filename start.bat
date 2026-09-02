@echo off
chcp 65001 >nul
title 番茄工作法计时器
rem 切换到本脚本所在目录（压缩包解压到哪都能用）
cd /d "%~dp0"
echo.
echo  正在启动番茄工作法计时器...
echo  启动完成后会自动打开浏览器，关闭本窗口即可停止服务。
echo  提示：不想装 Node 的话，直接双击 dist 文件夹里的 index.html 也能用。
echo.
where npm >nul 2>nul
if errorlevel 1 (
  echo  [错误] 未检测到 Node.js / npm。
  echo  请先安装：https://nodejs.org/
  echo  或直接双击 dist 文件夹里的 index.html 使用离线版。
  echo.
  pause
  exit /b 1
)
start "" cmd /c "timeout /t 4 /nobreak >nul & start http://localhost:5173/"
call npm install
call npm run dev -- --host 127.0.0.1 --port 5173
pause
