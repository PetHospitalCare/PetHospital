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

export default function EditModal({ open, onClose, ServiceData, onUpdateService }) {
    const { id } = useParams();
    const [subServiceName, setSubServiceName] = useState("");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (ServiceData && open) {
            setSubServiceName(ServiceData.name || "");
            setPrice(ServiceData.price);
            setDuration(ServiceData.duration?.toString() || "");
            setStatus(ServiceData.status?.toString() || "");
        }
        console.log(ServiceData);
    }, [ServiceData, open]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!subServiceName || !price || !duration) {
            alert("Vui lòng nhập đầy đủ thông tin.");
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
            console.log("test: ", updateData)
            const response = await axios.put(
                `http://localhost:9999/service/${id}/sub-service/${ServiceData._id}`,
                updateData
            );

            if (response.data.success) {
                alert("Cập nhật dịch vụ con thành công!");
                onUpdateService();
                onClose();
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật dịch vụ con:", error);
            alert("Đã xảy ra lỗi, vui lòng thử lại.");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-6 text-left">Cập nhật dịch vụ con</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-left">Tên dịch vụ con</label>
                        <Input type="text" placeholder="Nhập tên dịch vụ con" value={subServiceName} onChange={(e) => setSubServiceName(e.target.value)} required />
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-2 text-left">Giá tiền (Chó)</label>
                            <Input type="number" placeholder="Nhập giá cho chó" value={price.dog} onChange={(e) => handlePriceChange(e, "dog")} required />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-2 text-left">Giá tiền (Mèo)</label>
                            <Input type="number" placeholder="Nhập giá cho mèo" value={price.cat} onChange={(e) => handlePriceChange(e, "cat")} required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-left">Thời gian (phút)</label>
                        <Select value={duration} onValueChange={setDuration}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn thời gian" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {[5, 10, 15, 30, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((time) => (
                                        <SelectItem key={time} value={time.toString()}>{time} phút</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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
