import {Card} from "@/components/card/Card";
import {Phone, Mail, MapPin} from 'lucide-react';

export default function GetInTouch() {
  return(
    <footer className={"footer flex flex-col items-center text-center"}>
      <h3 className={"text-3xl font-bold mb-3 mt-20 p-10"} >Get in touch</h3>
      <p className={"text-xl mb-5 pb-10"}>Have questions? We would love to hear from you!</p>

      <div className={"grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl w-full px-4"}>
        {/* Phone */}
        <div className={"flex flex-col items-center"}>
          <Phone className={"w-8 h-8 mb-2"} style={{color: '#5A9690'}} />
          <p className={"text-lg font-semibold"}>Phone</p>
          <p>(555) 123-DOGS</p>
        </div>

        {/* Email */}
        <div className={"flex flex-col items-center"}>
          <Mail className={"w-8 h-8 mb-2"} style={{color: '#5A9690'}} />
          <p className={"text-lg font-semibold"}>Email</p>
          <p>hello@doggydaycare.com</p>
        </div>

        {/* Address */}
        <div className={"flex flex-col items-center"}>
          <MapPin className={"w-8 h-8 mb-2"} style={{color: '#5A9690'}} />
          <p className={"text-lg font-semibold"}>Address</p>
          <p>123 Puppy Lane</p>
          <p>Dogtown, CA 12345</p>
        </div>
      </div>
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
