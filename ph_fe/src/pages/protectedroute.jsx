// import { Navigate, Outlet } from "react-router-dom";
// import { useContext } from "react";
// import { UserContext } from "../contexts/UserContext";

// const ProtectedRoute = ({ allowedRoles }) => {
//     const { user, loading } = useContext(UserContext);
//     if (loading) return <div>Loading...</div>; // Chờ dữ liệu trước khi render
//     if (!user) {
//         console.log(user)
//         return <Navigate to="/login" />;
//     }

//     if (!allowedRoles.some(role => user.role?.includes(role))) {
//         return <Navigate to="/unauthorized" />;
//     }

//     return <Outlet />;
// };

// export default ProtectedRoute;
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, setUser } = useContext(UserContext);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const jwtToken = Cookies.get("access_token");

        if (!jwtToken) {
            console.log("Không có token, chuyển hướng về login");
            setUser(null);
        } else {
            try {
                const decoded = jwtDecode(jwtToken);
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
        }
        setCheckingAuth(false);

        // Trả về một hàm cleanup hợp lệ (hoặc không return gì)
        return () => { };
    }, [location.pathname, setUser]);

    if (checkingAuth) return <div>Loading...</div>;

    if (!user || !user.id) {
        return <Navigate to="/Login" />;
    }

    if (!allowedRoles.some(role => user.role?.includes(role))) {
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;


