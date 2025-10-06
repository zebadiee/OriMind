# 🎯 Spec-Driven Development Workflow

## Visual Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     SPEC-DRIVEN DEVELOPMENT                      │
│                         Complete Workflow                        │
└─────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────┐
    │  STEP 1: Define Project Principles      │
    │  Command: /constitution                 │
    │  Output: .specify/memory/constitution.md│
    └─────────────────────────────────────────┘
                        ↓
    ┌─────────────────────────────────────────┐
    │  STEP 2: Describe What to Build         │
    │  Command: /specify                      │
    │  Output: .specify/specs/001-*/spec.md   │
    └─────────────────────────────────────────┘
                        ↓
    ┌─────────────────────────────────────────┐
    │  STEP 3: Clarify Requirements           │
    │  Command: /clarify (optional)           │
    │  Output: Updates spec with Q&A          │
    └─────────────────────────────────────────┘
                        ↓
    ┌─────────────────────────────────────────┐
    │  STEP 4: Create Technical Plan          │
    │  Command: /plan                         │
    │  Output: .specify/specs/001-*/plan.md   │
    └─────────────────────────────────────────┘
                        ↓
    ┌─────────────────────────────────────────┐
    │  STEP 5: Generate Task Breakdown        │
    │  Command: /tasks                        │
    │  Output: .specify/specs/001-*/tasks.md  │
    └─────────────────────────────────────────┘
                        ↓
    ┌─────────────────────────────────────────┐
    │  STEP 6: Analyze Consistency            │
    │  Command: /analyze (optional)           │
    │  Output: Validation report              │
    └─────────────────────────────────────────┘
                        ↓
    ┌─────────────────────────────────────────┐
    │  STEP 7: Build the Feature              │
    │  Command: /implement                    │
    │  Output: Complete implementation        │
    └─────────────────────────────────────────┘
                        ↓
                   ✨ DONE! ✨
```

## Command Details

### 🎨 /constitution
**Purpose:** Establish project principles and coding standards

**Input Example:**
```
/constitution

Create principles for:
- Clean, maintainable code
- Test-driven development
- User experience first
- Security best practices
- Performance optimization
```

**Output:** Saved to `.specify/memory/constitution.md`

---

### 📝 /specify
**Purpose:** Create detailed feature specification

**Input Example:**
```
/specify

Build a task management app with:

Features:
- Create, edit, delete tasks
- Set priority (high/medium/low)
- Due dates with reminders
- Filter by status and priority
- Search functionality

UI:
- Clean, modern interface
- Responsive design
- Drag-and-drop ordering
- Dark mode support

Storage:
- Local storage for offline use
- Export/import as JSON
```

**Output:** Saved to `.specify/specs/001-task-manager/spec.md`

---

### 🤔 /clarify
**Purpose:** Ask structured questions to resolve ambiguities

**When to Use:** After `/specify` and before `/plan`

**What Happens:**
- AI asks targeted questions about unclear requirements
- You answer them
- Answers are added to your specification
- Reduces rework later

**Example Questions AI Might Ask:**
- "How should completed tasks be displayed?"
- "What happens if a due date is in the past?"
- "Should there be user authentication?"
- "What's the max number of tasks supported?"

---

### 🛠️ /plan
**Purpose:** Create technical implementation plan with chosen tech stack

**Input Example:**
```
/plan

Tech Stack:
- Frontend: React 18 with TypeScript
- Styling: Tailwind CSS
- State: Zustand (lightweight state management)
- Storage: IndexedDB for offline support
- Build: Vite

