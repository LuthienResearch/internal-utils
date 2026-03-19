---
name: dev
description: "End-to-end autonomous development: goal → plan → TDD → implement → validate → PR → address feedback → wait for merge → close tracking. Human approves plan and merge only. Example: /dev implement rate limiting"
user_invocable: true
---

# /dev — Full Autonomous Development Pipeline

One skill to go from goal to merged PR. The human intervenes at two gates:
1. **Plan approval** — before implementation begins
2. **Merge** — the human clicks merge when ready

Everything else runs autonomously: test writing, implementation, validation, PR creation, CI monitoring, addressing review comments.

## Commit Discipline

**Commit early and often. Push after every commit.**

- Commit after every meaningful unit of progress (a test written, a function implemented, a bug fixed)
- Always push immediately after committing — don't accumulate local commits
- When dev_checks or formatting fixes something, commit and push those fixes immediately as their own commit (e.g., `style: fix lint/formatting`)
- After cleanup, commit and push before moving on
- After addressing review comments, commit and push each logical fix separately
- Small, frequent commits are always better than large, infrequent ones

## What NOT to Include in PRs

- **Design docs / spec files** — these are working artifacts for the brainstorming/planning phase, not deliverables. Do not commit them to the repo or include them in PRs.

## Input

- **A goal string**: `/dev implement rate limiting for the admin API`
- **A Trello card**: `/dev https://trello.com/c/abc123`

If no argument, ask: "What should I build? (goal or Trello card URL)"

---

## Stage 1: Setup

### 1.1 Verify Worktree

Run `pwd`. Must contain `.claude/worktrees/`.

If not: STOP. "Not in a worktree. Run `claude --worktree` first, then `/dev` again."

### 1.2 Set Up .env

If `.env` doesn't exist:
- Try `cp ../../.env .env`
- Fallback: `cp .env.example .env`
- Warn if copied from example

### 1.3 Resolve Goal

**Trello card** (URL contains `trello.com/c/`):
- Fetch card: `~/bin/trello card <ID>`
- Extract title + description as goal
- Move to In Progress: `~/bin/trello move <ID> <LIST_ID>` (look up via `~/bin/trello lists <BOARD_ID>`)
- Save card ID for later

**Plain text**: use as-is.

---

## Stage 2: Plan (HUMAN GATE)

### 2.1 Research

- Read ARCHITECTURE.md if it exists
- Search codebase for relevant modules
- Read existing tests in the area
- Check `dev/context/` for learnings, decisions, gotchas

### 2.2 Write Plan

Write `dev/OBJECTIVE.md`:

```markdown
# Objective

<One-sentence goal>

## Description

<Context informed by codebase research>

## Approach

- <Step 1: what to change and why>
- <Step 2: ...>
- <Step 3: ...>

## Test Strategy

- Unit tests: <what to test, which files>
- E2E tests: <whether needed, which scenarios>

## Acceptance Criteria

- [ ] Failing unit tests written
- [ ] Implementation makes all tests pass
- [ ] dev_checks passes
- [ ] <domain-specific criteria>

## Tracking

- Trello: <card URL or "none">
- Branch: <branch>
- PR: <filled later>
```

### 2.3 Get Plan Approval

Present the plan to the user. **STOP and wait for approval.**

Do not proceed until the user confirms. Adjust the plan if they have feedback.

---

## Stage 3: Draft PR + Test-First

### 3.1 Create Draft PR Early

Commit the objective and push immediately — get the draft PR up before writing any code:

```bash
git add dev/OBJECTIVE.md
git commit -m "chore: set objective to <short-handle>"
git push -u origin $(git rev-parse --abbrev-ref HEAD)
gh pr create --draft --title "<type>: <title>" --body "$(cat <<'EOF'
## Objective

<objective statement>

## Approach

<approach from OBJECTIVE.md>

## Acceptance Criteria

<criteria>
EOF
)"
```

Update `dev/OBJECTIVE.md` Tracking section with the PR URL. If Trello card is linked, comment the PR URL on the card.

### 3.2 Write Failing Tests

Write unit tests that define the expected behavior:
- Follow existing test patterns in the project
- Cover happy path, edge cases, error conditions
- Place in the right directory mirroring source structure

### 3.3 Verify Tests Fail Correctly

Run: `uv run pytest <test_files> -v`

Confirm tests fail because the feature doesn't exist, not due to import errors or test bugs. Fix test infrastructure issues until they fail cleanly.

### 3.4 Commit and Push Tests

```bash
git add <test_files>
git commit -m "test: add failing tests for <feature>"
git push
```

---

## Stage 4: Implement

### 4.1 Build It

Implement the feature/fix according to the plan.

**Use tests as the feedback loop**: after each significant change, run the relevant tests to check progress. Don't wait until "done" to test — test continuously.

```bash
uv run pytest <test_files> -v
```

