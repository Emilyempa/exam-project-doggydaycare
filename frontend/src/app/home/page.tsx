'use client';

import Hero from "@/components/hero/Hero";
import GetInTouch from "@/components/get-in-touch/Get-in-touch";
import InfoFooter from "@/components/info-home/Info-footer";


export default function Page() {
  return (
    <main>
      <Hero />
      <InfoFooter/>
      <GetInTouch />
    </main>
  );
}
