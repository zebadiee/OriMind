
@echo off
echo Creating OriMind desktop shortcut...
powershell -Command "\$WshShell = New-Object -comObject WScript.Shell; \$Shortcut = \$WshShell.CreateShortcut('%%USERPROFILE%%\Desktop\OriMind.lnk'); \$Shortcut.TargetPath = 'C:\Users\ragou\spec-kit\demo-project\manus-agi\start-orimind-universal.bat'; \$Shortcut.WorkingDirectory = 'C:\Users\ragou\spec-kit\demo-project\manus-agi'; \$Shortcut.IconLocation = 'C:\Users\ragou\spec-kit\demo-project\manus-agi\assets\icon.ico'; \$Shortcut.Save()"
echo ✅ Desktop shortcut created