**Commit at each milestone**: when a test starts passing, when a module is complete, when a logical chunk of work is done. Push every commit.

### 4.2 All Tests Pass

Keep iterating until all new tests pass AND existing tests still pass:

```bash
uv run pytest tests/unit_tests/ -v
```

Commit and push when all tests are green.

---

## Stage 5: Validate

### 5.1 Run Cleanup

Invoke `/cleanup` on the changed files to scan for dead code, complexity, duplication, and other quality issues. Fix safe issues, report the rest.

**Commit and push any fixes immediately** (e.g., `style: cleanup pass`).

### 5.2 Code Review

Invoke the `superpowers:requesting-code-review` skill to self-review the implementation against the plan and acceptance criteria. Address any issues found before proceeding.

### 5.3 Run Dev Checks

Execute the project's QC suite — `./scripts/dev_checks.sh` or equivalent (formatting, linting, type checking, tests, coverage). Check the project's CLAUDE.md or build docs for the right command if `dev_checks.sh` doesn't exist.

- Lint/format failures: fix, **commit and push** (`style: fix lint/formatting`), re-run
- Test failures: investigate, fix, **commit and push**, re-run
- Loop until clean

### 5.4 Smoke Test

**Always do a basic smoke test** of the actual user workflow, even when the test strategy says no formal e2e tests are needed. Unit tests verify logic; smoke tests verify the feature actually works end-to-end. Run the feature the way a user would and confirm it doesn't crash.

This step catches integration issues that unit tests miss (e.g., import-time side effects, config loading order, missing files).

### 5.5 E2E Tests

If the test strategy calls for formal e2e tests:
- Check stack status (`docker compose ps`)
- If not running, start it or ask user
- Run targeted e2e tests first, broader suite if those pass
- Fix failures, **commit and push** fixes

---

## Stage 6: Ship

### 6.1 Add Changelog Fragment

Add a changelog fragment to `changelog.d/` following the project's fragment format (see `changelog.d/README.md`). Name it after the branch or feature handle. Include the PR number.

### 6.2 Clear Dev Files

- Empty `dev/OBJECTIVE.md`
- Empty `dev/NOTES.md`

### 6.3 Final Commit and Promote PR

```bash
git add -A
git commit -m "chore: <objective-handle> is ready"
git push
gh pr ready
```

---

## Stage 7: Monitor and React

This stage runs autonomously until the PR is merged.

### 7.1 Set Up Background Monitor

After pushing, set up a single background monitor that polls for **all three** blocking conditions:

1. **CI failures** — `gh pr checks <number>`
2. **New review comments** — compare comment count to baseline
3. **Merge conflicts** — `gh pr view <number> --json mergeable --jq .mergeable`

```bash
PREV_COMMENT_COUNT=$(gh pr view <number> --json comments --jq '.comments | length')
# Poll every 60-120 seconds in background, report on any change
```

When notified, handle whichever condition triggered:

### 7.2 Handle CI Failures

If checks fail:
- Fetch logs: `gh run view <run_id> --log-failed`
- Diagnose and fix
- Run dev_checks locally
- **Commit and push** the fix
- Return to 7.1

### 7.3 Handle Merge Conflicts

If `mergeable` is `CONFLICTING`:
- `git fetch origin main && git merge origin/main`
- Resolve conflicts, **commit and push**
- Return to 7.1

### 7.4 Address Review Comments

Fetch and present all comments:
```bash
gh pr view <number> --json reviews --jq '.reviews[] | select(.state != "APPROVED") | "\(.author.login) (\(.state)): \(.body)"'
gh api repos/<owner>/<repo>/pulls/<number>/comments --jq '.[] | "\(.path):\(.line // .original_line) — \(.user.login): \(.body)"'
```

For each comment:
- **Substantive code feedback**: make changes, run tests to validate
- **Questions or style preferences**: ask the user how to respond

After addressing comments:
- Run unit tests
- Run dev_checks — if it fixes anything, **commit and push the fix separately**
- **Commit and push** the review response (e.g., `fix: address review — <summary>`)
- Return to 7.1

### 7.5 Notify When Ready to Merge

When `reviewDecision` is `APPROVED` and all checks pass:

Tell the user: "PR is approved and all checks pass. Ready to merge when you are."

**Do NOT merge.** The human merges.

### 7.6 Wait for Merge

Monitor PR state:
```bash
gh pr view <number> --json state --jq .state
```

When state is `MERGED`, proceed to Stage 8.

---

## Stage 8: Close Out

### 8.1 Update Trello

If a Trello card was linked:
- Move to Done: `~/bin/trello move <CARD_ID> <DONE_LIST_ID>`
- Comment: "Merged in PR #<number>"

### 8.2 Final Report

```
Ticket complete:
  PR:        <URL> (merged)
  CHANGELOG: <entry>
  Trello:    <moved to Done / not linked>

Done.
```
