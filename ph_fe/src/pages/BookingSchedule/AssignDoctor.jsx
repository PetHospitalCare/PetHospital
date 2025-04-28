import { useState, useEffect } from "react";
import axios from "axios";
import { UserService } from "@/services/UserService";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingServices } from "@/services/BookingService";

const AssignDoctor = ({ open, onOpenChange, booking, onUpdate }) => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [loading, setLoading] = useState(false);

    // Lấy danh sách bác sĩ
    useEffect(() => {
        const getAllDoctor = async () => {
            try {
                const respon = await UserService.getAllDoctor();
                setDoctors(respon.data.doctor);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu bác sĩ:", error);
            }
        };
        getAllDoctor();
    }, []);

    const handleUpdate = async () => {
        if (!selectedDoctor) {
            toast.error("Vui lòng chọn bác sĩ phụ trách!");
            return;
        }

        setLoading(true);
        try {
            const res = await BookingServices.AssignDoctor(booking?._id, selectedDoctor);
            if (res.status === 200) {
                toast.success("Cập nhật thành công!");
                onUpdate();
                onOpenChange(false); // Đóng modal
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật cuộc hẹn:", error);
            toast.error("Cập nhật thất bại, thử lại sau!");
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chọn bác sĩ</DialogTitle>
                    <DialogDescription>
                        Hãy chọn bác sĩ phụ trách cho cuộc hẹn này!
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-right font-medium">Bác sĩ</span>
                        <Select onValueChange={setSelectedDoctor}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn bác sĩ" />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.map((doctor) => (
                                    <SelectItem key={doctor._id} value={doctor._id}>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={doctor?.url ?
                                                    doctor?.url : "/profile.png"
                                                } alt={doctor.name} />
                                                {/* <AvatarFallback>{doctor?.username.charAt(0)}</AvatarFallback> */}
                                            </Avatar>
                                            <span>{doctor?.username}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleUpdate} disabled={loading}>
                        {loading ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AssignDoctor;
