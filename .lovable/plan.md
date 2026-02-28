

## Fix: Make page heading sticky on mobile

The `headingBar` sits inside the scrollable `<main>` element with no sticky positioning, so it scrolls away with the content.

### Change (`src/components/PageToolbar.tsx`)

1. **Update `headingBar` styling** (line 42-46): Add `sticky top-0 z-30` to the heading div so it pins to the top of the viewport while content scrolls beneath it.

Change:
```
"px-4 sm:px-6 py-2 border-b border-border bg-background"
```
To:
```
"px-4 sm:px-6 py-2 border-b border-border bg-background sticky top-0 z-30"
```

This single change fixes the heading across all layout modes (mobile vertical, mobile horizontal, desktop) since they all render the same `headingBar` node inside `<main>`.

