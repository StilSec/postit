"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { isValidUser, initializeSession } from "@/app/(dashboard)/posts/dataOps";

//Contains the login page of the program
export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");

  //Only accepts users whose username is in the database
  const handleConfirm = async () => {
    const check = await isValidUser(username);

    if(check) {
      await initializeSession(username);
      router.push(`/posts`);
    }
    else {
      setErrorMessage("Invalid username!");
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-milkshake">
      <main className="flex-1 overflow-y-auto bg-marshmallow text-black p-5  sm:mx-16 md:mx-32 lg:mx-50 2xl:mx-150">
        <div className="text-center">
          <div className="mx-auto flex justify-center w-[350px] h-[350px] rounded-full overflow-hidden bg-white">
            <img
              src="/images/postit-logo.png"
              alt="PostIt Logo"
              width={350}
              height={160}
              className="h-full w-full object-contain p-4"
            />
          </div>
          <h2 className="text-2xl my-3 font-bold">Welcome to PostIt!</h2>
        </div>

        <div className="flex flex-col items-center justify-center">
            <div className="w-full">
              <Label htmlFor="login-with-username" className="mb-1">Username</Label>
              <Input
                  id="login-with-username"
                  placeholder="Enter Username ..."
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="bg-white"
                  onKeyDown={(e) => {
                      if (e.key === "Enter" ) handleConfirm();
                  }}
              />
            </div>
            <Button type="button" size="sm" className="mt-3" onClick={handleConfirm}>
                Login
            </Button>
        </div>

        {/* Error message for invalid username */}
        {errorMessage && (
          <div className="mt-4 border-l-4 border-red-500 bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        
      </main>
    </div>
  );
}
