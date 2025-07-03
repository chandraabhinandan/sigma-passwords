"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export default function Navbar() {
    const {data: session} = useSession();
  return (
    <>
      <nav className='bg-slate-900 text-white flex justify-between items-center px-40 h-14'>
          <div className='logo font-bold text-purple-800 text-2xl'>🗿 <span className="text-white">Sigma</span> Passwords</div>
          <ul>
              <li>
                  {session ? <button className='bg-purple-800 px-2 py-2 rounded-2xl hover:bg-purple-950' onClick={() => signOut({ callbackUrl: "/" })}>Logout</button> : <button className='bg-purple-800 px-2 py-2 rounded-2xl hover:bg-purple-950' onClick={() => signIn(undefined, { callbackUrl: "/user" })}>Login</button>}
              </li>
          </ul>
      </nav>
      <br />
    </>
  )
}

