"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { status, data: session } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      // if there *is* a session, replace "/" with "/user"
      router.replace("/user");
    }
  }, [status, session, router]);
  if (status === "loading") {
    return (
      <>
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>

        <p className="text-white">Checking session…</p>
      </>
    );
  }
  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
      <div className="text-purple-800 container px-40 py-16 mx-auto">
        <h1 className="text-4xl font-bold text-center">
          🗿 <span className="text-white">Sigma</span> Passwords
        </h1>
        <br />
        <p className="text-purple-600 text-center text-lg">
          Remember your passwords, Not your Ex...
        </p>
      </div>
    </>
  );
}
