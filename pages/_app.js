import "../src/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];
      if (!token && router.pathname !== "/login") {
        router.push("/login");
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!authenticated && router.pathname !== "/login") {
    return null; // Redirecionamento está em andamento
  }

  return router.pathname === "/login" ? (
    <Component {...pageProps} />
  ) : (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <Component {...pageProps} />
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu bg-primary text-base-content min-h-full w-80 p-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/status">Status</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
