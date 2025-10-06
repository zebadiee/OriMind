# 🚀 Spec Kit Launcher - Getting Started

Welcome! This repository now includes **simple launcher scripts** that make it incredibly easy to get started with GitHub Spec Kit.

## ⚡ Quick Start (30 seconds)

**Windows PowerShell:**
```powershell
.\launch.ps1
```

**Windows Command Prompt:**
```cmd
launch.bat
```

That's it! The launcher will automatically install everything you need.

## 📚 Documentation Files

| File | Description |
|------|-------------|
| **[QUICKSTART.md](./QUICKSTART.md)** | 🎯 **Start here!** Quick start guide for new users |
| **[LAUNCHER.md](./LAUNCHER.md)** | 📖 Detailed launcher documentation and usage |
| **[LAUNCHER_DEMO.md](./LAUNCHER_DEMO.md)** | 🎬 Step-by-step demos with example output |
| **[LAUNCH_README.md](./LAUNCH_README.md)** | 📋 Complete launcher feature overview |
| **[README.md](./README.md)** | 📚 Full Spec Kit documentation |
| **[spec-driven.md](./spec-driven.md)** | 🔬 Spec-Driven Development methodology |

## 🎯 What You Get

The launcher provides:

✅ **Automatic installation** - Installs uv package manager and Specify CLI  
✅ **Zero configuration** - Everything works out of the box  
✅ **Pass-through commands** - Use it like the specify command  
✅ **Cross-platform** - Windows PowerShell & Command Prompt support  
✅ **Smart detection** - Only installs what's missing  
✅ **Helpful guidance** - Shows examples and next steps  

## 🎬 Usage Examples

### Show help and examples
```powershell
.\launch.ps1
```

### Initialize a new project
```powershell
.\launch.ps1 init my-project --ai copilot
```

### Check installed tools
```powershell
.\launch.ps1 check
```

### Initialize with specific AI agent
```powershell
# GitHub Copilot
.\launch.ps1 init my-app --ai copilot

# Claude Code
.\launch.ps1 init my-app --ai claude

# Cursor
.\launch.ps1 init my-app --ai cursor
```

## 🤖 Supported AI Agents

- **copilot** - GitHub Copilot
- **claude** - Claude Code
- **cursor** - Cursor
- **gemini** - Gemini CLI
- **qwen** - Qwen Code
- **opencode** - opencode
- **codex** - Codex CLI
- **windsurf** - Windsurf
- **kilocode** - Kilo Code
- **auggie** - Auggie CLI
- **roo** - Roo Code
- **q** - Amazon Q Developer CLI

## 📋 Complete Workflow Example

```powershell
# 1. Run launcher (first time setup)
.\launch.ps1

# 2. Create a new project
.\launch.ps1 init my-todo-app --ai copilot

# 3. Navigate to project
cd my-todo-app

# 4. Open in VS Code with Copilot
code .

# 5. Use AI slash commands in VS Code:
#    /constitution - Define project principles
#    /specify - Describe what to build
#    /clarify - Answer clarifying questions
#    /plan - Define technical approach
#    /tasks - Break down into tasks
#    /implement - Build it!
```

## 🔧 Launcher Files

| File | Purpose |
|------|---------|
| `launch.ps1` | Main PowerShell launcher script |
| `launch.bat` | Windows batch wrapper for CMD |

## 💡 After Setup

Once installed, you can use `specify` directly from anywhere:

```powershell
specify init my-project --ai copilot
specify check
specify --help
```

## 🆘 Troubleshooting

### PowerShell execution policy error?
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Command not found after installation?
Close and reopen your terminal to refresh PATH.

### Need manual installation?
See [LAUNCHER.md](./LAUNCHER.md#manual-installation-alternative) for manual steps.

## 🎓 Learn More

- **New to Spec-Driven Development?** → Start with [QUICKSTART.md](./QUICKSTART.md)
- **Want to see examples?** → Check out [LAUNCHER_DEMO.md](./LAUNCHER_DEMO.md)
- **Need detailed docs?** → Read [README.md](./README.md)
- **Understanding the methodology?** → See [spec-driven.md](./spec-driven.md)

## 🎉 Ready to Build?

Just run this command and follow the prompts:

```powershell
.\launch.ps1
```

That's it! You're ready to start building software faster with Spec-Driven Development! 🚀

---

**Note:** These launcher scripts were created to provide the simplest possible way to get started with Spec Kit. No complex setup, no manual configuration – just run the script and start building!
