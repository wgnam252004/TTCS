import { useContextState } from "./useContextState";
import { useEffect } from "react";

export const useLogout = () => {
  const [user] = useContextState("user");
  const [userCaptured, setUserCaptured] = useContextState("userCaptured");

  useEffect(() => {
    setUserCaptured(!!user);
  }, [user]);
};
