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
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { Services } from "@/services/Services";
import { toast } from "sonner";

export default function EditModal({ open, onClose, ServiceData, onUpdateService }) {
    const { id } = useParams();
    const [subServiceName, setSubServiceName] = useState("");
    const [price, setPrice] = useState({
        dog: 0,
        cat: 0
    });
    const [duration, setDuration] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (ServiceData && open) {
            setSubServiceName(ServiceData.name || "");
            setPrice({
                dog: ServiceData.price?.dog || 0,
                cat: ServiceData.price?.cat || 0
            });
            setDuration(ServiceData.duration?.toString() || "");
            setStatus(ServiceData.status || "");
        }
    }, [ServiceData, open]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!subServiceName || !price.dog || !price.cat) {
            toast.error("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const updateData = {
            name: subServiceName,
            price: {
                dog: parseFloat(price.dog),
                cat: parseFloat(price.cat)
            },
            duration: parseInt(duration, 10),
            status: status
        };

        try {
            if (!ServiceData?._id) {
                throw new Error("Missing service or sub-service ID");
            }
            const response = await Services.EditSubService(id, ServiceData._id, updateData);
            // const response = await axios.put(
            //     `http://localhost:9999/service/${id}/sub-service/${ServiceData._id}`,
            //     updateData
            // );

            if (response.data.success) {
                toast.success("Cập nhật dịch vụ thành công!");
                onUpdateService();
                onClose();
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật dịch vụ con:", error);
            toast.error("Cập nhật dịch vụ thất bại!");
        }
    };

    if (!open) return null;
    const handlePriceChange = (e, type) => {
        const value = e.target.value;
        // Giới hạn độ dài số là 9 chữ số
        if (value.length <= 9) {
            setPrice(prev => ({
                ...prev,
                [type]: value
            }));
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-6 text-left">Cập nhật dịch vụ con</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-left">Tên dịch vụ con</label>
                        <Input type="text" placeholder="Nhập tên dịch vụ con" value={subServiceName} onChange={(e) => setSubServiceName(e.target.value)} required />
                    </div>
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-left">Giá tiền theo loại</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">🐕</span>
                                </div>
                                <Input
                                    type="number"
                                    placeholder="Giá cho chó"
                                    value={price?.dog.toLocaleString("vi-VN")}
                                    onChange={(e) => handlePriceChange(e, "dog")}
                                    className="pl-9 pr-16"
                                    min="0"
                                    max="999999999"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">VNĐ</span>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">🐱</span>
                                </div>
                                <Input
                                    type="number"
                                    placeholder="Giá cho mèo"
                                    value={price?.cat.toLocaleString("vi-VN")}
                                    onChange={(e) => handlePriceChange(e, "cat")}
                                    className="pl-9 pr-16"
                                    min="0"
                                    max="999999999"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">VNĐ</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 italic flex items-center gap-2">
                            <span>⚠️</span>
                            <span>Giá đã bao gồm VAT và có thể thay đổi tùy theo tình trạng thú cưng</span>
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-left">Trạng thái</label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="active">Hoạt động</SelectItem>
                                    <SelectItem value="inactive">Vô hiệu</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <Button type="button" onClick={onClose} className="text-red-500 underline">Hủy bỏ</Button>
                        <Button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded">Cập nhật</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
