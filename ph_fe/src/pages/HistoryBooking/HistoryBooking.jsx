import { Button } from "@/components/ui/button";
import { PetService } from "@/services/PetService";
import { UserService } from "@/services/UserService";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as React from "react";
import { Toaster } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function HistoryBooking() {


    return (
        <div className="container mx-auto pt-24">
            <div className="grid grid-cols-2 gap-4">
               <h1>Lịch sử đặt lịch</h1>
            </div>
        </div>
    );
}
