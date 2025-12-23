import {Header} from "@/components/header/Header";
import DogAttendance from "@/components/staff/Dog-attendance";

export default function Page() {
  return (
    <main>
      <Header title="Staff Dashboard"/>
      <DogAttendance/>
    </main>
  );
}
