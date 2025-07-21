"use client";

import React, { useContext, useEffect, useState } from "react";
import { BiMessageRounded } from "react-icons/bi";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useSmallVarStore from "../zustandStore/useSmallVarStore";
import { Loader2Icon } from "lucide-react";
import { userProviderContext } from "../datas/user/userContext";
import { supabase } from "@/lib/supabase";
import { IoPersonOutline } from "react-icons/io5";
import { toast } from "react-toastify";

export default function Chat() {
  const { userData } = useContext(userProviderContext)!;
  const { showSideBar, toggleShowSideBar, friendId } = useSmallVarStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newMessageLoader, setNewMessageLoader] = useState(false);

  // get messages data
  useEffect(() => {
    if (!userData?.id) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${userData?.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${userData?.id})`
        )
        .order("created_at", { ascending: true });

      if (!error && data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMsg = payload.new as Message;

          if (
            (newMsg.sender_id === userData?.id &&
              newMsg.receiver_id === friendId) ||
            (newMsg.sender_id === friendId &&
              newMsg.receiver_id === userData?.id)
          ) {
            setMessages((prev) => [...prev, newMsg]);
          }

          if (
            newMsg.receiver_id === userData?.id &&
            newMsg.sender_id !== friendId
          ) {
            toast.info("New message from a friend!", {
              position: "top-right",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userData?.id, friendId]);

  // send message functionality
  const handleSend = async () => {
    if (!newMessage.trim() || !userData?.id || !friendId) {
      toast.error("Input is empty!");
      return;
    }

    setNewMessageLoader(true);
    const { error } = await supabase.from("messages").insert({
      sender_id: userData?.id,
      receiver_id: friendId,
      message: newMessage.trim(),
    });

    if (!error) setNewMessage("");
    setNewMessageLoader(false);
  };

  return (
    <div
      onClick={() => {
        if (!showSideBar) {
          toggleShowSideBar();
        }
      }}
      className={`w-[calc(100%-210px)] max-lg:w-full h-full shadow rounded-[10px] bg-white p-[10px] duration-150 ${
        showSideBar ? "" : "max-lg:mr-[-210px] max-lg:opacity-[0.3]"
      }`}
    >
      {friendId ? (
        <div className="h-full flex flex-col gap-y-[10px] justify-between">
          <div className="flex flex-col-reverse gap-y-[10px] bg-gray-100 rounded-[5px] p-[5px] h-full overflow-y-scroll showScroll">
            {[...messages].reverse().map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-[10px] ${
                  item.sender_id === userData?.id
                    ? "self-end flex-row-reverse"
                    : "self-start"
                }`}
              >
                <div className="w-[40px] h-[40px] text-[18px] flex items-center justify-center rounded-full bg-white shadow">
                  <IoPersonOutline />
                </div>
                <div className="flex flex-col">
                  <h1
                    className={`text-[10px] font-semibold ${
                      item.sender_id === userData?.id ? "self-end" : ""
                    }`}
                  >
                    {item.sender_id === userData?.id ? "You" : "Friend"}
                  </h1>
                  <p>{item.message}</p>
                </div>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center shrink-0 h-[60%]">
              <BiMessageRounded className="text-[35px]" />
              <p>Start of the chat</p>
            </div>
          </div>
          <div className="flex gap-[10px] shrink-0">
            <Input
              type="text"
              placeholder="Send Message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button
              onClick={handleSend}
              className="bg-[green] hover:bg-green-600 cursor-pointer"
            >
              {newMessageLoader && <Loader2Icon className="animate-spin" />}
              Send
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center mb-[30px]">
          <BiMessageRounded className="text-[35px]" />
          <p className="font-semibold">Start messaging with Friend</p>
        </div>
      )}
    </div>
  );
}
