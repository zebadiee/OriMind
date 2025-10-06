# 🎬 Launcher Demo - Step by Step

This document shows exactly what happens when you use the launcher scripts.

## 📺 Demo 1: First Time Setup

When you run the launcher for the first time:

```powershell
PS C:\Users\ragou\spec-kit> .\launch.ps1
```

**Output:**
```
GitHub Spec Kit Launcher
========================

Checking for uv package manager...
WARNING: uv is not installed. Installing uv...

Installing uv using the official installer...

Downloading uv 0.8.23 (x86_64-pc-windows-msvc)
Installing to C:\Users\ragou\.local\bin
  uv.exe
  uvx.exe
  uvw.exe
everything's installed!

SUCCESS: uv installed successfully!

Checking for Specify CLI...
Installing Specify CLI from spec-kit repository...

Resolved 21 packages in 536ms
Installed 21 packages in 182ms
  + specify-cli==0.0.17

SUCCESS: Specify CLI installed successfully!

==================================================

Specify CLI is ready! Here's how to use it:

Common commands:
  specify init <project-name>              - Initialize a new project
  specify init <project-name> --ai claude  - Initialize with Claude Code
  specify init <project-name> --ai copilot - Initialize with GitHub Copilot
  specify init <project-name> --ai cursor  - Initialize with Cursor
  specify check                            - Check installed tools

Supported AI agents:
  claude, copilot, gemini, cursor, qwen, opencode,
  codex, windsurf, kilocode, auggie, roo, q

For more options, run:
  specify --help

Quick start example:
  specify init my-awesome-project --ai copilot

Happy spec-driven developing!
```

## 📺 Demo 2: Subsequent Runs

After installation, running the launcher is instant:

```powershell
PS C:\Users\ragou\spec-kit> .\launch.ps1
```

**Output:**
```
GitHub Spec Kit Launcher
========================

Checking for uv package manager...
SUCCESS: uv is already installed
uv 0.8.23 (00d3aa378 2025-10-04)

Checking for Specify CLI...
SUCCESS: Specify CLI is already installed

==================================================

Specify CLI is ready! Here's how to use it:

[... help text ...]
```

## 📺 Demo 3: Initialize a Project

```powershell
PS C:\Users\ragou\spec-kit> .\launch.ps1 init my-todo-app --ai copilot
```

**Output:**
```
GitHub Spec Kit Launcher
========================

Checking for uv package manager...
SUCCESS: uv is already installed
uv 0.8.23 (00d3aa378 2025-10-04)

Checking for Specify CLI...
SUCCESS: Specify CLI is already installed

==================================================

Running: specify init my-todo-app --ai copilot

███████╗██████╗ ███████╗ ██████╗██╗███████╗██╗   ██╗
██╔════╝██╔══██╗██╔════╝██╔════╝██║██╔════╝╚██╗ ██╔╝
███████╗██████╔╝█████╗  ██║     ██║█████╗   ╚████╔╝ 
╚════██║██╔═══╝ ██╔══╝  ██║     ██║██╔══╝    ╚██╔╝  
███████║██║     ███████╗╚██████╗██║██║        ██║
╚══════╝╚═╝     ╚══════╝ ╚═════╝╚═╝╚═╝        ╚═╝

GitHub Spec Kit - Spec-Driven Development Toolkit

✓ Git repository initialized in my-todo-app
✓ Created .specify directory structure
✓ Installed templates for GitHub Copilot
✓ Created initial project files

Next steps:
1. cd my-todo-app
2. code .
3. Use /constitution, /specify, /plan, /tasks, /implement commands

Happy spec-driven developing!
```

## 📺 Demo 4: Check Installed Tools

```powershell
PS C:\Users\ragou\spec-kit> .\launch.ps1 check
```

**Output:**
```
GitHub Spec Kit Launcher
========================

Checking for uv package manager...
SUCCESS: uv is already installed
uv 0.8.23 (00d3aa378 2025-10-04)

Checking for Specify CLI...
SUCCESS: Specify CLI is already installed

==================================================

Running: specify check

███████╗██████╗ ███████╗ ██████╗██╗███████╗██╗   ██╗
[... logo ...]

Checking for installed tools...

Check Available Tools
├── ● Git version control (available)
├── ● Claude Code CLI (not found)
├── ● Gemini CLI (available)
├── ● Visual Studio Code (available)
├── ● Cursor IDE agent (not found)
└── [... more tools ...]

Specify CLI is ready to use!
```

## 📺 Demo 5: Using from Windows Command Prompt

```cmd
C:\Users\ragou\spec-kit> launch.bat init my-app --ai cursor
```

**Output:**
```
Starting GitHub Spec Kit...

GitHub Spec Kit Launcher
========================

[... same as PowerShell output ...]
```

## 🎯 Real-World Example: Todo App

Complete workflow for building a todo app:

```powershell
# Step 1: Initialize project
.\launch.ps1 init todo-app --ai copilot

# Step 2: Navigate to project
cd todo-app

# Step 3: Open in VS Code with Copilot
code .

# Step 4: In VS Code, use AI commands
# /constitution Create principles for clean, maintainable code
# /specify Build a todo app with tasks, categories, and due dates
# /clarify (AI asks clarifying questions)
# /plan Use React with TypeScript and local storage
# /tasks (AI breaks down implementation)
# /implement (AI builds the app)
```

## 💡 Tips for Best Experience

1. **Run without arguments first** - See all available commands
2. **Use --ai flag** - Specify your AI agent during init
3. **Check tools** - Run `.\launch.ps1 check` to verify setup
4. **Direct usage** - After setup, use `specify` command directly

## 🔄 Upgrading

To upgrade Specify CLI:

```powershell
# Update the spec-kit repository
git pull

# Reinstall from local repo
uv tool uninstall specify-cli
.\launch.ps1
```

## ✅ Summary

The launcher provides:
- **Zero-config setup** - Everything is automated
- **Smart detection** - Only installs what's missing
- **Pass-through commands** - Use it like the specify command
- **Helpful output** - Clear status and next steps
- **Cross-platform** - Works on Windows (PowerShell & CMD)

Just run `.\launch.ps1` and you're ready to start building with Spec-Driven Development!
