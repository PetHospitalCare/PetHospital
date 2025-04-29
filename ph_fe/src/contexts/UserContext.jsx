import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { UserService } from "@/services/UserService";

import { toast } from "sonner";
const UserContext = React.createContext(null);

const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    const loginContext = () => {
        fetchUserData();
    };

    const logoutContext = () => {
        setUser(null);
        Cookies.remove("access_token");
        localStorage.removeItem("cart");
    };
    const fetchUserData = async () => {
        try {
            const response = await UserService.getCurrentUser();
            if (response?.data?.success) {
                setUser({
                    _id: response.data.account._id,
                    role: response.data.account.role,
                    email: response.data.account.email,
                    username: response.data.account.username,
                    phone: response.data.account.phone,
                    address: response.data.account.address,
                    url: response.data?.account?.url,
                });
            } else {
                setUser(null);
                Cookies.remove("access_token");
                return;
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu tài khoản:", error);
            toast.error("Không thể tải thông tin người dùng");
        }
    };
    useEffect(() => {
        try {
            fetchUserData();
        } catch (error) {
            console.error("Lỗi khi decode token:", error);
            toast.error("Có lỗi xảy ra khi xác thực người dùng");
            setUser(null);
        }

        setLoading(false);
    }, []);



    return <UserContext.Provider value={{ user, setUser, loginContext, logoutContext, loading }}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };