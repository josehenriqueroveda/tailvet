import "src/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LuArrowUpDown,
  LuHouse,
  LuMenu,
  LuPawPrint,
  LuSheet,
  LuSyringe,
  LuUser,
} from "react-icons/lu";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsDrawerOpen(false);
      } else {
        setIsDrawerOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  if (!authenticated && router.pathname !== "/login") {
    return null; // Redirecionamento está em andamento
  }

  return router.pathname === "/login" ? (
    <Component {...pageProps} />
  ) : (
    <div className="flex h-screen">
      <div
        className={`${
          isDrawerOpen ? "w-80" : "w-16"
        } bg-primary text-white flex flex-col transition-all duration-300`}
      >
        <button
          className="p-4 focus:outline-none"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        >
          <LuMenu size={24} />
        </button>
        <ul className="menu flex-grow">
          <li>
            <Link className="text-base text-white" href="/">
              <LuHouse /> {!isDrawerOpen ? null : "Página Inicial"}
            </Link>
          </li>
          <li>
            <Link className="text-base text-white" href="/customers">
              <LuUser /> {!isDrawerOpen ? null : "Clientes"}
            </Link>
          </li>
          <li>
            <Link className="text-base text-white" href="/pets">
              <LuPawPrint /> {!isDrawerOpen ? null : "Pets"}
            </Link>
          </li>
          <li>
            <Link className="text-base text-white" href="/vaccinations">
              <LuSyringe /> {!isDrawerOpen ? null : "Vacinações"}
            </Link>
          </li>
          <li>
            <Link className="text-base text-white" href="/services">
              <LuSheet /> {!isDrawerOpen ? null : "Materiais e Serviços"}
            </Link>
          </li>
          <li>
            <Link className="text-base text-white" href="/status">
              <LuArrowUpDown /> {!isDrawerOpen ? null : "Status"}
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex-grow">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
