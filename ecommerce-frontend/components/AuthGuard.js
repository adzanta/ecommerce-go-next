"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicRoutes = ["/login", "/register"];
    if (publicRoutes.some((route) => pathname.startsWith(route))) return;

    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:8080/me", {
          credentials: "include",
        });
        if (!res.ok) {
          router.push("/login");
        }
      } catch (err) {
        router.push("/login");
      }
    };

    checkLogin();
  }, [pathname]);

  return children;
}
