import {Header} from "@/components/header/Header";
import AddDogOwner from "@/components/admin/Add-dog-owner";

export default function Page() {
  return (
    <main>
      <Header title="Admin Dashboard"/>
      <AddDogOwner/>
    </main>
  );
}