Architecture:
- Component-based design
- Custom hooks for logic
- Service layer for storage
- Type-safe throughout
```

**Output:** Multiple files:
- `.specify/specs/001-*/plan.md` - Main plan
- `.specify/specs/001-*/data-model.md` - Data structures
- `.specify/specs/001-*/research.md` - Technical decisions

---

### ✅ /tasks
**Purpose:** Break plan into ordered, actionable tasks

**What It Creates:**
```
Task List with:
- Task description
- Dependencies
- Parallel execution markers
- Test requirements
- Acceptance criteria
```

**Output:** Saved to `.specify/specs/001-*/tasks.md`

**Example Task Structure:**
```
## Phase 1: Setup
- [ ] Initialize Vite project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up project structure

## Phase 2: Core Components (parallel)
- [ ] Create Task component
- [ ] Create TaskList component
- [ ] Create TaskForm component

## Phase 3: State Management
- [ ] Set up Zustand store (depends on Phase 1)
- [ ] Implement task CRUD operations
- [ ] Add persistence layer

## Phase 4: Features
- [ ] Implement filtering (depends on Phase 3)
- [ ] Add search functionality
- [ ] Implement drag-and-drop

## Phase 5: Polish
- [ ] Add dark mode
- [ ] Implement responsive design
- [ ] Add animations
```

---

### 🔍 /analyze
**Purpose:** Validate consistency and coverage across artifacts

**What It Checks:**
- Spec → Plan alignment
- Plan → Tasks coverage
- Missing requirements
- Inconsistencies
- Potential issues

**When to Use:** After `/tasks`, before `/implement`

**Output:** Analysis report with recommendations

---

### 🚀 /implement
**Purpose:** Execute all tasks and build the feature

**What It Does:**
1. Reads task breakdown from `tasks.md`
2. Executes tasks in correct order
3. Respects dependencies
4. Writes code, tests, and documentation
5. Provides progress updates

**What Happens:**
- Creates all necessary files
- Implements functionality
- Writes tests (if specified)
- Updates documentation
- Commits changes (if git enabled)

---

## 📊 File Structure After Workflow

```
demo-project/
├── .specify/
│   ├── memory/
│   │   └── constitution.md          # ← /constitution output
│   ├── specs/
│   │   └── 001-task-manager/
│   │       ├── spec.md              # ← /specify output
│   │       ├── plan.md              # ← /plan output
│   │       ├── tasks.md             # ← /tasks output
│   │       ├── data-model.md        # ← /plan creates
│   │       └── research.md          # ← /plan creates
│   ├── scripts/
│   └── templates/
├── src/                              # ← /implement creates
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
├── tests/                            # ← /implement creates
└── package.json                      # ← /implement creates
```

## 💡 Pro Tips for Each Command

### /constitution Tips
- Be specific about coding standards
- Include non-functional requirements (performance, security)
- Reference industry standards if applicable
- Keep it concise but comprehensive

### /specify Tips
- Focus on WHAT, not HOW
- Include edge cases
- Describe user interactions
- Be specific about data and validation
- Include acceptance criteria

### /clarify Tips
- Answer all questions thoroughly
- Think about edge cases
- Be specific about desired behavior
- Don't skip this step!

### /plan Tips
- Specify exact versions
- Justify technology choices
- Consider scalability
- Think about testing strategy
- Document assumptions

### /tasks Tips
- Review for logical order
- Check dependencies
- Ensure nothing is missing
- Verify parallel tasks make sense

### /analyze Tips
- Fix issues before implementing
- Update specs if needed
- Re-run /tasks if major changes

### /implement Tips
- Review tasks one final time
- Ensure you have time for full implementation
- Monitor progress
- Test as you go

## 🎯 Quick Start Workflow

**For Your First Feature (5-10 minutes):**

```
1. /constitution
   "Keep it simple and user-friendly"

2. /specify
   "Todo list: add, complete, delete tasks. Store in localStorage."

3. /plan
   "Vanilla JavaScript, no frameworks, basic CSS"

4. /tasks
   (Review the tasks)

5. /implement
   (Watch it build!)
```

## 🚀 You're Ready!

Open VS Code with: `code .`

Then start with: `/constitution`

**Happy building with spec-driven development!** 🎉
