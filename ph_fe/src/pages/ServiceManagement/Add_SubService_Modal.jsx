import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useParams } from "react-router-dom";
import { Services } from "../../services/Services";

export default function Add_Modal({ open, onClose, onAddService = () => { } }) {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [price, setPrice] = useState({ dog: "", cat: "" });
    const [duration, setDuration] = useState("5");
    const [status, setStatus] = useState("active");

    const handlePriceChange = (e, type) => {
        setPrice((prev) => ({
            ...prev,
            [type]: e.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name || !price.dog || !price.cat || !duration) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        try {
            const response = await Services.CreateNewSubService(id, {
                name,
                price: {
                    dog: parseFloat(price.dog),
                    cat: parseFloat(price.cat)
                },
                duration: parseInt(duration, 10),
                status,
            });

            if (response.data.message === "Subservice added successfully") {
                alert("Dịch vụ con đã được thêm!");
                onAddService();
                handleClose();
            }
        } catch (error) {
            console.error("Lỗi khi thêm dịch vụ con:", error);
            alert("Đã xảy ra lỗi, vui lòng thử lại.");
        }
    };

    const handleClose = () => {
        setName("");
        setPrice({ dog: "", cat: "" });
        setDuration("5");
        setStatus("active");
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
                <h2 className="text-xl font-bold mb-6 text-left">Thêm dịch vụ con mới</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-left">Tên dịch vụ</label>
                        <Input type="text" placeholder="Nhập tên dịch vụ" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>



                    {/* Giá tiền section - UI được cải thiện */}
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
                                    value={price.dog.toLocaleString("vi-VN")}
                                    onChange={(e) => handlePriceChange(e, "dog")}
                                    className="pl-9"
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
                                    value={price.cat.toLocaleString("vi-VN")}
                                    onChange={(e) => handlePriceChange(e, "cat")}
                                    className="pl-9"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">VNĐ</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 italic">
                            * Giá đã bao gồm VAT và có thể thay đổi tùy theo tình trạng thú cưng
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
                                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-between items-center mt-4 border-t pt-4">
                        <button type="button" onClick={handleClose} className="text-red-500 underline">
                            Hủy bỏ
                        </button>
                        <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded">
                            Thêm dịch vụ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
