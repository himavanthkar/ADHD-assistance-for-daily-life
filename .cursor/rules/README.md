# Cursor Rules for NeuroBoost

This directory contains Cursor rules that provide context and guidance for the AI assistant when working on the NeuroBoost project.

## Rule Files

### `project-overview.mdc`
- **Type**: Always Applied
- **Purpose**: Provides general project context and guidelines
- **When**: Always included in model context

### `development-workflow.mdc`
- **Type**: Agent Requested
- **Purpose**: Guides development workflow and common tasks
- **When**: Available to AI, which decides whether to include it

### `code-standards.mdc`
- **Type**: Auto Attached
- **Purpose**: Enforces coding standards and conventions
- **When**: Automatically included when working with code files (JS, TS, JSX, TSX, Python, Java, C/C++)

## How to Use

1. **Edit existing rules**: Modify the `.mdc` files to customize the guidance
2. **Add new rules**: Create new `.mdc` files following the format below
3. **Reference files**: Use `@filename.ext` to include specific files as context

## MDC File Format

```yaml
---
description: Brief description of the rule
globs: ["**/*.js", "**/*.ts"]  # Optional: file patterns for auto-attachment
alwaysApply: false  # Optional: whether to always include
---

# Rule content in markdown
- First guideline
- Second guideline
- etc.
```

## Rule Types

- **Always**: Always included in model context
- **Auto Attached**: Included when files matching glob patterns are referenced
- **Agent Requested**: Available to AI, which decides whether to include it
- **Manual**: Only included when explicitly mentioned using @ruleName

## Best Practices

- Keep rules concise (under 500 lines)
- Split large concepts into multiple, composable rules
- Provide concrete examples when helpful
- Avoid vague guidance
- Use descriptive rule names

## Legacy Support

The `requirements.cursorrules` file in the root is deprecated. Use the `.cursor/rules` directory instead for better organization and control.
