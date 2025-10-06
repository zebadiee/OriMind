# 🚀 Demo Project - Getting Started Guide

Welcome to your spec-driven development demo project! This guide will walk you through building your first feature using AI-powered slash commands.

## 📂 What's in This Project

```
demo-project/
├── .github/prompts/          # Slash command definitions
│   ├── constitution.prompt.md   # /constitution command
│   ├── specify.prompt.md        # /specify command
│   ├── clarify.prompt.md        # /clarify command
│   ├── plan.prompt.md           # /plan command
│   ├── tasks.prompt.md          # /tasks command
│   ├── analyze.prompt.md        # /analyze command
│   └── implement.prompt.md      # /implement command
│
├── .specify/                 # Spec Kit workspace
│   ├── memory/              # Project memory & principles
│   ├── scripts/             # Helper scripts
│   └── templates/           # Document templates
│
└── GETTING_STARTED.md       # This guide
```

## 🎯 The Spec-Driven Development Workflow

### Step-by-Step Process:

```
1. /constitution → Define project principles
2. /specify      → Describe what to build
3. /clarify      → Ask structured questions (optional but recommended)
4. /plan         → Create technical implementation plan
5. /tasks        → Break down into actionable tasks
6. /analyze      → Check consistency & coverage (optional)
7. /implement    → Build the feature
```

## 📝 Step 1: Open in VS Code

```powershell
# From the demo-project directory
code .
```

This will open the project in VS Code with GitHub Copilot.

## 🎨 Step 2: Use /constitution Command

**What it does:** Establishes your project's governing principles and development guidelines.

**How to use it:**
1. Open the Copilot chat panel (Ctrl+Shift+I or Cmd+Shift+I)
2. Type: `/constitution`
3. Provide context about your project values

**Example prompt:**
```
/constitution

Create principles focused on:
- Clean, maintainable code
- Test-driven development
- User experience consistency
- Performance and scalability
- Security best practices
```

**What happens:**
- Copilot will read the constitution template
- Generate project principles
- Save them to `.specify/memory/constitution.md`
- These principles guide all future development

## 📋 Step 3: Use /specify Command

**What it does:** Creates a detailed specification for what you want to build.

**How to use it:**
1. In Copilot chat, type: `/specify`
2. Describe your feature in detail

**Example prompt:**
```
/specify

Build a task management application with the following features:

Core Functionality:
- Users can create, edit, and delete tasks
- Each task has: title, description, due date, priority (high/medium/low), and status
- Tasks can be organized into projects
- Support for task filtering by status, priority, and project
- Search functionality across all tasks

User Interface:
- Clean, modern design with good UX
- Responsive layout (works on desktop and mobile)
- Drag-and-drop task reordering
- Quick-add task input at top

Data & Storage:
- Store tasks locally (localStorage or IndexedDB)
- Export/import functionality (JSON format)
```

**What happens:**
- Copilot analyzes your requirements
- Creates a structured specification
- Saves to `.specify/specs/001-[feature-name]/spec.md`
- Includes user stories, acceptance criteria, and review checklist

## 🤔 Step 4: Use /clarify Command (Recommended)

**What it does:** Asks structured questions to clarify ambiguous requirements.

**How to use it:**
1. After creating your spec, type: `/clarify`
2. Answer the questions Copilot asks
3. The answers are added to your specification

**Example:**
```
/clarify
```

Copilot might ask:
- "How should tasks with the same priority be ordered?"
- "What happens when a task's due date passes?"
- "Should there be user authentication or is it single-user?"
- "What's the maximum number of tasks expected?"

**Why this matters:** Reduces rework later by catching ambiguities early.

## 🛠️ Step 5: Use /plan Command

**What it does:** Creates a technical implementation plan with your chosen tech stack.

**How to use it:**
1. Type: `/plan`
2. Specify your technology choices

**Example prompt:**
```
/plan

Technology Stack:
- Frontend: Vanilla JavaScript (no frameworks to keep it simple)
- Styling: Tailwind CSS
- Storage: localStorage for tasks
- Build: Vite for development and bundling
- No backend needed (client-side only)

Architecture:
- Single-page application
- MVC-like pattern with separate modules
- Event-driven for task updates
- Modular component structure
```

