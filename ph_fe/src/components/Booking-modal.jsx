import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { Services } from "@/services/Services";
import { Badge } from "@/components/ui/badge";
export default function BookingDialog({ open, onClose }) {
    const { user } = useContext(UserContext);
    const [service, setService] = useState([]);
    const [formData, setFormData] = useState({
        name: user?.username || "",
        phone: user?.phone || "",
        email: user?.email || "",
        pet: "dog",
        scheduleType: "",
        scheduleDate: "",
        note: ""
    })

    const [selectedServices, setSelectedServices] = useState([]);

    const handleServiceChange = (value) => {
        setSelectedServices((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };
    const fetchData = async () => {
        try {
            const response = await Services.getAllService("http://localhost:9999/service/get-all");
            if (response.data.success) {

                setService(response.data.services);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        }
    };

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            name: user?.username || "",
            phone: user?.phone || "",
            email: user?.email || "",
        }));
        fetchData();
    }, [user]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-3xl bg-[#FEF7E5] p-8 rounded-xl shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800 text-center">Đặt lịch khám</DialogTitle>
                </DialogHeader>


                <div className="grid grid-cols-2 gap-6">

                    <div>
                        <Label className="font-medium text-gray-700">Họ và tên <span className="text-red-500">*</span></Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-white border-gray-300 rounded-lg" />
                    </div>
                    <div>
                        <Label className="font-medium text-gray-700">Số điện thoại <span className="text-red-500">*</span></Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="bg-white border-gray-300 rounded-lg" />
                    </div>

                    <div>
                        <Label className="font-medium text-gray-700">Email <span className="text-gray-500 text-sm"></span></Label>
                        <Input id="email" name="email" value={formData.email} onChange={handleChange} className="bg-white border-gray-300 rounded-lg" />
                    </div>

                    <div>
                        <Label className="font-medium text-gray-700">Chọn ngày hẹn <span className="text-red-500">*</span></Label>
                        <div className="relative">
                            <Input type="date" name="scheduleDate" value={formData.scheduleDate} onChange={handleChange} required className="bg-white border-gray-300 rounded-lg" />
                            <Calendar className="absolute right-3 top-3 text-gray-500" size={20} />
                        </div>
                    </div>


                    <div>
                        <Label className="font-medium text-gray-700">Chọn thú cưng</Label>
                        <div className="flex gap-4 justify-center">
                            <button
                                className={`border-2 rounded-lg p-2 w-32 text-center transition-all ${formData.pet === "dog" ? "border-blue-500 shadow-lg" : "border-gray-300"
                                    }`}
                                onClick={() => setFormData({ ...formData, pet: "dog" })}>
                                <img src="/dog.png" alt="Chó" className="w-20 h-20 object-cover mx-auto" />
                                <p className="font-semibold mt-1">Chó</p>
                            </button>
                            <button
                                className={`border-2 rounded-lg p-2 w-32 text-center transition-all ${formData.pet === "cat" ? "border-blue-500 shadow-lg" : "border-gray-300"
                                    }`}
                                onClick={() => setFormData({ ...formData, pet: "cat" })}>
                                <img src="/cat.png" alt="Mèo" className="w-20 h-20 object-cover mx-auto" />
                                <p className="font-semibold mt-1">Mèo</p>
                            </button>
                        </div>
                    </div>

                    <div>
                        <Label className="font-medium text-gray-700">Chọn loại lịch hẹn <span className="text-red-500">*</span></Label>

                        <Select onValueChange={(value) => setFormData({ ...formData, scheduleType: value })}>
                            <SelectTrigger className="bg-white border-gray-300 rounded-lg">
                                <SelectValue placeholder="Chọn..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">Khám tổng quát</SelectItem>
                                <SelectItem value="vaccination">Tiêm phòng</SelectItem>
                                <SelectItem value="surgery">Phẫu thuật</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>



                    <div className="col-span-2">
                        <Label className="font-medium text-gray-700">Ghi chú</Label>
                        <Textarea name="note" value={formData.note} onChange={handleChange} placeholder="Nhập thông tin bổ sung..." className="bg-white border-gray-300 rounded-lg" />
                    </div>
                </div>

                <DialogFooter className="mt-6">
                    <Button className="w-full bg-[#3F2E2E] text-white py-3 text-lg font-semibold rounded-lg hover:bg-[#2c1f1f]">Xác nhận đặt lịch</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
