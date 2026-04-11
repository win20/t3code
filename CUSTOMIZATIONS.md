# Customizations

This fork keeps a thin custom layer on top of the upstream `pingdotgg/t3code` project.

## Branch model

- `upstream-main`: clean local mirror of `upstream/main`
- `custom/main`: deployable custom branch with only fork-specific changes
- `feature/*`: short-lived branches created from `custom/main`

## Current custom changes

1. `b7dca508` `feat(web): add mod-enter composer submit`
2. `f8141fde` `fix(web): disable side-panel toggle animations`
3. `93c4f9f6` `docs: add custom fork workflow notes`
4. `3b4cccd8` `build(desktop): support custom app product names`
5. `8980a12d` `docs: record desktop custom build support`
6. `8c1233c9` `build(desktop): reuse release dir for custom app builds`

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
