

## Use Real Screenshots in Onboarding Carousel

### File: `src/components/OnboardingCarousel.tsx`

Replace the `slides` array (lines 17-35) with 4 slides using the uploaded screenshots:

```typescript
const slides: Slide[] = [
  {
    id: 1,
    image: "user-uploads://Screenshot_20260309_172332_Chrome.jpg",
    title: "Stay Connected",
    description: "See every SMS, email and reply in one timeline — know exactly where each customer stands.",
  },
  {
    id: 2,
    image: "user-uploads://Screenshot_20260309_172341_Chrome.jpg",
    title: "Quote Jobs Fast",
    description: "Build detailed quotes with labour, materials and markup — right from your phone.",
  },
  {
    id: 3,
    image: "user-uploads://Screenshot_20260309_172347_Chrome.jpg",
    title: "Send & Track Quotes",
    description: "Review totals, attach cover letters, and send quotes with one tap.",
  },
  {
    id: 4,
    image: "user-uploads://Screenshot_20260309_172352_Chrome.jpg",
    title: "Auto Follow-ups",
    description: "Set up SMS and email sequences that chase quotes for you — no manual follow-up needed.",
  }
];
```

No other files need changes. The carousel navigation, dot indicators, Skip/Next/Get Started buttons, and localStorage persistence all work unchanged with 4 slides.

