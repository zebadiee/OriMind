# 🎯 Quick Reference Card

## Slash Commands Cheat Sheet

| Command | Purpose | When to Use |
|---------|---------|-------------|
| **`/constitution`** | Define project principles | **Start here** - First thing to do |
| **`/specify`** | Describe what to build | After constitution - Define your feature |
| **`/clarify`** | Answer structured questions | After specify - Reduce ambiguity |
| **`/plan`** | Create technical plan | After clarify - Choose tech stack |
| **`/tasks`** | Break into actionable items | After plan - Get task list |
| **`/analyze`** | Check consistency | After tasks - Optional validation |
| **`/implement`** | Build the feature | Final step - Execute all tasks |

## 🚀 Your First 5 Minutes

```
1. Open VS Code:  code .
2. Open Copilot Chat (Ctrl+Shift+I)
3. Type: /constitution
   Input: "Focus on clean code, good UX, and simplicity"
4. Type: /specify
   Input: "Build a simple todo list with add, complete, delete"
5. Follow the prompts!
```

## 💡 Example Workflows

### Simple Todo App
```
/constitution
"Keep it simple, focus on user experience"

/specify
"Todo list: add tasks, mark complete, delete, local storage"

/plan
"Vanilla JavaScript, no frameworks, localStorage"

/tasks
(review)

/implement
```

### Complex Feature
```
/constitution
"Enterprise-grade, scalable, well-tested"

/specify
"User authentication with OAuth, role-based access, audit logs"

/clarify
(answer detailed questions)

/plan
"Node.js backend, React frontend, PostgreSQL, Redis cache"

/tasks
(review dependencies)

/analyze
(validate coverage)

/implement
```

## 📁 Where Things Are Saved

| Content | Location |
|---------|----------|
| Principles | `.specify/memory/constitution.md` |
| Specifications | `.specify/specs/001-[name]/spec.md` |
| Plans | `.specify/specs/001-[name]/plan.md` |
| Tasks | `.specify/specs/001-[name]/tasks.md` |

## 🎨 Tips & Tricks

### Be Specific in /specify
✅ GOOD: "Users can mark tasks complete with a checkbox, which toggles a strikethrough style"  
❌ VAGUE: "Users can complete tasks"

### Use /clarify Every Time
Even if you think your spec is clear, `/clarify` catches edge cases.

### Review Before /implement
Check `tasks.md` to ensure you agree with the approach.

### Tech Stack in /plan
Specify exact versions and justify choices:
```
/plan
React 18.2 (hooks, no class components)
Tailwind CSS 3.x (utility-first styling)
Vite 5.x (fast dev server)
```

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Command not found | Restart VS Code, check `.github/prompts/` exists |
| No spec found | Run `/specify` first |
| Wrong tech stack used | Be explicit in `/plan` command |
| Tasks unclear | Run `/clarify` after `/specify` |

## 📚 Learn More

- Full Guide: [GETTING_STARTED.md](./GETTING_STARTED.md)
- Framework Comparison: [../FRAMEWORK_SUMMARY.md](../FRAMEWORK_SUMMARY.md)
- Decision Tree: [../DECISION_TREE.md](../DECISION_TREE.md)

---

**Remember:** Start with `/constitution`, then `/specify`, then follow the flow! 🚀
