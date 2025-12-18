import {Card} from "@/components/card/Card";

export default function InfoHome() {
  return(
    <section>
      <h2 className={"text-3xl font-bold mt-10 mb-5"}>Why Choose Doggy Daycare?</h2>
      <p className={"text-lg"}>We provide a safe, fun, and loving environment where your furry friends can play, </p>
      <p className={"text-lg"}>socialize, and receive the care they deserve while you are working.</p>
      <Card
        title="Loving Care"
        className={"card-sm"}
      >
        <p>Our experienced staff treats every dog like their own</p>
        <p>ensuring personalized attention and care</p>
      </Card>
      <Card
        title="Flexible Hours"
        className={"card-sm"}
      >
        <p>Open Monday through Friday with extended hours</p>
        <p>to accommodate your busy schedule.</p>
      </Card>
      <Card
        title="Safe Environment"
        className={"card-sm"}
      >
        <p>Secure, clean facilities with 24/7 supervision</p>
        <p>and staff with education in dog safety</p>
      </Card>
      <Card
        title="Socialization"
        className={"card-sm"}
      >
        <p>Structured playtime and activities help dogs</p>
        <p>develop social skills and make new friends.</p>
      </Card>
    </section>
  )
}
