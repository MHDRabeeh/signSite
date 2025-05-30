"use client"
import Image from "next/image";
import Dashboard from './dashboard/page'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect to login if no token
    }
  }, [])
  return (
    <>
      <Dashboard />
    </>
  );
}
