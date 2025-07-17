import type { Metadata } from "next";
import "./globals.css";
import MainBasicAnim from "@/components/mainBasicAnim";

export const metadata: Metadata = {
  title: "Real Time Chat App",
  description: "test project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="w-[100vw] h-[100vh] relative">
          <div className="bg-[#010125] w-full h-full flex items-center justify-center">
            {/* <MainBasicAnim /> */}
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-[#00000098] backdrop-blur-md flex items-center justify-center z-[1]">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
