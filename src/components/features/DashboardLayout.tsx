"use client";

import { LogoutButton } from "@/components/features/LogoutButton";
import type { SessionPayload } from "@/lib/session";

//Shows the dashboard or page containing all of the website's posts
//Inherits values from the server-side page.tsx that provides it with 
//the initial data from the database
export default function DashboardLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: SessionPayload | null;
}) {
  const picture = session?.user_picture ?? "/images/default-avatar.png";
  const username = session?.user_username ?? "User";

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Navigation menu/top bar section */}
      <header
        className="
          sticky top-0 z-30 w-full h-16 bg-scarlet
          flex items-center justify-between px-4 text-slate-300
        "
      >
        <div className="flex items-center gap-2">
          <img
              src="/images/postit-logo.png"
              alt="Logo"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-4xl font-medium text-white">PostIt</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <img
              src={picture}
              alt="Profile"
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-white">{"Welcome, " + username}</span>
          </div>
        
          <LogoutButton />
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-milkshake">
          <main className="flex-1 overflow-y-auto bg-marshmallow sm:mx-8 md:mx-16 lg:mx-50">
            <div className="pt-5 pl-10 pr-10 pb-10 max-w-full bg-marshmallow">{children}</div>
          </main>
      </div>
    </div>
  );
}