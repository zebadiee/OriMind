# Spec Kit Quick Launch

This directory contains simple launcher scripts to get you started with GitHub Spec Kit quickly.

## 🚀 Quick Start

### Windows PowerShell
```powershell
.\launch.ps1
```

### Windows Command Prompt
```cmd
launch.bat
```

## What the launcher does

1. **Checks for prerequisites** - Verifies that `uv` package manager is installed
2. **Installs uv if needed** - Automatically installs uv using the official installer
3. **Installs Specify CLI** - Sets up the spec-kit command-line tool
4. **Runs your commands** - Executes any specify commands you pass to it

## Usage Examples

### Show help and available commands
```powershell
.\launch.ps1
```

### Initialize a new project
```powershell
.\launch.ps1 init my-project
```

### Initialize with a specific AI agent
```powershell
# GitHub Copilot
.\launch.ps1 init my-project --ai copilot

# Claude Code
.\launch.ps1 init my-project --ai claude

# Cursor
.\launch.ps1 init my-project --ai cursor

# Gemini CLI
.\launch.ps1 init my-project --ai gemini
```

### Check installed tools
```powershell
.\launch.ps1 check
```

### Initialize in current directory
```powershell
.\launch.ps1 init . --ai copilot
# or
.\launch.ps1 init --here --ai copilot
```

## Supported AI Agents

- `claude` - Claude Code
- `copilot` - GitHub Copilot  
- `gemini` - Gemini CLI
- `cursor` - Cursor
- `qwen` - Qwen Code
- `opencode` - opencode
- `codex` - Codex CLI
- `windsurf` - Windsurf
- `kilocode` - Kilo Code
- `auggie` - Auggie CLI
- `roo` - Roo Code
- `q` - Amazon Q Developer CLI

## After Setup

Once the launcher installs the Specify CLI, you can use it directly:

```powershell
specify init my-project --ai copilot
specify check
```

## Manual Installation (Alternative)

If you prefer to install manually:

1. Install uv:
   ```powershell
   powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```

2. Install Specify CLI:
   ```powershell
   uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
   ```

## Troubleshooting

If you encounter issues:

1. **PowerShell Execution Policy**: Run PowerShell as Administrator and execute:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **PATH not updated**: Close and reopen your terminal after installation

3. **Manual uv installation**: Visit https://docs.astral.sh/uv/getting-started/installation/

## Learn More

- [Spec-Driven Development Guide](./spec-driven.md)
- [Full README](./README.md)
- [GitHub Spec Kit Repository](https://github.com/github/spec-kit)
