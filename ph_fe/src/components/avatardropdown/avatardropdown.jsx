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
export default function DropdownMenuDemo(user) {
    const navigate = useNavigate();
    const { logoutContext } = useContext(UserContext)
    const handleLogout = () => {
        logoutContext()
        navigate("/")
    }
    const handletest = () => {
        console.log(user.user)
    }
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
                    <Link to="/profile">
                        <DropdownMenuItem onClick={handletest}>
                            <User />
                            <span>Profile</span>
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                        <CreditCard />
                        <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
