"use client";

import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface UserProviderContextType {
  userData: User | null;
  setUserNewRender: React.Dispatch<React.SetStateAction<number>>;
  handleUserLogOut: () => void;
  onlineUserIds: string[];
}

const defaultUserContext: UserProviderContextType = {
  userData: null,
  setUserNewRender: () => {},
  handleUserLogOut: () => {},
  onlineUserIds: [],
};

export const userProviderContext =
  createContext<UserProviderContextType>(defaultUserContext);

interface Props {
  children: React.ReactNode;
}

const UserContext = ({ children }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const [userData, setUserData] = useState<User | null>(null);
  const [userNewRender, setUserNewRender] = useState(0);

  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  // logged in user information
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setUserData(null);
        if (pathname.startsWith("/dashboard")) {
          router.push("/auth/login");
        }
      } else {
        setUserData(data.user);

        const { data: existingUser, error: selectError } = await supabase
          .from("users")
          .select("id")
          .eq("id", data.user.id)
          .maybeSingle();

        if (!existingUser && !selectError) {
          const { error: insertError } = await supabase.from("users").insert({
            id: data.user.id,
            email: data.user.email,
          });

          if (insertError) {
            console.error("Error inserting user:", insertError.message);
          }
        }

        if (pathname.startsWith("/auth")) {
          router.push("/dashboard/users");
        }
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUserData(session.user);
        }
        if (event === "SIGNED_OUT") {
          setUserData(null);
          if (pathname.startsWith("/dashboard")) {
            router.push("/auth/login");
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [userNewRender, pathname, router]);

  // collect online users in one data
  useEffect(() => {
    if (!userData) return;

    const channel = supabase.channel("online-users", {
      config: {
        presence: {
          key: userData.id,
        },
      },
    });

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.track({ online_at: new Date().toISOString() });
      }
    });

    channel.on("presence", { event: "sync" }, () => {
      const presenceState = channel.presenceState();
      setOnlineUserIds(Object.keys(presenceState));
    });

    return () => {
      channel.untrack();
      channel.unsubscribe();
    };
  }, [userData]);

  // logout user functionality
  const handleUserLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed. Please try again.");
    } else {
      setUserData(null);
      toast.success("Logged out successfully!");
      router.push("/auth/login");
    }
  };

  return (
    <userProviderContext.Provider
      value={{
        userData,
        setUserNewRender,
        handleUserLogOut,
        onlineUserIds,
      }}
    >
      {children}
    </userProviderContext.Provider>
  );
};

export default UserContext;
