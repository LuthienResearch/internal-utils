---
name: refactor-pass
description: This skill should be used when the user asks for a "refactor pass", "cleanup pass", "simplification pass", "dead code removal", "simplify recent changes", "reduce complexity", "clean up recent work", or wants to review and simplify code after recent modifications while verifying behavior with build/tests.
---

# Refactor Pass

Perform a focused simplification pass on recent changes. The goal is to reduce complexity while preserving behavior, verified by build and tests.

## Workflow

### 1. Review Recent Changes

Identify the scope of recent modifications. Use git diff, git log, or the user's description to understand what changed.

### 2. Apply Refactors

Work through these categories in order:

**Dead code and dead paths** - Remove unreachable code, unused imports, unused variables, unused functions, and conditions that can never be true.

**Straighten logic flows** - Convert nested ifs to early returns. Extract complex conditionals into named intermediate variables. Flatten unnecessary nesting.

**Excessive parameters** - Reduce function signatures. Remove parameters that are always the same value, derivable from other parameters, or unused.

**Premature optimization** - Replace clever-but-obscure code with straightforward alternatives. Remove caching or batching that adds complexity without measured benefit.

### 3. Verify Behavior

Run the project's build and test suite. All existing tests must pass. If a test fails, the refactor introduced a regression — revert that specific change and retry.

### 4. Suggest (Don't Apply) Optional Improvements

After the verified refactors, briefly note any opportunities for:
- Extracting a reusable pattern (only if used 3+ times)
- Renaming for clarity

Keep suggestions to a short list. Do not apply these without explicit approval.
