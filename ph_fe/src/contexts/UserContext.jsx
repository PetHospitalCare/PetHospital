import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";


const UserContext = React.createContext(null);

const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    const loginContext = (data) => {
        setUser({
            _id: data._id,
            role: data.role,
            email: data.email,
            username: data.username,
        });
    };

    const logoutContext = () => {
        setUser({});
        Cookies.remove("access_token");
    };
    useEffect(() => {
        const jwtToken = Cookies.get("access_token");
        console.log("Token từ cookies:", jwtToken);
        if (jwtToken) {
            try {
                const decoded = jwtDecode(jwtToken);
                console.log("Decoded token:", decoded);
                setUser({
                    id: decoded.id,
                    role: decoded.role,
                    email: decoded.email,
                    username: decoded.username,
                });
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
