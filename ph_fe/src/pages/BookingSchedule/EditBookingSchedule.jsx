import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Services } from "@/services/Services";
import { PetRecordService } from "@/services/PetRecordService";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/16/solid';
import { BookingServices } from "@/services/BookingService";
import { toast } from "sonner";
import { User } from "lucide-react";
import { UserService } from "@/services/UserService";
import { format } from "date-fns"
export default function EditBookingDialog({ open, onClose, bookingData, onUpdate, status }) {
    const [service, setService] = useState([]);
    const [pet, setPet] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        type: "dog",
        scheduleType: "",
        subServiceId: "",
        scheduleDate: "",
        scheduleTime: "",
        pet_id: "",
        account_id: "",

        note: ""
    });
    const [doctors, setDoctors] = useState([]);
    const [selected, setSelected] = useState();
    const getAvailableHours = () => {
        const currentDate = new Date();
        const selectedDate = new Date(formData.scheduleDate);
        const isToday = selectedDate.toDateString() === currentDate.toDateString();

        const allHours = [
            "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
            "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
        ];

        if (!isToday) return allHours;

        const currentHour = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();
        const currentTime = currentHour + (currentMinutes / 60);

        return allHours.filter(time => {
            const [hours, minutes] = time.split(":").map(Number);
            const appointmentTime = hours + (minutes / 60);
            // Add 1 hour buffer for preparation
            return appointmentTime > (currentTime + 1);
        });
    };
    useEffect(() => {
        if (formData.scheduleDate) {
            const availableHours = getAvailableHours();
            if (!availableHours.includes(formData.scheduleTime)) {
                setFormData(prev => ({ ...prev, scheduleTime: "" }));
            }
        }
    }, [formData.scheduleDate]);
    // Fetch services and pets
    const fetchService = async () => {
        try {
            const response = await Services.getAllService();
            if (response.data.success) {
                setService(response.data.services);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu dịch vụ:", error);
        }
    };
    const fetchDoctors = async () => {
        try {
            const response = await UserService.getAllDoctor();
            if (response.data) {
                setDoctors(response.data.doctor);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bác sĩ:", error);
        }
    };


    const fetchPet = async () => {
        try {
            if (!bookingData?.account_id) return;
            const response = await PetRecordService.GetAllPetByAccount(bookingData?.account_id);
            if (response.data.success) {
                setPet(response.data.petRecords);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu thú cưng:", error);
        }
    };

    // Load booking data when modal opens
    useEffect(() => {
        fetchService();
        fetchDoctors();
        if (bookingData) {
            setFormData({
                name: bookingData.guest_name || "",
                phone: bookingData.guest_phone || "",
                email: bookingData.guest_email || "",
                type: bookingData.type || "dog",
                scheduleType: bookingData.service_id || "",
                subServiceId: bookingData.sub_service_id || "",
                scheduleDate: bookingData.date ? new Date(bookingData.date).toISOString().split('T')[0] : "",
                scheduleTime: bookingData.hour || "",
                pet_id: bookingData.pet_id?._id || "",
                account_id: bookingData.account_id?._id || "",
                note: bookingData.note || "",
                doctor_id: bookingData.doctor_id?._id || "",
            });

            setSelected(pet.find(p => p._id === bookingData.pet_id?._id));
        }
    }, [bookingData, pet]);

    useEffect(() => {
        fetchPet();
    }, [bookingData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleServiceChange = (serviceId) => {
        const selectedService = service.find((s) => s._id === serviceId);
        setFormData({
            ...formData,
            scheduleType: serviceId,
            subServiceId: selectedService?.subServices.length ? selectedService.subServices[0]._id : "",
        });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.scheduleDate || !formData.scheduleTime || !formData.scheduleType || !formData.subServiceId) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        try {
            // Tạo payload chỉ chứa các trường cần cập nhật
            const payload = {
                date: new Date(formData.scheduleDate).toISOString(), // Ngày hẹn
                hour: formData.scheduleTime, // Giờ hẹn
                service_id: formData.scheduleType, // Loại lịch hẹn
                sub_service_id: formData.subServiceId, // Dịch vụ con
                doctor_id: formData.doctor_id,
                note: formData.note, // Ghi chú
            };
            const response = await BookingServices.UpdateBooking(bookingData._id, payload);
            if (response.status === 200) {
                toast.success(`Cập nhật lịch khám thành công!`);
                onUpdate(); // Cập nhật lại danh sách booking
                onClose(); // Đóng modal
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật lịch khám:", error);
            toast.error("Có lỗi xảy ra khi cập nhật lịch khám!");
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-full max-w-3xl bg-[#FEF7E5] p-8 rounded-xl shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800 text-center">Chỉnh sửa lịch khám</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <Label className="font-medium text-gray-700">Họ và tên <span className="text-red-500">*</span></Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-white border-gray-300 rounded-lg" disabled />
                    </div>
                    <div>
                        <Label className="font-medium text-gray-700">Số điện thoại <span className="text-red-500">*</span></Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="bg-white border-gray-300 rounded-lg" disabled />
                    </div>
                    <div>
                        <Label className="font-medium text-gray-700">Email</Label>
                        <Input id="email" name="email" value={formData.email} onChange={handleChange} className="bg-white border-gray-300 rounded-lg" disabled />
                    </div>
                    <div className="flex gap-6">
                        <div className="w-1/2">
                            <Label className="font-medium text-gray-700">Chọn ngày hẹn <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    name="scheduleDate"
                                    value={formData.scheduleDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                    className="bg-white border-gray-300 rounded-lg pl-3 pr-10 w-full"
                                />
                            </div>
                        </div>
                        <div className="w-1/2">
                            <Label className="font-medium text-gray-700">Chọn giờ hẹn <span className="text-red-500">*</span></Label>
                            <Select onValueChange={(value) => setFormData({ ...formData, scheduleTime: value })} value={formData.scheduleTime}>
                                <SelectTrigger className="bg-white border-gray-300 rounded-lg w-full">
                                    <SelectValue placeholder="Chọn giờ..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {getAvailableHours().length > 0 ? (
                                        getAvailableHours().map((time) => (
                                            <SelectItem key={time} value={time}>{time}</SelectItem>
                                        ))
                                    ) : (
                                        <div className="p-2 text-sm text-gray-500 text-center">
                                            {formData.scheduleDate === new Date().toISOString().split('T')[0]
                                                ? "Không còn giờ trống cho ngày hôm nay"
                                                : "Vui lòng chọn ngày"}
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Label className="font-medium text-gray-700">Thông tin thú cưng</Label>
                        {selected ? (
                            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    {/* Ảnh thú cưng */}
                                    <img
                                        alt="Ảnh thú cưng"
                                        src={selected?.url ? selected?.url : `/${selected?.type}.png`}
                                        className="size-16 rounded-full object-cover"
                                    />
                                    {/* Thông tin chi tiết */}
                                    <div>
                                        <p className="font-semibold text-gray-800">{selected.name}</p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Loại:</span> {selected.type === "dog" ? "Chó" : "Mèo"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Ngày sinh: </span>{selected?.dateOfBirth ? format(new Date(selected?.dateOfBirth), "dd-MM-yyyy") : ""}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Giới tính:</span> {selected.gender === 0 ? "Đực" : "Cái"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Giống:</span> {selected?.species}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Cân nặng (kg): </span> {selected?.weight}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-2 py-3 px-4 text-sm">Không có thông tin thú cưng</div>
                        )}
                    </div>

                    <div>
                        <Label className="font-medium text-gray-700">Chọn loại lịch hẹn <span className="text-red-500">*</span></Label>
                        <Select onValueChange={handleServiceChange} value={formData.scheduleType}>
                            <SelectTrigger className="bg-white border-gray-300 rounded-lg">
                                <SelectValue placeholder="Chọn..." />
                            </SelectTrigger>
                            <SelectContent>
                                {service.map((item) => (
                                    <SelectItem key={item._id} value={item._id}>{item.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {formData.scheduleType && service.find(s => s._id === formData.scheduleType)?.subServices.length > 0 && (
                            <div>
                                <Label>Chọn dịch vụ con <span className="text-red-500">*</span></Label>
                                <Select onValueChange={(value) => setFormData({ ...formData, subServiceId: value })} value={formData.subServiceId}>
                                    <SelectTrigger className="bg-white border-gray-300 rounded-lg">
                                        <SelectValue placeholder="Chọn dịch vụ con..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {service.find(s => s._id === formData.scheduleType).subServices.map((sub) => (
                                            <SelectItem key={sub._id} value={sub._id}>
                                                {sub.name} ({sub.price[formData.type] ? `${sub.price[formData.type].toLocaleString()} VND` : "Giá không có sẵn"})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    {status === "confirm" && (
                        <div>
                            <Label className="font-medium text-gray-700">Bác sĩ phụ trách</Label>
                            <Select
                                value={formData.doctor_id}
                                onValueChange={(value) => setFormData({ ...formData, doctor_id: value })}
                            >
                                <SelectTrigger className="bg-white border-gray-300 rounded-lg">
                                    <SelectValue placeholder="Chọn bác sĩ..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors.map((doctor) => (
                                        <SelectItem key={doctor._id} value={doctor._id}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                                    {doctor.url ? (
                                                        <img
                                                            src={doctor.url}
                                                            alt={doctor.username}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                            <User size={16} className="text-gray-500" />
                                                        </div>
                                                    )}
                                                </div>
                                                {doctor.username}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="col-span-2">
                        <Label className="font-medium text-gray-700">Ghi chú</Label>
                        <Textarea name="note" value={formData.note} onChange={handleChange} placeholder="Nhập thông tin bổ sung..." className="bg-white border-gray-300 rounded-lg" />
                    </div>
                </div>
                <DialogFooter className="mt-6">
                    <Button onClick={handleSubmit} className="w-full bg-[#3F2E2E] text-white py-3 text-lg font-semibold rounded-lg hover:bg-[#2c1f1f]">Cập nhật lịch khám</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}