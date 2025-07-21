import { create } from "zustand";

interface SmallVarStates {
  showSideBar: boolean;
  userType: string;
  friendId: string | null;

  toggleShowSideBar: () => void;
  setUserType: (newType: string) => void;
  setFriendId: (newType: string) => void;
}

const useSmallVarStore = create<SmallVarStates>((set) => ({
  showSideBar: true,
  userType: "users",
  friendId: "",

  toggleShowSideBar: () =>
    set((state) => ({
      showSideBar: !state.showSideBar,
    })),
  setUserType: (string) =>
    set(() => ({
      userType: string,
    })),
  setFriendId: (string) =>
    set(() => ({
      friendId: string,
    })),
}));

export default useSmallVarStore;
