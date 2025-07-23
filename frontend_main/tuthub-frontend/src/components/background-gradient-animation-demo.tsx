import React from "react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BackgroundGradientAnimationDemo() {
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(255,255,255)" // white
      gradientBackgroundEnd="rgb(255,255,255)"   // white
      firstColor="255, 0, 80"    // bright red
      secondColor="255, 0, 200"  // bright pink
      thirdColor="0, 120, 255"   // bright blue
      fourthColor="120, 0, 255"  // bright purple
      fifthColor="255, 200, 0"   // bright yellow
      pointerColor="0, 200, 255" // bright cyan
      size="30%"
      blendingValue="hard-light"
    >
      <div className="absolute z-50 inset-0 flex flex-col items-center justify-center text-neutral-900 font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl gap-8">
        <h1 className="text-5xl md:text-7xl font-bold pointer-events-auto">Learn From The Best Teachers</h1>
        <p className="text-xl text-neutral-700 max-w-2xl mx-auto font-normal pointer-events-auto">
          Connect with experienced teachers, access quality courses, and elevate your learning journey with TutHub.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
          <Button size="lg" asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/teachers">Find Teachers</Link>
          </Button>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
} 