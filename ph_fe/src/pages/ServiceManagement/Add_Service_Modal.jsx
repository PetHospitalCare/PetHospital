import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";

export default function Add_Modal({ open, onClose }) {
    const [serviceName, setServiceName] = useState("");
    const [serviceDescription, setServiceDescription] = useState("");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("5");
    const [isAvailable, setIsAvailable] = useState("true"); // Mặc định là "true" (Còn trống)

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!serviceName || !serviceDescription || !price || !duration) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const formData = {
            name: serviceName,
            description: serviceDescription,
            price: parseFloat(price),
            duration: parseInt(duration, 10),
            isAvailable: isAvailable === "true",
        };

        try {
            const response = await axios.post("http://localhost:9999/service/create", formData);
            if (response.data.message === "Tạo dịch vụ thành công") {
                alert("Dịch vụ đã được thêm!");
                window.location.reload();
                onClose();
            }
        } catch (error) {
            console.error("Lỗi khi thêm dịch vụ:", error);
            alert("Đã xảy ra lỗi, vui lòng thử lại.");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-6 text-left">Thêm dịch vụ mới</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-left">Tên dịch vụ</label>
                        <Input type="text" placeholder="Nhập tên dịch vụ" value={serviceName} onChange={(e) => setServiceName(e.target.value)} required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-left">Giá tiền</label>
                        <Input type="number" placeholder="Nhập giá tiền" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-left">Mô tả dịch vụ</label>
                        <Textarea placeholder="Mô tả dịch vụ của bạn" value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} required />
                    </div>

                    {/* Thời gian */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-left">Thời gian (phút)</label>
                        <Select value={duration} onValueChange={setDuration}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn thời gian" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="5">5 phút</SelectItem>
                                    <SelectItem value="10">10 phút</SelectItem>
                                    <SelectItem value="15">15 phút</SelectItem>
                                    <SelectItem value="30">30 phút</SelectItem>
                                    <SelectItem value="60">1 giờ</SelectItem>
                                    <SelectItem value="75">1 giờ 15 phút</SelectItem>
                                    <SelectItem value="90">1 giờ 30 phút</SelectItem>
                                    <SelectItem value="105">1 giờ 45 phút</SelectItem>
                                    <SelectItem value="120">2 giờ</SelectItem>
                                    <SelectItem value="135">2 giờ 15 phút </SelectItem>
                                    <SelectItem value="150">2 giờ 30 phút</SelectItem>
                                    <SelectItem value="165">2 giờ 45 phút</SelectItem>
                                    <SelectItem value="180">3 giờ</SelectItem>
                                    <SelectItem value="195">3 giờ 15 phút</SelectItem>
                                    <SelectItem value="210">3 giờ 30 phút</SelectItem>
                                    <SelectItem value="225">3 giờ 45 phút</SelectItem>
                                    <SelectItem value="240">4 giờ</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-left">Trạng thái</label>
                        <Select value={isAvailable} onValueChange={setIsAvailable}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="true">Còn trống</SelectItem>
                                    <SelectItem value="false">Kín lịch</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <button type="button" onClick={onClose} className="text-red-500 underline">Hủy bỏ</button>
                        <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded">Thêm dịch vụ</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
