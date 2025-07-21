"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { FiEye, FiEyeOff } from "react-icons/fi";

type SetValues = {
  email: string;
  password: string;
  repeatPassword?: string;
};

interface InputWithLabel {
  title: string;
  isPassword?: boolean;
  name: string;
  setValue: React.Dispatch<React.SetStateAction<SetValues>>;
  error: string;
}

export default function InputWithLabel({
  title,
  isPassword,
  name,
  setValue,
  error,
}: InputWithLabel) {
  const [inpStyle, setInpStyle] = useState(false);
  const [inpValue, setInpValue] = useState("");

  // make global input value
  useEffect(() => {
    if (setValue)
      setValue((prev) => ({
        ...prev,
        [name]: inpValue,
      }));
  }, [inpValue]);

  return (
    <div className="w-full flex flex-col gap-y-[5px]">
      <Label htmlFor={title}>{title}</Label>
      <div className="flex items-center gap-[10px]">
        <Input
          type={isPassword ? (inpStyle ? "text" : "password") : "text"}
          placeholder={title}
          value={inpValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInpValue(e.target.value)
          }
          className={`${error && "border-[red] border-[1px]"}`}
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
