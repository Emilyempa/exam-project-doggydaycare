import {Card} from "@/components/card/Card";

export default function GetInTouch() {
  return(
    <footer>
      <p className={"text-xl font-bold mb-3"} >Get in touch</p>
      <p className={"text-lg mb-5"}>Have questions? We would love to hear from you!</p>
      <p className={"text-lg"}>Phone</p>
      <p className={"mb-3"}>(555) 123-DOGS</p>
      <p className={"text-lg"}>Email</p>
      <p className={"mb-3"}>hello@doggydaycare.com</p>
      <p className={"text-lg"}>Address</p>
      <p>123 Puppy Lane</p>
      <p>Dogtown, CA 12345</p>
      <Card
        title="Business Hours"
        className={"card-md"}
      >
        <p>Monday - Friday 6:00 AM - 8:00 PM</p>
        <p>Saturday - Sunday Closed</p>
      </Card>
    </footer>
  )
}
