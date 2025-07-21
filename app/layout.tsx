import type { Metadata } from "next";
import "./globals.css";
import MainBasicAnim from "@/components/mainBasicAnim";
import { ToastContainer } from "react-toastify";
import UserContext from "@/components/datas/user/userContext";

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
        <UserContext>
          <div className="w-[100vw] h-[100vh] relative">
            <div className="bg-[#010125] w-full h-full flex items-center justify-center overflow-hidden">
              <MainBasicAnim />
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-[#00000098] backdrop-blur-sm flex items-center justify-center z-[1]">
              {children}
            </div>
          </div>
        </UserContext>
        <ToastContainer />
      </body>
    </html>
  );
}
