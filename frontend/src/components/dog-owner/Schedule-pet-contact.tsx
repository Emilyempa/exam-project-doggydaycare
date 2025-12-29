"use client";

import { useState } from "react";

export default function SchedulePetContact() {
  // 0 = first button active, 1 = second, 2 = third
  const [activeIndex, setActiveIndex] = useState(0);

  const buttons = ["Schedule", "Dog Info", "Contact Info"];

  return (
    <section className="flex justify-center mt-5 space-x-4">
      {buttons.map((label, index) => (
        <button
          key={label}
          onClick={() => setActiveIndex(index)}
          className={index === activeIndex ? "" : "secondary"}
        >
          {label}
        </button>
      ))}
    </section>
  );
}
