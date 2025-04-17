import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";

export default function Edit_Modal({ open, onClose, ServiceData, onUpdateService }) {
    const [serviceName, setServiceName] = useState("");
    const [serviceDescription, setServiceDescription] = useState("");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("");
    const [isAvailable, setIsAvailable] = useState("");
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");

    useEffect(() => {
        if (ServiceData && open) {
            setServiceName(ServiceData.name || "");
            setServiceDescription(ServiceData.description || "");
            setPrice(ServiceData.price?.toString() || "");
            setDuration(ServiceData.duration?.toString() || "");
            setIsAvailable(ServiceData.isAvailable?.toString() || "true");
            setPreviewImage(ServiceData.image || "");
        }
    }, [ServiceData, open]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
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
        if (image) {
            formData.append("image", image);
        }

        try {
            if (!ServiceData?.id) {
                throw new Error("Missing service ID");
            }

            const response = await axios.put(
                `http://localhost:9999/service/update/${ServiceData.id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            if (response.data.success) {
                alert("Cập nhật dịch vụ thành công!");
                onUpdateService({
                    id: response.data.service?._id,
                    image: response.data.service?.url,
                    name: response.data.service?.name,
                    description: response.data.service?.description,
                    price: response.data.service?.price,
                    duration: response.data.service?.duration,
                    isAvailable: response.data.service?.isAvailable
                });
                onClose();

            }
        } catch (error) {
            console.error("Lỗi khi cập nhật dịch vụ:", error);
            alert("Đã xảy ra lỗi, ơi.");
        }
    };
    <div>
        <label className="block text-sm font-medium mb-2 text-left">Hình ảnh dịch vụ</label>
        {previewImage && <img src={previewImage} alt="Preview" className="w-full h-40 object-cover mb-2" />}
        <Input type="file" accept="image/*" onChange={handleImageChange} />
    </div>
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-6 text-left">Cập nhật dịch vụ</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div>
                        <label className="block text-sm font-medium mb-2 text-left">Mô tả dịch vụ</label>
                        <Textarea placeholder="Mô tả dịch vụ của bạn" value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-left">Thời gian (phút)</label>
                            <Select value={duration} onValueChange={setDuration}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn thời gian" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {[5, 10, 15, 30, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240].map((time) => (
                                            <SelectItem key={time} value={time.toString()}>{time} phút</SelectItem>
                                        ))}
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
                                        <SelectItem value="true">Hoạt động</SelectItem>
                                        <SelectItem value="false">Vô hiệu</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-left">Hình ảnh dịch vụ</label>

                        <Input type="file" accept="image/*" onChange={handleImageChange} />
                        {previewImage && <img src={previewImage} alt="Preview" className="w-full h-40 object-cover mb-2" />}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <button type="button" onClick={onClose} className="text-red-500 underline">Hủy bỏ</button>
                        <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded">Cập nhật dịch vụ</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
