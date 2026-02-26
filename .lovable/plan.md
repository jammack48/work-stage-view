

## Fix: Restore Original PageToolbar Heading in Manager Mode

The `pageHeading` in `Index.tsx` was changed to show just "Manager Mode" when the manager view is active (lines 73-74). The user wants the original Pipeline Dashboard heading with the `+ Customer`, `+ Quote`, `+ Invoice` buttons and layout toggles to remain unchanged regardless of active view.

### Change

**`src/pages/Index.tsx`** (lines 73-77): Remove the `activeView === "manager"` conditional for `pageHeading` — always show the standard Pipeline Dashboard heading with all original controls.

