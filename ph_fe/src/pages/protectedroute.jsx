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
import { UserService } from "@/services/UserService";
const ProtectedRoute = ({ allowedRoles }) => {
    const { user, setUser } = useContext(UserContext);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const location = useLocation();
    useEffect(() => {
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
                        url: response.data?.account?.url,
                    });
                } else {
                    // Handle unsuccessful but non-error responses
                    setUser(null);
                    setCheckingAuth(false);
                    return;
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu tài khoản:", error);
                if (toast) toast.error("Không thể tải thông tin người dùng");
                setUser(null);
            } finally {
                setCheckingAuth(false);
            }
        };
        fetchUserData();
    }, [location.pathname, setUser]);

    if (checkingAuth) return <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-2">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
    </div>;

    // Kiểm tra user và roles
    if (!user || !user._id) {
        return <Navigate to="/Login" state={{ from: location }} replace />;
    }

    // Kiểm tra quyền truy cập
    const hasRequiredRole = allowedRoles.some(role => user.role?.includes(role));
    if (!hasRequiredRole) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;