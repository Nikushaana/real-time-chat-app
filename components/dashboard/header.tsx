"use client";

import React, { useContext } from "react";
import { FaPeopleGroup } from "react-icons/fa6";
import { SlLogout } from "react-icons/sl";
import { useRouter } from "next/navigation";
import useSmallVarStore from "../zustandStore/useSmallVarStore";
import { userProviderContext } from "../datas/user/userContext";

export default function Header() {
  const router = useRouter();
  const { handleUserLogOut } = useContext(userProviderContext)!;

  const { showSideBar, toggleShowSideBar, userType, setUserType, setFriendId } =
    useSmallVarStore();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-[10px]">
        <div
          onClick={toggleShowSideBar}
          className={`hidden max-lg:flex cursor-pointer h-[40px] w-[40px] text-[22px] items-center justify-center shadow rounded-[20px] duration-200 ${
            showSideBar ? "text-white bg-[#010125] rotate-[360deg]" : ""
          }`}
        >
          <FaPeopleGroup />
        </div>
        <div className="grid grid-cols-2 gap-[10px] h-[40px]">
          {["Users", "Friends"].map((item) => (
            <h1
              key={item}
              onClick={() => {
                if (showSideBar) {
                  toggleShowSideBar();
                }
                setUserType(item);
                router.push(`/dashboard/${item.toLowerCase()}`);
                if (item == "Users") {
                  setFriendId("");
                }
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
      </div>

      <div
        onClick={() => {
          handleUserLogOut();
        }}
        className={`cursor-pointer h-[40px] w-[40px] flex items-center justify-center shadow rounded-[20px] duration-100 hover:text-white hover:bg-[#010125]`}
      >
        <SlLogout />
      </div>
    </div>
  );
}
