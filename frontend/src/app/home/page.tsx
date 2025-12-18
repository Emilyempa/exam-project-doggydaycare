'use client';

import Hero from "@/components/hero/Hero";
import GetInTouch from "@/components/get-in-touch/Get-in-touch";
import InfoHome from "@/components/info-home/Info-home";


export default function Page() {
  return (
    <main>
      <Hero />
      <InfoHome/>
      <GetInTouch />
    </main>
  );
}
