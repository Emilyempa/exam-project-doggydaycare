"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/card/Card";
import { CalendarClock, Dog, User } from "lucide-react";
import ScheduleTab from "./tabs/Schedule-tab";
import DogInfoTab from "./tabs/Dog-info-tab";
import ContactInfoTab from "./tabs/Contact-info-tab";

export default function SchedulePetContact() {
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = useMemo(() => [
    {
      label: "Schedule",
      component: <ScheduleTab />,
      icon: CalendarClock,
      title: "Schedule",
      description: "Add your dogs doggy daycare schedule here.",
    },
    {
      label: "Dog Info",
      component: <DogInfoTab />,
      icon: Dog,
      title: "Dog Info",
      description: "Check or edit your dog information here.",
    },
    {
      label: "Contact Info",
      component: <ContactInfoTab />,
      icon: User,
      title: "Contact Info",
      description: "Check or edit your contact information here",
    },
  ], []);

  const activeTab = tabs[activeIndex];

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Buttons to change tabs */}
      <section className="flex justify-center mt-5 space-x-4">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => setActiveIndex(index)}
            className={index === activeIndex ? "" : "secondary"}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {/* Card with active tab content */}
      <Card
        icon={activeTab.icon}
        title={activeTab.title}
        description={activeTab.description}
        className="mt-6"
      >
        {activeTab.component}
      </Card>
    </div>
  );
}
