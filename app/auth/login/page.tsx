"use client";

import InputWithLabel from "@/components/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col gap-y-[10px]">
      <InputWithLabel title="Email" />
      <InputWithLabel title="Password" isPassword={true} />
      <p
        onClick={() => {
          router.push("/auth/signup");
        }}
        className="underline self-end cursor-pointer text-[15px] select-none"
      >
        Register
      </p>
      <Button>
        {/* <Loader2Icon className="animate-spin" /> */}
        Log in
      </Button>
    </div>
  );
}
