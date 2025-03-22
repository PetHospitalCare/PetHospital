import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext.jsx";

export function useUserId() {
    const { user } = useContext(UserContext);
    return user?._id || null;
}
