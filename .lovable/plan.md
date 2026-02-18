
## Make Column Body Visibly Blue-Tinted

The column body background is currently `hsl(210 20% 32% / 0.2)` which blends into the dark background and looks black. The fix is to increase the blue intensity so it's clearly distinguishable.

### Change
In `src/components/StageColumn.tsx`, update the inline `backgroundColor` on the outer `div` from:
```
hsl(210 20% 32% / 0.2)
```
to a more saturated, lighter blue at higher opacity:
```
hsl(210 30% 45% / 0.15)
```

This bumps the saturation (20% to 30%), lightness (32% to 45%), and keeps enough opacity to read as distinctly blue rather than black. The three traffic light cards will sit on a clearly blue-tinted surface that visually ties to the header.

### Technical Detail
- File: `src/components/StageColumn.tsx`, line 43
- Change the `style` prop value on the outer column `div`
