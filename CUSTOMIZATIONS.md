# Customizations

This fork keeps a thin custom layer on top of the upstream `pingdotgg/t3code` project.

## Branch model

- `upstream-main`: clean local mirror of `upstream/main`
- `custom/main`: deployable custom branch with only fork-specific changes
- `feature/*`: short-lived branches created from `custom/main`

## Current custom changes

1. `26a5f764` `feat(web): add mod-enter composer submit`
2. `808de3bf` `fix(web): disable side-panel toggle animations`

When adding new custom behavior, prefer extension points, configuration, or isolated modules over invasive edits to hot upstream files.

## Sync workflow

Update the clean upstream mirror:

```bash
git fetch upstream
git branch -f upstream-main upstream/main
```

Rebase the custom branch onto the latest upstream mirror:

```bash
git checkout custom/main
git rebase upstream-main
```

Create new custom work from the custom branch:

```bash
git checkout custom/main
git checkout -b feature/my-change
```

## Notes

- `rerere` is enabled in this repository to help Git remember repeated conflict resolutions.
- Keep this file updated whenever the fork intentionally diverges from upstream.
