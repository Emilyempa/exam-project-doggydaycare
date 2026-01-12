'use client';

import Hero from "@/components/home-page/Hero";
import GetInTouch from "@/components/home-page/Get-in-touch";
import About from "@/components/home-page/About";


export default function Page() {
  return (
    <main>
      <Hero />
      <About/>
      <GetInTouch />
    </main>
  );
}
