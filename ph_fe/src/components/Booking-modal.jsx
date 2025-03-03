import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Services } from "@/services/Services";
import { Link } from "react-router-dom";
import { PetRecordService } from "@/services/PetRecordService";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'

export default function BookingDialog({ open, onClose }) {
    const { user } = useContext(UserContext);
    const [service, setService] = useState([]);
    const [pet, SetPet] = useState([]);
    const [formData, setFormData] = useState({
        name: user?.username || "",
        phone: user?.phone || "",
        email: user?.email || "",
        type: "dog",
        scheduleType: "",
        subServiceId: "",
        scheduleDate: "",
        scheduleTime: "",
        pet_id: "",
        account_id: user?._id || "",
        note: ""
    });
    const [selected, setSelected] = useState();

    const fetchService = async () => {
        try {
            const response = await Services.getAllService("http://localhost:9999/service/get-all");
            if (response.data.success) {
                setService(response.data.services);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        }
    };
    const fetchPet = async () => {
        try {
            if (!user?._id) return
            const response = await PetRecordService.GetAllPetByAccount(user?._id);
            console.log(response.data.petRecords)
            if (response.data.success) {
                SetPet(response.data.petRecords);
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
            account_id: user?._id || "",
            pet_id: pet[0]?._id || "",
        }));
        fetchService();
        fetchPet();

    }, [user]);
    useEffect(() => {
        if (pet.length > 0) {
            setSelected(pet[0]);
            setFormData(prev => ({ ...prev, pet_id: pet[0]._id }));
        }
    }, [pet]);

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


    const selectedService = service.find((service) => service._id === formData.scheduleType);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.name || !formData.phone || !formData.scheduleDate || !formData.scheduleTime || !formData.scheduleType || !formData.subServiceId) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        console.log(formData)
    }

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
                        <Label className="font-medium text-gray-700">Email</Label>
                        <Input id="email" name="email" value={formData.email} onChange={handleChange} className="bg-white border-gray-300 rounded-lg" />
                    </div>
                    <div className="flex gap-6">
                        <div className="w-1/2">
                            <Label className="font-medium text-gray-700">Chọn ngày hẹn <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <Input type="date" name="scheduleDate" value={formData.scheduleDate} onChange={handleChange} required className="bg-white border-gray-300 rounded-lg pl-3 pr-10 w-full" />
                                {/* <Calendar className="absolute right-3 top-3 text-gray-500" size={20} /> */}
                            </div>
                        </div>
                        <div className="w-1/2">
                            <Label className="font-medium text-gray-700">Chọn giờ hẹn <span className="text-red-500">*</span></Label>
                            <Select onValueChange={(value) => setFormData({ ...formData, scheduleTime: value })}>
                                <SelectTrigger className="bg-white border-gray-300 rounded-lg w-full">
                                    <SelectValue placeholder="Chọn giờ..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"].map((time) => (
                                        <SelectItem key={time} value={time}>{time}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label className="font-medium text-gray-700">Chọn thú cưng</Label>
                        {user ? (
                            <Listbox value={selected} onChange={(value) => {
                                setSelected(value);
                                setFormData(prev => ({ ...prev, pet_id: value._id, type: value.type }));
                            }}>

                                <div className="relative mt-2">
                                    <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                                        <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                                            <img alt="" src={selected?.url || "/dog.png"} className="size-5 shrink-0 rounded-full" />
                                            <span className="block truncate">{selected?.name}</span>
                                        </span>
                                        <ChevronUpDownIcon
                                            aria-hidden="true"
                                            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                        />
                                    </ListboxButton>

                                    <ListboxOptions
                                        transition
                                        className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                                    >
                                        {pet.map((pet) => (
                                            <ListboxOption
                                                key={pet._id}
                                                value={pet}
                                                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                                            >
                                                <div className="flex items-center">
                                                    <img alt="" src={pet?.url || "/dog.png"} className="size-5 shrink-0 rounded-full" />
                                                    <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{pet?.name ? pet?.name : "Vui lòng chọn thú cưng"}</span>
                                                </div>


                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </div>
                            </Listbox>
                        ) : (
                            <div className="flex gap-4 justify-center">
                                {["dog", "cat"].map((pet) => (
                                    <button key={pet} className={`border-2 rounded-lg p-2 w-32 text-center transition-all ${formData?.type === pet ? "border-blue-500 shadow-lg" : "border-gray-300"}`} onClick={() => setFormData({ ...formData, type: pet, pet_id: "" })}>
                                        <img src={`/${pet}.png`} alt={pet} className="w-20 h-20 object-cover mx-auto" />
                                        <p className="font-semibold mt-1">{pet === "dog" ? "Chó" : "Mèo"}</p>
                                    </button>
                                ))}
                            </div>
                        )}

                        <Link to={"/"} className="text-blue-500 block mt-2 hover:underline">Tạo hồ sơ thú cưng ở đây!</Link>
                    </div>
                    <div>
                        <Label className="font-medium text-gray-700">Chọn loại lịch hẹn <span className="text-red-500">*</span></Label>
                        <Select onValueChange={handleServiceChange}>
                            <SelectTrigger className="bg-white border-gray-300 rounded-lg">
                                <SelectValue placeholder="Chọn..." />
                            </SelectTrigger>
                            <SelectContent>
                                {service.map((item) => (
                                    <SelectItem key={item._id} value={item._id}>{item.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedService && selectedService.subServices.length > 0 && (
                            <div>
                                <Label>Chọn dịch vụ con <span className="text-red-500">*</span></Label>
                                <Select onValueChange={(value) => setFormData({ ...formData, subServiceId: value })} value={formData.subServiceId}>
                                    <SelectTrigger className="bg-white border-gray-300 rounded-lg">
                                        <SelectValue placeholder="Chọn dịch vụ con..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedService.subServices.map((sub) => (
                                            <SelectItem key={sub._id} value={sub._id}>
                                                {sub.name} ({sub.price[formData.type.toLocaleString()] ? `${sub.price[formData.type].toLocaleString()} VND` : "Giá không có sẵn"})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    {/* {selectedService && selectedService.subServices.length > 0 && (
                        <div>
                            <Label>Chọn dịch vụ con <span className="text-red-500">*</span></Label>
                            <Select onValueChange={(value) => setFormData({ ...formData, subServiceId: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn dịch vụ con..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedService.subServices.map((sub) => (
                                        <SelectItem key={sub._id} value={sub._id}>
                                            {sub.name} ({sub.price[formData.type] ? `${sub.price[formData.type]} VND` : "Giá không có sẵn"})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )} */}
                    <div className="col-span-2">
                        <Label className="font-medium text-gray-700">Ghi chú</Label>
                        <Textarea name="note" value={formData.note} onChange={handleChange} placeholder="Nhập thông tin bổ sung..." className="bg-white border-gray-300 rounded-lg" />
                    </div>
                </div>
                <DialogFooter className="mt-6">
                    <Button onClick={handleSubmit} className="w-full bg-[#3F2E2E] text-white py-3 text-lg font-semibold rounded-lg hover:bg-[#2c1f1f]">Xác nhận đặt lịch</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
