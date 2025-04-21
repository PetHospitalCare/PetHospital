import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
    CalendarCheck,
    Contact,
    ShoppingBasket,
    Lock,
    LayoutDashboard
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { ShoppingCartContext } from "@/contexts/ShoppingCartContext.jsx";
export default function DropdownMenuDemo(user) {
    const navigate = useNavigate();
    const { logoutContext } = useContext(UserContext)
    const { setDataCartContext } = useContext(ShoppingCartContext);
    const { isChangeCart, setDataIsChangeCartContext } = useContext(ShoppingCartContext);

    const handleLogout = () => {
        logoutContext()
        setDataCartContext(0);
        setDataIsChangeCartContext(!isChangeCart);
        navigate("/")
    }

    const goToOrders = () => {
        navigate('/orders');
    }
    console.log(user)
    const getProfileLink = (roles) => {
        if (roles?.includes("admin")) return "/Dashboard";
        if (roles?.includes("doctor")) return "/Schedule";
        if (roles?.includes("staff")) return "/Booking_Management";
        return "";
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-medium">Xin chào {user?.user?.username} !</span>
                    <Avatar>
                        <AvatarImage src={user?.user?.url} alt="User Avatar" />
                        <AvatarFallback>{user?.user?.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" style={{ scrollbarGutter: "stable" }}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {user?.user?.role && !user.user.role.includes("customer") && (
                        <Link to={getProfileLink(user.user.role)}>
                            <DropdownMenuItem>
                                <LayoutDashboard />
                                <span>Trang quản lí</span>
                            </DropdownMenuItem>
                        </Link>
                    )}
                    <Link to="/profile">
                        <DropdownMenuItem>
                            <Contact />
                            <span>Thông tin cá nhân</span>
                        </DropdownMenuItem>
                    </Link>

                    <Link to="/history-booking">
                        <DropdownMenuItem>
                            <CalendarCheck />
                            <span>Lịch sử đặt lịch</span>
                        </DropdownMenuItem>
                    </Link>

                    <DropdownMenuItem onClick={goToOrders}>
                        <ShoppingBasket />
                        <span>Đơn hàng</span>
                    </DropdownMenuItem>

                    <Link to="/change-password">
                        <DropdownMenuItem>
                            <Lock />
                            <span>Đổi mật khẩu </span>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    <span>Log out</span>

                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
