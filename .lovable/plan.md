

## Fix: SettingsPage.tsx broken JSX in CSV import section

### Problem
The "Import Customers" section (lines 267-432) has corrupted JSX from a bad merge of old and new code:
1. The drag-drop `<div>` (line 269-276) is missing its closing `>` before child elements
2. Old inline `<Input>` and text elements (lines 277-280) are orphaned outside any parent
3. A `<Button>` on line 324 wraps a hidden `<input>` + the entire drag-drop UI but is never properly closed
4. The mapping `<Select>` elements appear twice — once inline (lines 282-322) and once in the `<Dialog>` (lines 357-426)

### Fix — Replace lines 267-432
Replace the entire "Import Customers" card with clean JSX that has:

1. **A card wrapper** (`<div className="p-3 rounded-lg bg-card border border-border space-y-3">`)
2. **A hidden file input** triggered by a "Browse CSV" button
3. **A drag-drop zone** with proper `onDragOver`/`onDragLeave`/`onDrop` handlers and a closing `>`
4. **Status text** (selected file name, row count, sign-in notice)
5. **The mapping `<Dialog>`** (already correct at lines 357-426 — keep as-is)
6. Remove the duplicate inline mapping grid (lines 282-322) since the Dialog already handles it

### Technical details
- No logic changes — only fixing JSX structure
- All state variables and handlers (`handleCsvFileSelected`, `handleUpload`, `onDropCsv`, `columnMapping`, `mappingDialogOpen`, etc.) remain unchanged
- The `customerImportService` import bug (double `.from()` calls) is a separate issue but should also be fixed in the same pass

### Secondary fix — customerImportService.ts
Lines with double `.from()` calls like:
```ts
.from(getTable("customers", false))
.from("customers")
```
Need to be corrected to just `.from("customers")` (or use the `getTable` helper properly). Also remove the unused `getTable` import reference since `getTable` is not imported in that file.

