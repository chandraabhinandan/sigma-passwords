"use client";
export const dynamic = "force-dynamic";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function UserPage() {
  const router = useRouter();
  const ref = useRef();
  const [show, setshow] = useState(false);
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [list, setlist] = useState([]);
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/");
    },
  });

  useEffect(() => {
    if (status !== "authenticated") return;
    async function fetchData() {
      try {
        let temp = await fetch("/api/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: session.user.email }),
        });
        const res = await temp.json();
        console.log(res);
        setlist(res);
      } catch (err) {
        console.error("Fetch/parse error:", err);
      }
    }
    fetchData();
  }, [status, session]);

  if (status === "loading") {
    return (
      <>
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>

        <p className="text-white">Checking session…</p>
      </>
    );
  }

  const showPassword = () => {
    setshow(!show);
    if (ref.current.src.includes("open.png")) {
      ref.current.src = "closed.png";
    } else {
      ref.current.src = "open.png";
    }
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const savePassword = async () => {
    const newId = uuidv4();
    try {
      await fetch("/api/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, email: session.user.email, id: newId }),
      });
      setlist([...list, { ...form, id: newId }]);
      setform({ site: "", username: "", password: "" });
    } catch (err) {
      console.error("Fetch/parse error:", err);
    }
    toast("Password Saved", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  const copyText = (text) => {
    toast("Copied to clipboard", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text);
  };

  const deleteItem = async (id) => {
    let c = confirm("Do you really want to delete this password?");
    if (c) {
      setlist(list.filter((item) => item.id !== id));
      try {
        await fetch("/api/add", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
      } catch (err) {
        console.error("Fetch/parse error:", err);
      }
      toast("Password Deleted", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const editItem = async (id) => {
    setform(list.filter((item) => item.id === id)[0]);
    setlist(list.filter((item) => item.id !== id));
    try {
      await fetch("/api/add", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error("Fetch/parse error:", err);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
      <div className="text-purple-800 container px-40 py-16 mx-auto">
        <h1 className="text-2xl text-purple-800 font-bold text-center">
          Welcome, Sigma {session.user.name}!
        </h1>
        <div className="text-white flex flex-col p-4 gap-8 items-center">
          <input
            value={form.site}
            name="site"
            onChange={handleChange}
            placeholder="Enter website name"
            className="rounded-full border border-purple-600 w-full p-4 py-1"
            type="text"
          />
          <div className="flex w-full justify-between gap-8">
            <input
              value={form.username}
              name="username"
              onChange={handleChange}
              placeholder="Enter Username"
              className="rounded-full border border-purple-600 w-full p-4 py-1"
              type="text"
            />
            <div className="relative">
              <input
                value={form.password}
                name="password"
                onChange={handleChange}
                placeholder="Enter Password"
                className="rounded-full border border-purple-600 w-full p-4 py-1"
                type={show ? "text" : "password"}
              />
              <span
                className="absolute right-[3px] top-[4px] cursor-pointer"
                onClick={showPassword}
              >
                <img
                  ref={ref}
                  className="p-1"
                  width={26}
                  src="open.png"
                  alt=""
                />
              </span>
            </div>
          </div>
          <button
            onClick={savePassword}
            className="flex justify-center items-center bg-purple-600 rounded-full gap-2 px-4 py-2 w-fit hover:bg-purple-700 border-2 border-purple-900"
          >
            <lord-icon
              src="https://cdn.lordicon.com/gzqofmcx.json"
              trigger="hover"
            ></lord-icon>
            Save Password
          </button>
        </div>
        <div className="passwords">
          <h2 className="text-2xl font-bold py-4 text-purple-400">
            Your Passwords
          </h2>
          {list.length == 0 && (
            <div className="text-purple-400">No Passwords to show</div>
          )}
          {list.length != 0 && (
            <table className="table-auto w-full text-white rounded-md overflow-hidden">
              <thead className="bg-purple-800">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-purple-950">
                {list.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center w-32 py-2">
                        <div className="flex items-center justify-center">
                          {item.site}
                        </div>
                      </td>
                      <td className="text-center w-32 py-2">
                        <div className="flex items-center justify-center">
                          {item.username}
                          <div
                            className="lord size-7 cursor-pointer mx-2"
                            onClick={() => copyText(item.username)}
                          >
                            <img
                              src="copy.png"
                              className="hover:invert"
                              alt=""
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-center w-32 py-2">
                        <div className="flex items-center justify-center">
                          {"*".repeat(item.password.length)}
                          <div
                            className="lord size-7 cursor-pointer mx-2"
                            onClick={() => copyText(item.password)}
                          >
                            <img
                              src="copy.png"
                              className="hover:invert"
                              alt=""
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-center w-32 py-2">
                        <div className="flex justify-center items-center">
                          <div className="flex items-center justify-center">
                            <div
                              className="lord size-7 cursor-pointer mx-2"
                              onClick={() => editItem(item.id)}
                            >
                              <img
                                src="edit.png"
                                className="hover:invert"
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-center">
                            <div
                              className="lord size-7 cursor-pointer mx-2"
                              onClick={() => deleteItem(item.id)}
                            >
                              <img
                                src="delete.png"
                                className="hover:invert"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