**What happens:**
- Copilot creates detailed implementation plans
- Generates data models, API specs (if applicable), architecture diagrams
- Saves to `.specify/specs/001-[feature-name]/plan.md`
- Creates supporting documents (data-model.md, research.md, etc.)

## ✅ Step 6: Use /tasks Command

**What it does:** Breaks down the plan into actionable tasks.

**How to use it:**
```
/tasks
```

**What happens:**
- Copilot analyzes the plan
- Creates a prioritized task list
- Marks dependencies and parallel tasks
- Saves to `.specify/specs/001-[feature-name]/tasks.md`
- Each task has: description, dependencies, test requirements

## 🔍 Step 7: Use /analyze Command (Optional)

**What it does:** Performs consistency and coverage analysis.

**How to use it:**
```
/analyze
```

**What happens:**
- Checks spec-to-plan alignment
- Validates task coverage
- Identifies gaps or inconsistencies
- Provides recommendations

## 🚀 Step 8: Use /implement Command

**What it does:** Executes all tasks and builds your feature.

**How to use it:**
```
/implement
```

**What happens:**
- Copilot reads the task breakdown
- Implements each task in order
- Respects dependencies
- Writes tests (if specified)
- Creates all necessary files
- Provides progress updates

## 💡 Pro Tips

### 1. Start Small
For your first feature, pick something simple:
```
/specify
Build a simple todo list with:
- Add tasks
- Mark tasks as complete
- Delete tasks
- Store in localStorage
```

### 2. Be Specific in /specify
The more detail you provide, the better the spec:
- ✅ "Tasks can be marked as complete with a checkbox"
- ❌ "Tasks can be completed"

### 3. Always Run /clarify
Even if you think your spec is clear, run `/clarify` to catch edge cases.

### 4. Review Before /implement
Check the tasks.md file before running `/implement` to ensure you agree with the approach.

### 5. Iterate
You can refine at any stage:
- Update the spec and re-run `/plan`
- Modify the plan and re-run `/tasks`
- Adjust tasks before `/implement`

## 🎯 Quick Start Example

Here's a complete workflow for a simple feature:

```
1. /constitution
   "Focus on simple, clean code with good UX"

2. /specify
   "Build a simple counter app with increment, decrement, and reset buttons"

3. /clarify
   (Answer any questions)

4. /plan
   "Use vanilla HTML/CSS/JS, no build tools needed"

5. /tasks
   (Review the generated tasks)

6. /implement
   (Watch Copilot build it!)
```

## 📚 Understanding the Files

### constitution.md
Your project's guiding principles. Referenced by all commands.

### spec.md
Detailed requirements and user stories for your feature.

### plan.md
Technical approach, architecture, and implementation strategy.

### tasks.md
Ordered list of implementation tasks with dependencies.

### data-model.md (if applicable)
Database schema or data structures.

### research.md (if applicable)
Technical research notes and decisions.

## 🆘 Troubleshooting

### "Slash command not found"
- Make sure you're in VS Code with Copilot installed
- Check that `.github/prompts/` folder exists
- Restart VS Code

### "No specification found"
- Make sure you ran `/specify` first
- Check that files are in `.specify/specs/` folder

### "Implementation not working as expected"
- Review the spec and plan
- Use `/clarify` to add more details
- Update tasks.md if approach needs adjustment

## 🎓 Next Steps

After completing your first feature:

1. **Try a more complex feature** - Add user authentication, API integration, etc.
2. **Explore other AI agents** - Try Claude, Cursor, or other agents
3. **Read framework guides** - Learn about AutoGen, LangGraph for more complex needs
4. **Build a real project** - Apply spec-driven development to your own ideas

## 🔗 Resources

### In This Repository
- `../START_HERE.md` - Main entry point
- `../FRAMEWORK_SUMMARY.md` - Choose the right framework
- `../DECISION_TREE.md` - Visual decision guide
- `../README.md` - Full Spec Kit documentation

### External Resources
- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [Spec Kit Repository](https://github.com/github/spec-kit)
- [Spec-Driven Development Guide](../spec-driven.md)

## 🎉 You're Ready!

You now have everything you need to start building with spec-driven development. 

**Your first command should be:**
```
/constitution
```

Then describe your first feature with:
```
/specify
```

**Happy building! 🚀**

---

*Remember: The key to spec-driven development is starting with WHAT you want to build, not HOW. Let the AI figure out the implementation details based on your clear specifications.*
