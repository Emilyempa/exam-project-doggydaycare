import {Card} from "@/components/card/Card";
import {Heart, Clock, Shield, Users} from 'lucide-react';

export default function InfoHome() {
  return(
    <section className={"flex flex-col items-center text-center"}>
      <h2 className={"text-3xl font-bold mt-10 mb-5"}>Why Choose Doggy Daycare?</h2>
      <p className={"text-xl"}>We provide a safe, fun, and loving environment where your furry friends can play, </p>
      <p className={"text-xl"}>socialize, and receive the care they deserve while you are working.</p>
      <div className={"grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl"}>
      <Card
        icon={Heart}
        title="Loving Care"
        className={"card-sm"}
      >
        <p>Our experienced staff treats every dog like their own</p>
        <p>ensuring personalized attention and care</p>
      </Card>
      <Card
        icon={Clock}
        title="Flexible Hours"
        className={"card-sm"}
      >
        <p>Open Monday through Friday with extended hours</p>
        <p>to accommodate your busy schedule.</p>
      </Card>
      <Card
        icon={Shield}
        title="Safe Environment"
        className={"card-sm"}
      >
        <p>Secure, clean facilities with 24/7 supervision</p>
        <p>and staff with education in dog safety</p>
      </Card>
      <Card
        icon={Users}
        title="Socialization"
        className={"card-sm"}
      >
        <p>Structured playtime and activities help dogs</p>
        <p>develop social skills and make new friends.</p>
      </Card>
      </div>
    </section>
  )
}
