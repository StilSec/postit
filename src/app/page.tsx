import { redirect } from "next/navigation";

//Modified to point to login page
export default function Home() {
  redirect("/login");
}
