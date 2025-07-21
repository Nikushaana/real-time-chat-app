"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { BiMessageRounded } from "react-icons/bi";
import { IoPersonAddOutline, IoPersonRemoveSharp } from "react-icons/io5";
import useSmallVarStore from "../zustandStore/useSmallVarStore";
import { toast } from "react-toastify";

interface UserCardType {
  item: User;
  addFriend: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
}

export default function UsersCard({
  item,
  addFriend,
  removeFriend,
}: UserCardType) {
  const router = useRouter();
  const { friendId, setFriendId, setUserType } = useSmallVarStore();

  return (
    <div
      className={`h-[35px] w-full flex items-center gap-[10px] justify-between duration-100 relative ${
        friendId == String(item.id) &&
        "border-l-[2px] border-white rounded-l-[5px] pl-[5px]"
      }`}
    >
      <p
        className={`w-[10px] h-[10px] rounded-full absolute top-0 left-0 ${
          item.isOnline ? "bg-[green]" : "bg-[red]"
        }`}
      ></p>
      <p
        onClick={() => {
          if (item.status == "friends") {
            router.push(`/dashboard/friends/${item.id}`);
            setFriendId(String(item.id));
            setUserType("friends");
          } else {
            toast.error("Add in Friends list before chatting.");
          }
        }}
        className="cursor-pointer w-full h-full flex items-center text-[14px] truncate"
      >
        {item.email}
      </p>
      <div className="flex items-center gap-[10px] shrink-0">
        {item.status == "friends" && (
          <div
            className={`cursor-pointer duration-100 text-green-600 hover:text-[green]`}
          >
            <BiMessageRounded />
          </div>
        )}
        <div
          onClick={() => {
            if (item.status === "friends") {
              removeFriend(item.id);
            } else {
              addFriend(item.id);
            }
          }}
          className={`cursor-pointer ${
            item.status === "friends" ? "text-[red]" : "text-[green]"
          }`}
        >
          {item.status === "friends" ? (
            <IoPersonRemoveSharp />
          ) : (
            <IoPersonAddOutline />
          )}
        </div>
      </div>
    </div>
  );
}
