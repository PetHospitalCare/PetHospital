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
        if (user) {
            setTimeout(() => {
                toast.success("Đăng nhập thành công");
            }, 1000); // Delay 1 giây
        }
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
                    phone: response.data.account.phone
                });
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu tài khoản:", error);
            toast.error("Không thể tải thông tin người dùng");
        }
    };
    useEffect(() => {
        const jwtToken = Cookies.get("access_token");
        if (jwtToken) {
            try {
                fetchUserData();
            } catch (error) {
                console.error("Lỗi khi decode token:", error);
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);



    return <UserContext.Provider value={{ user, setUser, loginContext, logoutContext, loading }}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
