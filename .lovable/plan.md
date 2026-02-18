

## Enhance Pipeline Visual Flow

### What's Changing

Two improvements based on your feedback:

1. **Double chevrons in the flow banner** -- Replace the single `ChevronRight` between stage names with two overlapping chevrons (`>>`) for a stronger directional feel.

2. **Diagonal stripe texture on stage headers** -- Apply the same subtle diagonal scratch/stripe pattern (currently only on the flow banner) to the stage column headers as well. This ties the header visually to the conveyor belt banner above.

### Technical Details

**`src/components/PipelineFlowBanner.tsx`**
- Change from one `ChevronRight` to two stacked/overlapping `ChevronRight` icons between each stage name (using negative margin to overlap them like `>>`)

**`src/components/StageColumn.tsx`**
- Add the same `repeating-linear-gradient` diagonal stripe pattern to the stage header background
- Layer it on top of the existing `--stage-header` color using a CSS `backgroundImage` style alongside the solid `backgroundColor`
- Keep the arrow point clip-path intact

**`src/index.css`**
- No changes needed -- the gradient pattern will be applied inline on the header div, reusing the same stripe approach as `.pipeline-flow-banner`

