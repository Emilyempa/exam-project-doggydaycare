import { Card } from "@/components/card/Card";
import { Users, Trash2, Pencil, Mail, Phone } from "lucide-react";

export default function EditDeleteDogOwner() {
  /*Temporary users for UI */
  const owners = [
    {
      id: 1,
      fullname: "Ove Lindström",
      email: "ove@example.com",
      phone: "070-123 45 67",
      dogs: ["Bella", "Max"]
    },
    {
      id: 2,
      fullname: "Anna Bergqvist",
      email: "anna.bergqvist@mail.se",
      phone: "073-987 65 43",
      dogs: ["Molly", "Charlie", "Luna"]
    }
  ];

  return (
    <section className="flex flex-col items-center text-center">
      <Card
        icon={Users}
        title="Registered Dog Owners"
        description="Dog owners in the system"
        className="card-lg"
      >
        <ul className="space-y-6">
          {owners.map((owner) => (
            <li
              key={owner.id}
              className="bg-feature-primary rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div  className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 text-left space-y-3">
                  <h3 className="text-lg font-bold text-brand-secondary">
                    {owner.fullname}
                  </h3>

                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} className="text-brand-secondary" />
                      <span>{owner.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-">
                      <Phone size={16} className="text-brand-secondary" />
                      <span>{owner.phone}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wide mb-2">
                      Dogs:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {owner.dogs.map((dog, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-brand-secondary text-beige-light px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {dog}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-8 p-3 flex-shrink-0">
                  <button
                    className="p-2 rounded-lg"
                    aria-label="Edit dog owner"
                  >
                    <Pencil size={20}/>
                  </button>

                  <button
                    className="p-2 rounded-lg"
                    aria-label="Delete dog owner"
                  >
                    <Trash2 size={20}/>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
