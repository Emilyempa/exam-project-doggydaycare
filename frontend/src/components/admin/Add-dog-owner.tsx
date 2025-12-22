import {Card} from "@/components/card/Card";
import {UserRoundPlus} from "lucide-react";

export default function AddDogOwner() {
  return(
    <section className="flex flex-col items-center text-center">
      <Card
        icon={UserRoundPlus}
        title="Add New Dog Owner"
        className="card-lg"
      >
        <div>
          <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="
                input
              "
            />
        </div>
        <div>
          <label htmlFor="first name">First Name</label>
          <input
            id="first name"
            name="first name"
            type="first name"
            required
            className="
                input
              "
          />
        </div>
        <div>
          <label htmlFor="last name">Last Name</label>
          <input
            id="last name"
            name="last name"
            type="last name"
            required
            className="
                input
              "
          />
        </div>
        <div>
          <label htmlFor="mobile number">Mobile Number</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="
                input
              "
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="
                input
              "
          />
        </div>
        <button className="btn-primary w-full mt-8">Add Dog Owner</button>
      </Card>
    </section>
  )
}
