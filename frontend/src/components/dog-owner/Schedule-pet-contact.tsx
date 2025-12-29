"use client";

import { useState } from "react";
import { Card } from "@/components/card/Card";
import { CalendarClock, Dog, User } from "lucide-react";

// Separate for each tab
function ScheduleTab() {
  return (
    <div>
      <p>Add your dogs schedule...</p>
      {/* Add a schedule form here */}
    </div>
  );
}

function DogInfoTab() {
  return (
    <div>
      <p>Dog information</p>
      {/* Add a dog info form here */}
    </div>
  );
}

function ContactInfoTab() {
  return (
    <div>
      <p>Your contact information...</p>
      {/* Add contact info form here */}
    </div>
  );
}

export default function SchedulePetContact() {
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = [
    {
      label: "Schedule",
      component: <ScheduleTab />,
      icon: CalendarClock,
      title: "Schedule",
      description: "Add your dogs doggy daycare schedule here."
    },
    {
      label: "Dog Info",
      component: <DogInfoTab />,
      icon: Dog,
      title: "Dog Info",
      description: "Check or edit your dog information here."
    },
    {
      label: "Contact Info",
      component: <ContactInfoTab />,
      icon: User,
      title: "Contact Info",
      description: "Check or edit your contact information here"
    }
  ];

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
