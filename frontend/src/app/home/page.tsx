'use client';

import Hero from "@/components/hero/Hero";
import GetInTouch from "@/components/get-in-touch/Get-in-touch";
import About from "@/components/info-home/About";


export default function Page() {
  return (
    <main>
      <Hero />
      <About/>
      <GetInTouch />
    </main>
  );
}
