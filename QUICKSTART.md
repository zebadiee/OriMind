# 🚀 Quick Start Guide - Spec Kit Launcher

This guide will help you get started with GitHub Spec Kit in the simplest way possible.

## ⚡ Instant Launch (Windows)

### PowerShell (Recommended)
```powershell
.\launch.ps1
```

### Command Prompt
```cmd
launch.bat
```

## 🎯 What Happens When You Run the Launcher?

The launcher automatically:
1. ✅ Checks if `uv` (package manager) is installed
2. 📦 Installs `uv` if it's missing
3. 🔧 Installs the Specify CLI tool
4. 📚 Shows you how to use it

## 📋 Your First Project

Create your first spec-driven project in 3 steps:

### Step 1: Initialize a new project
```powershell
.\launch.ps1 init my-first-project --ai copilot
```

Choose your AI agent:
- `--ai copilot` for GitHub Copilot
- `--ai claude` for Claude Code  
- `--ai cursor` for Cursor
- `--ai gemini` for Gemini CLI

### Step 2: Navigate to your project
```powershell
cd my-first-project
```

### Step 3: Start your AI agent
```powershell
# For GitHub Copilot in VS Code
code .

# For Claude Code
claude

# For Cursor
cursor .
```

## 🎓 Available Slash Commands

Once your AI agent is running in your project, you can use:

| Command | Purpose |
|---------|---------|
| `/constitution` | Define project principles and guidelines |
| `/specify` | Describe what you want to build |
| `/clarify` | Clarify underspecified requirements |
| `/plan` | Create technical implementation plan |
| `/tasks` | Break down into actionable tasks |
| `/analyze` | Analyze consistency and coverage |
| `/implement` | Build the feature |

## 📖 Example Workflow

```text
1. /constitution
   Create principles focused on code quality and user experience

2. /specify
   Build a task management app with drag-and-drop Kanban boards

3. /clarify
   (AI will ask questions to clarify requirements)

4. /plan
   Use React with TypeScript and a REST API backend

5. /tasks
   (AI generates task breakdown)

6. /implement
   (AI implements all tasks)
```

## 🔧 Common Commands

```powershell
# Check installed tools
.\launch.ps1 check

# Initialize in current directory
.\launch.ps1 init . --ai copilot

# Initialize with specific AI agent
.\launch.ps1 init my-app --ai claude

# Get help
.\launch.ps1 --help
```

## 🌟 After Setup

Once installed, you can use `specify` directly from anywhere:

```powershell
specify init my-project --ai copilot
specify check
```

## 📚 Learn More

- **Full Documentation**: See [README.md](./README.md)
- **Methodology Guide**: See [spec-driven.md](./spec-driven.md)
- **Launcher Details**: See [LAUNCHER.md](./LAUNCHER.md)

## 💡 Tips

1. **Be specific** when using `/specify` - describe the "what" and "why", not the "how"
2. **Use `/constitution`** first to establish project principles
3. **Always run `/clarify`** before `/plan` to reduce rework
4. **Choose your tech stack** during the `/plan` phase, not earlier

## 🆘 Troubleshooting

### PowerShell Execution Policy Error
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Command not found after installation
Close and reopen your terminal to refresh the PATH.

### Manual uv installation
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

---

**Ready to build? Start with:** `.\launch.ps1`
