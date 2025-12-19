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
          <label>Email</label>
          <input
            name="username"
            type="text"
            required
            className="w-full input"
          />
        </div>

        <div>
          <label>Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full input"
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
