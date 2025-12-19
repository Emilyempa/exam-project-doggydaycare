import { Card } from "@/components/card/Card";
import {CircleUserRound} from "lucide-react";

export const LoginForm = () => {
  return (
    <section className={"flex flex-col items-center text-center"}>
      <a href={"/home"}>Back</a>
    <Card className="card-md"
      icon={CircleUserRound}
      title="Log in"
      description="Use your credentials to log in"
    >
      <form method="POST" action="/login" className="space-y-4">
        <div>
          <label htmlFor="email">Email</label>
          <input
            name="username"
            type="text"
            required
            className="
              w-full
              border
              border-primary
              rounded-md
              px-3
              py-2
              focus:outline-none
              focus:ring-2
              focus:ring-primary
              focus:border-primary
            "
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="text"
            required
            className="
              w-full
              border
              border-primary
              rounded-md
              px-3
              py-2
              focus:outline-none
              focus:ring-2
              focus:ring-primary
              focus:border-primary
            "
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Log in
        </button>
        <a href={"#"}>
          Forgot your Password?
        </a>
      </form>
    </Card>
    </section>
  );
};
