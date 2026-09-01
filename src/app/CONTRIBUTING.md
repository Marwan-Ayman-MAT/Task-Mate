# 🤝 Contributing to TaskMate

Thank you for your interest in contributing to TaskMate! 🎉

This document provides guidelines for contributing to the project.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Development Setup](#development-setup)
4. [Coding Standards](#coding-standards)
5. [Commit Messages](#commit-messages)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Documentation](#documentation)

---

## 🌟 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual identity.

### Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Accepting constructive criticism gracefully
- Focusing on what is best for the community

**Unacceptable behavior:**
- Trolling, insulting comments, or personal attacks
- Public or private harassment
- Publishing others' private information
- Other conduct inappropriate in a professional setting

---

## 💡 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node version, etc.)

**Bug Report Template:**

```markdown
**Bug Description**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., macOS 14.1]
- Browser: [e.g., Chrome 120]
- Node: [e.g., 18.17.0]
- TaskMate Version: [e.g., 1.0.0]
```

### Suggesting Features

Feature requests are welcome! Please provide:

- **Clear use case** - Why is this feature needed?
- **Detailed description** - How should it work?
- **Mockups/examples** - Visual aids if possible
- **Alternatives considered** - Other solutions you've thought of

**Feature Request Template:**

```markdown
**Feature Description**
A clear description of the feature.

**Use Case**
Why would this feature be useful?

**Proposed Solution**
How do you envision this working?

**Alternatives**
Other approaches you've considered.

**Additional Context**
Any other information or screenshots.
```

### Contributing Code

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
6. **Push to your fork** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

---

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Supabase account (for backend)

### Local Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/taskmate.git
cd taskmate

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/taskmate.git

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local
# Fill in your Supabase credentials

# Run development server
npm run dev
```

### Project Structure

```
taskmate/
├── components/     # React components
├── utils/          # Utility functions
├── supabase/       # Backend code
├── styles/         # CSS files
└── ...
```

### Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run linter
npm run type-check  # TypeScript type checking
```

---

## 📝 Coding Standards

### TypeScript

- **Use TypeScript** for all new code
- **Define types** for props, state, and functions
- **Avoid `any`** unless absolutely necessary
- **Use interfaces** for object shapes

**Good:**
```typescript
interface TaskProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskProps) {
  // ...
}
```

**Bad:**
```typescript
export function TaskItem(props: any) {
  // ...
}
```

### React

- **Use functional components** with hooks
- **Extract reusable logic** into custom hooks
- **Keep components small** and focused
- **Use meaningful names**

**Good:**
```typescript
function useTaskFilters(tasks: Task[], filter: FilterType) {
  return useMemo(() => {
    return tasks.filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'incomplete') return !task.completed;
      return true;
    });
  }, [tasks, filter]);
}
```

### Styling

- **Use Tailwind CSS** for styling
- **Follow existing patterns**
- **Be responsive** - test mobile and desktop
- **Support dark mode**

**Good:**
```tsx
<div className="flex items-center gap-2 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
  {/* content */}
</div>
```

### File Organization

- **One component per file**
- **Group related files** in directories
- **Use index files** for clean imports

```
components/
├── TaskList/
│   ├── TaskList.tsx
│   ├── TaskItem.tsx
│   └── index.ts
```

### Naming Conventions

- **Components:** PascalCase (`TaskList.tsx`)
- **Utils:** camelCase (`api.ts`)
- **Constants:** UPPER_SNAKE_CASE
- **Types/Interfaces:** PascalCase

---

## 💬 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, etc.)
- **refactor:** Code refactoring
- **test:** Adding/updating tests
- **chore:** Maintenance tasks

### Examples

```bash
feat(tasks): add drag and drop reordering

Implemented drag and drop functionality using react-dnd library.
Tasks can now be reordered by dragging them in manual sort mode.

Closes #42
```

```bash
fix(auth): resolve token refresh issue

Fixed issue where auth token wasn't being refreshed properly,
causing users to be logged out unexpectedly.

Fixes #156
```

```bash
docs(readme): update installation instructions

Added more detailed steps for Supabase setup and
clarified environment variable configuration.
```

---

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Comments added for complex logic
- [ ] Documentation updated (if needed)
- [ ] Tests pass (if applicable)
- [ ] No console errors or warnings
- [ ] Works on both desktop and mobile
- [ ] Dark/light mode both tested

### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)
Add screenshots showing the changes.

## Testing
How were these changes tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added where needed
- [ ] Documentation updated
- [ ] No console warnings/errors
- [ ] Mobile responsive
- [ ] Dark mode tested
```

### Review Process

1. **Automated checks** run on PR
2. **Maintainer review** (may request changes)
3. **Address feedback** and push updates
4. **Approval** from at least one maintainer
5. **Merge** into main branch

---

## 🧪 Testing

### Manual Testing

Before submitting, test:

1. **Core functionality:**
   - Create/edit/delete tasks
   - Complete/uncomplete tasks
   - Filter and search
   - Drag and drop

2. **Edge cases:**
   - Empty states
   - Long task names
   - Many tasks (100+)
   - Rapid clicks

3. **Browsers:**
   - Chrome/Edge
   - Firefox
   - Safari

4. **Devices:**
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)

### Writing Tests (Future)

When adding tests:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskItem } from './TaskItem';

describe('TaskItem', () => {
  it('toggles completion on checkbox click', () => {
    const mockToggle = jest.fn();
    render(<TaskItem task={mockTask} onToggle={mockToggle} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockToggle).toHaveBeenCalledWith(mockTask.id);
  });
});
```

---

## 📚 Documentation

### Code Comments

- **Add JSDoc** for complex functions
- **Explain "why"** not "what"
- **Keep comments up-to-date**

```typescript
/**
 * Filters tasks based on date range and returns only tasks
 * scheduled for the specified day. Uses strict date matching
 * to ensure each day filter shows only that day's tasks.
 * 
 * @param tasks - Array of all tasks
 * @param dateFilter - Selected date filter type
 * @returns Filtered array of tasks
 */
function filterTasksByDate(tasks: Task[], dateFilter: DateFilterType): Task[] {
  // Implementation...
}
```

### README Updates

When adding features, update:

- README.md (feature list)
- SETUP_GUIDE.md (if setup changes)
- API_DOCUMENTATION.md (if API changes)

---

## 🎨 Design Guidelines

### UI/UX Principles

- **Consistency** - Follow existing patterns
- **Accessibility** - Support keyboard navigation
- **Feedback** - Show loading/error states
- **Performance** - Keep it fast and responsive

### Colors

Use CSS variables from `globals.css`:

```css
/* Dark mode */
--bg-primary: #0f1419;
--text-primary: #f3f4f6;
--accent: #3b82f6;

/* Light mode */
--bg-primary: #ffffff;
--text-primary: #111827;
```

---

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in the project

---

## ❓ Questions?

- Open a Discussion on GitHub
- Check existing documentation
- Ask in Pull Request comments

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to TaskMate! 🎉**

**Made with ❤️ by the community**
