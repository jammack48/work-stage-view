
## Image-Based Onboarding Carousel

We absolutely **can** use real screenshots! I initially suggested CSS mockups because they automatically adapt to light/dark mode without needing extra files, but using actual screenshots is much easier to build and gives you exact control over what users see.

Here is the updated approach using real images:

### Flow
`SplashPage` → `OnboardingCarousel` (New) → `ModePicker` → `App`

### Changes

1. **New `src/components/OnboardingCarousel.tsx`**
   - Uses the existing `useEmblaCarousel` for smooth swiping.
   - Takes a list of slides containing:
     - `image`: The screenshot (we will use placeholders initially, which I will swap out with your actual screenshots once you upload them).
     - `title`: Bold headline.
     - `description`: Short benefit sentence.
   - Includes dot indicators, a "Skip" button, and a "Get Started" button on the final slide.
   - Saves `onboardingSeen=true` to `localStorage` so it only shows once.

2. **Update `src/App.tsx`**
   - Check `localStorage` for the onboarding status.
   - Render the `OnboardingCarousel` right after the splash screen is dismissed.

### Next Steps
Once you approve this plan, I will build the carousel using placeholder images. Then, you can simply **upload your actual app screenshots into this chat**, and I will plug them directly into the slides!
