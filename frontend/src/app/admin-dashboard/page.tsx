import {Header} from "@/components/header/Header";
import AddOwnerAndDog from "@/components/admin/Add-owner-and-dog";
import EditDeleteDogOwner from "@/components/admin/Edit-delete-dog-owner";

export default function Page() {
  return (
    <main>
      <Header title="Admin Dashboard"/>
      <AddOwnerAndDog/>
      <EditDeleteDogOwner/>
    </main>
  );
}
