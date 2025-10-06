# 🎯 Spec Kit - Simple Launch Scripts

## Overview

This repository now includes simple launcher scripts that make it easy to get started with GitHub Spec Kit without manually installing dependencies.

## 📁 New Files Added

1. **`launch.ps1`** - PowerShell launcher script (Windows/Linux/macOS)
2. **`launch.bat`** - Batch file wrapper for Windows Command Prompt
3. **`QUICKSTART.md`** - Quick start guide for new users
4. **`LAUNCHER.md`** - Detailed launcher documentation

## 🚀 How to Use

### Windows PowerShell (Recommended)
```powershell
.\launch.ps1
```

### Windows Command Prompt
```cmd
launch.bat
```

### With Arguments
```powershell
# Initialize a new project
.\launch.ps1 init my-project --ai copilot

# Check installed tools
.\launch.ps1 check

# Get help
.\launch.ps1 --help
```

## ✨ What the Launcher Does

The launcher script automatically handles:

1. **Checks for `uv`** - Verifies if the uv package manager is installed
2. **Installs `uv`** - Downloads and installs uv if not present
3. **Installs Specify CLI** - Sets up the spec-kit command-line tool from the local repository
4. **Runs Commands** - Executes any specify commands you pass to it
5. **Shows Help** - Displays usage examples when run without arguments

## 🎯 Quick Start Workflow

```powershell
# 1. Run the launcher to install everything
.\launch.ps1

# 2. Initialize a new project
.\launch.ps1 init my-project --ai copilot

# 3. Navigate to the project
cd my-project

# 4. Open in your preferred editor with AI agent
code .  # VS Code with GitHub Copilot
# or
claude  # Claude Code
# or
cursor .  # Cursor
```

## 📋 Features

### Automatic Installation
- Installs `uv` package manager if missing
- Installs Specify CLI from the local repository
- Updates PATH automatically
- No manual configuration needed

### Cross-Platform Support
- Works on Windows PowerShell
- Works on Windows Command Prompt (via batch wrapper)
- Compatible with Linux/macOS (PowerShell Core)

### Error Handling
- Checks prerequisites before proceeding
- Provides helpful error messages
- Includes troubleshooting guidance

### No Emoji Issues
- Uses text-based status indicators (SUCCESS, WARNING, ERROR)
- Compatible with all terminal types
- Works seamlessly in CMD, PowerShell, and other shells

## 🔧 Supported AI Agents

The launcher supports all AI agents that Spec Kit supports:

- GitHub Copilot (`--ai copilot`)
- Claude Code (`--ai claude`)
- Gemini CLI (`--ai gemini`)
- Cursor (`--ai cursor`)
- Qwen Code (`--ai qwen`)
- opencode (`--ai opencode`)
- Codex CLI (`--ai codex`)
- Windsurf (`--ai windsurf`)
- Kilo Code (`--ai kilocode`)
- Auggie CLI (`--ai auggie`)
- Roo Code (`--ai roo`)
- Amazon Q Developer CLI (`--ai q`)

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide for new users
- **[LAUNCHER.md](./LAUNCHER.md)** - Detailed launcher documentation
- **[README.md](./README.md)** - Full Spec Kit documentation
- **[spec-driven.md](./spec-driven.md)** - Spec-Driven Development methodology

## 💡 After Installation

Once the launcher completes setup, you can use the `specify` command directly:

```powershell
specify init my-project --ai copilot
specify check
specify --help
```

## 🆘 Troubleshooting

### PowerShell Execution Policy
If you get an execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### PATH Not Updated
Close and reopen your terminal after installation.

### Manual Installation
If automatic installation fails:
```powershell
# Install uv
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Install Specify CLI
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

## 🎉 Success!

The launcher makes it incredibly simple to get started with Spec-Driven Development. Just run `.\launch.ps1` and you're ready to go!
