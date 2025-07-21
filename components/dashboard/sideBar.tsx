"use client";

import React, { useContext, useEffect, useState } from "react";
import useSmallVarStore from "../zustandStore/useSmallVarStore";
import { toast } from "react-toastify";
import { userProviderContext } from "../datas/user/userContext";
import { supabase } from "@/lib/supabase";
import { MdOutlinePersonOff } from "react-icons/md";
import UsersCard from "../card/usersCard";
import { usePathname, useRouter } from "next/navigation";

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { userData, onlineUserIds } = useContext(userProviderContext)!;

  const { showSideBar, userType, setFriendId } = useSmallVarStore();

  const [users, setUsers] = useState<User[] | []>([]);

  // get all users and write status if he is friend or if he is online
  useEffect(() => {
    const fetchUsers = async () => {
      if (!userData) return;

      try {
        const { data: allUsers, error: allUserError } = await supabase
          .from("users")
          .select("*")
          .neq("id", userData.id);

        if (allUserError) {
          return allUserError.message;
        }

        const { data: friendLinks, error: friendLinksError } = await supabase
          .from("friends")
          .select("friend_id")
          .eq("user_id", userData.id);

        if (friendLinksError) {
          return friendLinksError.message;
        }

        const friendIds = friendLinks?.map((f) => f.friend_id) ?? [];

        const usersWithStatus =
          allUsers?.map((u) => ({
            ...u,
            status: friendIds.includes(u.id) ? "friends" : "users",
            isOnline: onlineUserIds.includes(u.id),
          })) ?? [];

        setUsers(usersWithStatus);
      } catch (error: unknown) {
        console.error(
          "Error fetching users:",
          error instanceof Error ? error.message : "Unknown error occurred"
        );
        toast.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, [userData, onlineUserIds]);

  // add friend functionality
  const addFriend = async (friendId: string) => {
    if (!userData) return;

    const { error } = await supabase.from("friends").insert([
      {
        user_id: userData.id,
        friend_id: friendId,
      },
      {
        user_id: friendId,
        friend_id: userData.id,
      },
    ]);

    if (error) {
      toast.error("Failed to add friend: " + error.message);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === friendId ? { ...u, status: "friends" } : u))
      );
      toast.success("Friend added!");
    }
  };


  // remove friend with its messages functionality
  const removeFriend = async (friendId: string) => {
    if (!userData) return;

    // 1. Remove friendship records
    const { error: friendError } = await supabase
      .from("friends")
      .delete()
      .or(
        `and(user_id.eq.${userData.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userData.id})`
      );

    if (friendError) {
      toast.error("Failed to remove friend: " + friendError.message);
      return;
    }

    // 2. Remove messages between the two users (both directions)
    const { error: messageError } = await supabase
      .from("messages")
      .delete()
      .or(
        `and(sender_id.eq.${userData.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${userData.id})`
      );

    if (messageError) {
      toast.error(
        "Friend removed, but failed to delete messages: " + messageError.message
      );
    } else {
      toast.success("Friend and all messages removed!");
    }

    // 3. Reset UI state
    router.push(`/dashboard/${pathname.split("/")[2]}`);
    setFriendId("");
    setUsers((prev) =>
      prev.map((u) => (u.id === friendId ? { ...u, status: null } : u))
    );
  };

  return (
    <div
      className={`w-[200px] flex flex-col gap-y-[5px] h-full overflow-y-scroll showScroll duration-150 ${
        showSideBar
          ? "max-lg:ml-[-210px] max-lg:pointer-events-none max-lg:opacity-0"
          : ""
      }`}
    >
      <h1 className="flex items-center justify-center h-[40px] shrink-0 bg-[#010125e7] text-white text-[13px] font-bold rounded-[10px]">
        {userData?.email}
      </h1>
      {(userType.toLowerCase() == "friends"
        ? users.filter((item) => item.status == "friends")
        : users
      ).length == 0 && (
        <div className="h-full flex flex-col gap-y-[10px] items-center justify-center">
          <MdOutlinePersonOff className="text-[30px]" />
          <h1 className="text-[14px] font-semibold">There is no {userType}</h1>
        </div>
      )}

      {(userType.toLowerCase() == "friends"
        ? users.filter((item) => item.status == "friends")
        : users
      ).length > 0 &&
        (userType.toLowerCase() == "friends"
          ? users.filter((item) => item.status == "friends")
          : users
        ).map((item) => (
          <UsersCard
            key={item.id}
            item={item}
            addFriend={addFriend}
            removeFriend={removeFriend}
          />
        ))}
    </div>
  );
}
