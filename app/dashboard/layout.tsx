"use client";

import Chat from "@/components/dashboard/chat";
import Header from "@/components/dashboard/header";
import SideBar from "@/components/dashboard/sideBar";
import useSmallVarStore from "@/components/zustandStore/useSmallVarStore";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const { setUserType, setFriendId } = useSmallVarStore();

  // get info about user type and friend id from pathname
  useEffect(() => {
    setUserType(pathname.split("/")[2]);
    setFriendId(pathname.split("/")[3]);
  }, []);

  return (
    <div className="bg-gray-300 flex flex-col gap-y-[10px] rounded-[10px] p-[16px] w-[1000px] max-lg:w-[calc(100%-32px)]">
      <Header />
      <hr />
      <div className="flex gap-[10px] h-[400px] overflow-x-hidden">
        <SideBar />
        <Chat />
      </div>
    </div>
  );
}
