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
import { Label } from "@/components/ui/label"
import { useEffect } from "react";
export default function Add_Modal({ open, onClose, onAddService = () => { } }) {
    const [serviceName, setServiceName] = useState("");
    const [serviceDescription, setServiceDescription] = useState("");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("5");
    const [isAvailable, setIsAvailable] = useState("true");
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!serviceName || !serviceDescription || !price || !duration) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const formData = new FormData();
        formData.append("name", serviceName);
        formData.append("description", serviceDescription);
        formData.append("price", parseFloat(price));
        formData.append("duration", parseInt(duration, 10));
        formData.append("isAvailable", isAvailable === "true");

        if (selectedFile) { formData.append("image", selectedFile); }

        try {
            const response = await axios.post("http://localhost:9999/service/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.message === "Tạo dịch vụ thành công") {
                alert("Dịch vụ đã được thêm!");
                onAddService({
                    id: response.data.Service?._id,
                    image: response.data.Service?.url,
                    name: response.data.Service?.name,
                    description: response.data.Service?.description,
                    price: response.data.Service?.price,
                    duration: response.data.Service?.duration,
                    isAvailable: response.data.Service?.isAvailable
                });
                handleClose();
            }
        } catch (error) {
            console.error("Lỗi khi thêm dịch vụ:", error);
            alert("Đã xảy ra lỗi, vui lòng thử lại.");
        }
    };

    const handleClose = () => {
        setServiceName("");
        setPrice("");
        setServiceDescription("");
        setDuration("5");
        setIsAvailable("true");
        setImagePreview(null);
        setSelectedFile(null);
        onClose();
    };
    useEffect(() => {
        if (open) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [open]);


    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl flex flex-col overflow-y-scroll max-h-[80vh]">


                <h2 className="text-xl font-bold mb-6 text-left">Thêm dịch vụ mới</h2>


                <div className="overflow-y-auto flex-grow pr-2" style={{ maxHeight: "60vh" }}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Tên dịch vụ & Giá tiền */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-left">Tên dịch vụ</label>
                                <Input type="text" placeholder="Nhập tên dịch vụ" value={serviceName} onChange={(e) => setServiceName(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-left">Giá tiền</label>
                                <Input type="number" placeholder="Nhập giá tiền" value={price} onChange={(e) => setPrice(e.target.value)} required />
                            </div>
                        </div>



                        {/* Thời gian & Trạng thái */}
                        <div className="grid grid-cols-2 gap-4">
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
                                            <SelectItem value="120">2 giờ</SelectItem>
                                            <SelectItem value="180">3 giờ</SelectItem>
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
                        </div>
                        {/* Mô tả */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-left">Mô tả dịch vụ</label>
                            <Textarea placeholder="Mô tả dịch vụ của bạn" value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} required />
                        </div>

                        {/* Hình ảnh */}
                        <div className="grid w-full max-w-sm items-center gap-2">
                            <Label htmlFor="picture">Hình ảnh</Label>
                            <Input id="picture" type="file" onChange={handleFileChange} />
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="mt-2 w-full rounded-lg shadow" />
                            )}
                        </div>
                    </form>
                </div>

                {/* Nút hành động cố định */}
                <div className="flex justify-between items-center mt-4 border-t pt-4">
                    <button type="button" onClick={handleClose} className="text-red-500 underline">
                        Hủy bỏ
                    </button>
                    <button type="submit" onClick={handleSubmit} className="bg-blue-500 text-white px-6 py-3 rounded">Thêm dịch vụ</button>
                </div>
            </div>
        </div>

    );
}
