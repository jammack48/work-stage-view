import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/onboarding/slide-1.jpg",
    title: "Stay Connected",
    description: "See every SMS, email and reply in one timeline — know exactly where each customer stands.",
  },
  {
    id: 2,
    image: "/onboarding/slide-2.jpg",
    title: "Quote Jobs Fast",
    description: "Build detailed quotes with labour, materials and markup — right from your phone.",
  },
  {
    id: 3,
    image: "/onboarding/slide-3.jpg",
    title: "Send & Track Quotes",
    description: "Review totals, attach cover letters, and send quotes with one tap.",
  },
  {
    id: 4,
    image: "/onboarding/slide-4.jpg",
    title: "Auto Follow-ups",
    description: "Set up SMS and email sequences that chase quotes for you — no manual follow-up needed.",
  },
];

interface OnboardingCarouselProps {
  onComplete: () => void;
}

export function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const isLast = current === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      api?.scrollNext();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end p-4">
          {!isLast ? (
            <Button variant="ghost" onClick={onComplete} className="text-muted-foreground">
              Skip
            </Button>
          ) : (
            <div className="h-10" /> // Spacer to maintain layout when Skip is hidden
          )}
        </div>
        
        <div className="flex-1 flex items-center justify-center pb-8">
          <Carousel setApi={setApi} className="w-full max-w-sm mx-auto">
            <CarouselContent>
              {slides.map((slide) => (
                <CarouselItem key={slide.id}>
                  <div className="p-6 flex flex-col items-center text-center space-y-6">
                    <div className="w-full aspect-[9/16] max-h-[50vh] bg-muted rounded-xl overflow-hidden border-4 border-muted flex items-center justify-center relative shadow-sm">
                      <img 
                        src={slide.image} 
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-foreground">{slide.title}</h2>
                      <p className="text-muted-foreground">{slide.description}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      <div className="p-6 bg-background border-t border-border/50">
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === current ? "w-6 bg-primary" : "w-2 bg-primary/20"
              }`}
            />
          ))}
        </div>
        <Button 
          size="lg" 
          className="w-full h-12 text-base" 
          onClick={handleNext}
        >
          {isLast ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
}
