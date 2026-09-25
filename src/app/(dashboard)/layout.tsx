import { getSession } from "@/lib/session";
import DashboardLayout from "@/components/features/DashboardLayout";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  //Calls the DashboardLayout client-side component to build the actual layout
  //The session created during login is passed to initialize the dashboard's
  //personalized elements
  return <DashboardLayout session={session}>{children}</DashboardLayout>;
}