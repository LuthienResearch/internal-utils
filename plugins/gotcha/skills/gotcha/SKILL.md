---
name: gotcha
description: Record a gotcha - footgun, edge case, or non-obvious behavior discovered during development
user-invocable: true
---

# Gotcha Recorder

Capture gotchas (surprises, edge cases, footguns) to project documentation.

## When Invoked

### Step 1: Gather Information

Ask user:
1. What's the gotcha? (description)
2. Category:
   - **Footgun**: Easy mistake with bad consequences
   - **Edge case**: Unusual input/state that behaves unexpectedly
   - **Non-obvious**: Behavior that's correct but surprising
3. Where does it apply? (file, function, or general)
4. How to avoid it? (optional workaround/tip)

### Step 2: Find or Create Gotchas File

Look for in order:
1. `docs/gotchas.md`
2. `GOTCHAS.md`
3. `docs/GOTCHAS.md`

If none exist, create `docs/gotchas.md`.

### Step 3: Append Entry

Format:

```markdown
### <Short title>

**Category:** Footgun | Edge case | Non-obvious
**Location:** `path/to/file.py` or General

<Description of the gotcha>

**Avoid by:** <How to prevent/workaround>

---
```

### Step 4: Commit

```bash
git add docs/gotchas.md
git commit -m "docs: add gotcha - <short title>"
```

## Example

Input: "If you pass None to process_data(), it silently returns empty dict instead of raising"

Output in gotchas.md:
```markdown
### process_data() silently accepts None

**Category:** Footgun
**Location:** `src/utils/data.py`

Passing None to process_data() returns {} instead of raising an error. This can mask bugs upstream.

**Avoid by:** Always validate input before calling, or fix the function to raise on None.
```
