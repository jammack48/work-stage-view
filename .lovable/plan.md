

## Problem

The QuotePage has `disabledTabs` set during the funnel (line 53), which greys out and blocks all tab buttons — including the common navigation tabs (Home, Customers, Schedule). Users are trapped in the funnel with no way to navigate away. If they click a nav tab to leave, nothing happens.

The user wants:
1. All tabs should always be clickable — especially the common navigation tabs (Home, Customers, Schedule)
2. If the user navigates away mid-funnel, show a confirmation dialog: "Save as draft?"

## Changes

### 1. `src/pages/QuotePage.tsx` — Remove `disabledTabs`, add draft confirmation

- Remove `disabledTabs` prop from the funnel's `<PageToolbar>`
- Allow `onTabChange` to work during the funnel — but when a common tab is clicked mid-funnel, show an AlertDialog asking "Save as draft?" with options: **Save Draft**, **Discard**, **Cancel**
- On Save Draft or Discard, navigate to the target page
- On Cancel, stay on the funnel

Replace the funnel return block (lines 40-65):

```tsx
const [showLeaveDialog, setShowLeaveDialog] = useState(false);
const [pendingNavId, setPendingNavId] = useState<string | null>(null);

// Handle tab clicks during funnel
const handleFunnelTabChange = (id: string) => {
  // User wants to navigate away — confirm first
  setPendingNavId(id);
  setShowLeaveDialog(true);
};

const handleLeaveConfirm = (saveDraft: boolean) => {
  setShowLeaveDialog(false);
  if (pendingNavId) {
    // Navigate away (common tab or page tab)
    if (!handleCommonTab(pendingNavId, navigate)) {
      // It's a page-specific tab — complete funnel first or just navigate
      setFunnelComplete(true);
      setActiveTab(pendingNavId as QuotePageTab);
    }
  }
  setPendingNavId(null);
};

const handleLeaveCancel = () => {
  setShowLeaveDialog(false);
  setPendingNavId(null);
};
```

In the funnel return, remove `disabledTabs` and wire up `handleFunnelTabChange`:

```tsx
<PageToolbar
  tabs={QUOTE_TABS}
  activeTab="overview"
  onTabChange={handleFunnelTabChange}
  pageHeading={...}
>
  <QuoteFunnel ... />
  
  <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Leave quote?</AlertDialogTitle>
        <AlertDialogDescription>
          You haven't finished creating this quote. Would you like to save it as a draft?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={handleLeaveCancel}>Cancel</AlertDialogCancel>
        <AlertDialogAction variant="outline" onClick={() => handleLeaveConfirm(false)}>Discard</AlertDialogAction>
        <AlertDialogAction onClick={() => handleLeaveConfirm(true)}>Save Draft</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</PageToolbar>
```

### 2. `src/components/PageToolbar.tsx` — Remove `disabledTabs` prop entirely

Since no page should ever lock out navigation, remove the `disabledTabs` prop from the interface and all references throughout the component. Tabs are always clickable.

### Files changed

| File | Change |
|------|--------|
| `src/pages/QuotePage.tsx` | Remove `disabledTabs`, add leave-confirmation AlertDialog when navigating away mid-funnel |
| `src/components/PageToolbar.tsx` | Remove `disabledTabs` prop and all disabled logic from every tab render |

