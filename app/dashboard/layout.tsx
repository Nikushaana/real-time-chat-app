"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiMessageRounded } from "react-icons/bi";
import { FaUserFriends } from "react-icons/fa";
import { IoPersonAddOutline, IoPersonRemoveSharp } from "react-icons/io5";
import { SlLogout } from "react-icons/sl";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userType, setUserType] = useState("users");
  const [friendId, setFriendId] = useState("");

  useEffect(() => {
    setUserType(pathname.split("/")[2]);
    setFriendId(pathname.split("/")[3]);
  }, []);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "nikaloza",
      status: "friends",
    },
    {
      id: 2,
      name: "ia",
      status: "friends",
    },
    {
      id: 3,
      name: "loza",
      status: "users",
    },
    {
      id: 4,
      name: "gia",
      status: "users",
    },
    {
      id: 5,
      name: "gogla",
      status: "friends",
    },
    {
      id: 6,
      name: "lali",
      status: "users",
    },
    {
      id: 7,
      name: "gela",
      status: "friends",
    },
    {
      id: 8,
      name: "dato",
      status: "users",
    },
    {
      id: 9,
      name: "nika",
      status: "friends",
    },
  ]);
  return (
    <div className="bg-gray-300 flex gap-[10px] rounded-[10px] p-[16px]">
      <div className="flex flex-col gap-y-[10px] w-[200px]">
        <div className="grid grid-cols-2 gap-[10px] h-[40px]">
          {["Users", "Friends"].map((item) => (
            <h1
              key={item}
              onClick={() => {
                setUserType(item);
                router.push(`/dashboard/${item.toLowerCase()}`);
              }}
              className={`h-full px-[15px] flex items-center justify-center shadow rounded-[10px] cursor-pointer duration-100 ${
                item.toLowerCase() == userType.toLowerCase()
                  ? "bg-[#010125] text-white"
                  : "bg-white"
              }`}
            >
              {item}
            </h1>
          ))}
        </div>
        <hr />
        <div className="flex flex-col gap-y-[5px] h-[300px]">
          {users
            .filter((item) => item.status == userType.toLowerCase())
            .map((item) => (
              <div
                key={item.id}
                className={`h-[35px] flex items-center justify-between duration-100 ${
                  friendId == String(item.id) &&
                  "bg-white px-[5px] rounded-[5px]"
                }`}
              >
                <p
                  onClick={() => {
                    if (item.status == "friends") {
                      router.push(`/dashboard/friends/${item.id}`);
                      setFriendId(String(item.id));
                    }
                  }}
                  className="cursor-pointer w-full h-full flex items-center"
                >
                  {item.name}
                </p>
                <div className="flex items-center gap-[10px]">
                  {item.status == "friends" && (
                    <div
                      className={`cursor-pointer duration-100 text-green-600 hover:text-[green]`}
                    >
                      <BiMessageRounded />
                    </div>
                  )}
                  <div
                    className={`cursor-pointer ${
                      item.status == "friends" ? "text-[red]" : "text-[green]"
                    }`}
                  >
                    {item.status == "friends" ? (
                      <IoPersonRemoveSharp />
                    ) : (
                      <IoPersonAddOutline />
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="w-[calc(40vw-200px)] flex flex-col justify-between gap-y-[10px]">
        <div className={`cursor-pointer self-end h-[20px]`}>
          <SlLogout />
        </div>
        <div className="w-full h-[calc(100%-30px)] shadow rounded-[10px] bg-white flex flex-col justify-between p-[10px]">
          <div className="flex flex-col-reverse bg-gray-100 rounded-[5px] p-[5px] h-[calc(100%-40px)] overflow-y-scroll showScroll">
            {users.map((item, index) => (
              <p
                key={index}
                className={`${index % 2 == 0 ? "self-start" : "self-end"}`}
              >
                {item.name}
              </p>
            ))}
            <div className="flex flex-col items-center justify-center mb-[30px]">
              <BiMessageRounded className="text-[35px]" />
              <p>Start of the chat</p>
            </div>
          </div>
          <div className="flex gap-[10px]">
            <Input type="text" placeholder="Send Message" className="" />
            <Button>
              {/* <Loader2Icon className="animate-spin" /> */}
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
