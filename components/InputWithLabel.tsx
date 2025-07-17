"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputWithLabel {
  title: string;
  isPassword?: boolean;
}

export default function InputWithLabel({ title, isPassword }: InputWithLabel) {
  const [inpStyle, setInpStyle] = useState(false);
  return (
    <div className="w-full flex flex-col gap-y-[5px]">
      <Label htmlFor={title}>{title}</Label>
      <div className="flex items-center gap-[10px]">
        <Input
          type={isPassword ? (inpStyle ? "text" : "password") : "text"}
          placeholder={title}
          className=""
        />
        {isPassword && (
          <div
            onClick={() => {
              setInpStyle((pre) => !pre);
            }}
            className="cursor-pointer shrink-0"
          >
            {inpStyle ? <FiEye /> : <FiEyeOff />}
          </div>
        )}
      </div>
    </div>
  );
}
