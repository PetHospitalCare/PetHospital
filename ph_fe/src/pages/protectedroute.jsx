import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(UserContext);
    if (loading) return <div>Loading...</div>; // Chờ dữ liệu trước khi render
    if (!user) {
        console.log(user)
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.some(role => user.role?.includes(role))) {
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
