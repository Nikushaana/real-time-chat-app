"use client";

import React, { useState } from "react";

export default function MainBasicAnim() {
  const [lines, setLines] = useState([
    {
      id: 1,
      color: "bg-orange-200",
      delay: "0.3s",
    },
    {
      id: 2,
      color: "bg-orange-300",
      delay: "0.4s",
    },
    {
      id: 3,
      color: "bg-orange-500",
      delay: "0.5s",
    },
    {
      id: 4,
      color: "bg-orange-700",
      delay: "0.6s",
    },
    {
      id: 5,
      color: "bg-orange-300",
      delay: "0.7s",
    },
    {
      id: 6,
      color: "bg-orange-800",
      delay: "0.8s",
    },
  ]);

  return (
    <div className="flex flex-col items-center justify-around gap-y-[40px] relative">
      {lines.map((item, index) => (
        <div
          key={index}
          className={`${item.color} rounded-full absolute ${
            index % 2 == 1 ? "wave-left h-[20px] w-[80vw]" : "wave-right w-[20px] h-[80vh]"
          }`}
          style={{ animationDelay: item.delay }}
        />
      ))}
    </div>
  );
}
