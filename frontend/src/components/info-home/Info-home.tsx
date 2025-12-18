import {Card} from "@/components/card/Card";

export default function InfoHome() {
  return(
    <section>
      <Card
        title="Loving Care"
      >
        <p>Our experienced staff treats every dog like their own</p>
        <p>ensuring personalized attention and care</p>
      </Card>
      <Card
        title="Flexible Hours"
      >
        <p>Open Monday through Friday with extended hours</p>
        <p>to accommodate your busy schedule.</p>
      </Card>
      <Card
        title="Safe Environment"
      >
        <p>Secure, clean facilities with 24/7 supervision</p>
        <p>and staff with education in dog safety</p>
      </Card>
      <Card
        title="Socialization"
      >
        <p>Structured playtime and activities help dogs</p>
        <p>develop social skills and make new friends.</p>
      </Card>
    </section>
  )
}
