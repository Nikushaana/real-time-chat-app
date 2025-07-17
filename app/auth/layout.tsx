"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="w-[400px] bg-white flex flex-col gap-y-[15px] rounded-[10px] p-[16px]">
      <h1 className="text-center text-[20px]">
        {pathname.split("/")[2] == "login"
          ? "Welcome, Please Log in to message your friends."
          : "Register in our Program to message your Friends :)"}
      </h1>
      {children}
    </div>
  );
}
