import { Button } from "@/components/ui/button";
import { UserService } from "@/services/UserService";
import { Pencil, Upload } from "lucide-react";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useContext } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import PetInfo from "./PetInfo";
import { useLocation } from "react-router-dom";
import UserInfo from "./UserInfo";
import { UserContext } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
export default function UserProfile() {
    const location = useLocation();
    const pathParts = location.pathname.split("/");
    const profilePath = pathParts[1];
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    if (!user) {
        navigate("/login");
    }
    return (
        <div className={profilePath == "admin" ? "w-full " : "container max-w-screen-2xl mx-auto pt-24 px-8 lg:px-16"} >
            {profilePath == "admin" ? (
                <div className="flex justify-center">
                    <div className="w-full max-w-3xl">
                        <UserInfo profilePath={profilePath} />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UserInfo profilePath={profilePath} />
                    <PetInfo />
                </div>
            )}
        </div>
    );
}
