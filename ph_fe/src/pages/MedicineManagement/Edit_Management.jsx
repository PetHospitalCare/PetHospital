import React, { useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MedicineService } from "@/services/MedicineService";
import { Trash2 } from "lucide-react";

export default function SheetDemo({ open, onOpenChange, medicine, onsuccess }) {
    const petTypes = ["Dog", "Cat"];
    const [formData, setFormData] = useState({
        name: "",
        images: [],
        description: "",
        type: "",
        pet_type: [],
        dosage: "",
        manufacturer: "",
        unit: "",
        price: "",
        quantity: "",
        expiry_date: ""
    });

    useEffect(() => {
        if (medicine) {
            setFormData({
                name: medicine.name || "",
                images: medicine.images || [],
                description: medicine.description || "",
                type: medicine.type || "",
                pet_type: medicine.pet_type || [],
                dosage: medicine.dosage || "",
                manufacturer: medicine.manufacturer || "",
                unit: medicine.unit || "",
                price: medicine.price || "",
                quantity: medicine.quantity || "",
                expiry_date: medicine.expiry_date
                    ? new Date(medicine.expiry_date).toISOString().split("T")[0]
                    : ""
            });
        }
    }, [medicine]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePetTypeChange = (type) => {
        setFormData((prev) => ({
            ...prev,
            pet_type: prev.pet_type.includes(type)
                ? prev.pet_type.filter((t) => t !== type)
                : [...prev.pet_type, type],
        }));
    };

    const handleImageChange = (e) => {
        if (formData.images.length >= 9) return;
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({ url: URL.createObjectURL(file), file }));
        setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
    };

    const handleRemoveImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("type", formData.type);
            formDataToSend.append("dosage", formData.dosage);
            formDataToSend.append("manufacturer", formData.manufacturer);
            formDataToSend.append("unit", formData.unit);
            formDataToSend.append("price", formData.price);
            formDataToSend.append("quantity", formData.quantity);
            formDataToSend.append("expiry_date", formData.expiry_date);

            formData.pet_type.forEach((type) => {
                formDataToSend.append("pet_type[]", type);
            });

            // Gửi danh sách ảnh cũ lên để BE biết ảnh nào cần giữ
            formData.images.forEach((image, index) => {
                if (image.file) {
                    formDataToSend.append("imageUrl", image.file);
                } else {
                    formDataToSend.append(`existingImages[${index}][url]`, image.url);
                    formDataToSend.append(`existingImages[${index}][publicId]`, image.publicId || "");
                }
            });

            const response = await MedicineService.updateMedicine(medicine._id, formDataToSend);
            alert("Cập nhật thành công");
            onsuccess?.();
            onOpenChange(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật thuốc:", error);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Chỉnh sửa thuốc</SheetTitle>
                    <SheetDescription>
                        Cập nhật thông tin thuốc. Nhấn lưu khi hoàn tất.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                        <Label htmlFor="name">Tên thuốc</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                        <Label htmlFor="description">Mô tả</Label>
                        <Input id="description" name="description" value={formData.description} onChange={handleInputChange} />
                        <Label htmlFor="type">Loại</Label>
                        <Input id="type" name="type" value={formData.type} onChange={handleInputChange} />
                        <Label htmlFor="dosage">Liều lượng</Label>
                        <Input id="dosage" name="dosage" value={formData.dosage} onChange={handleInputChange} />
                        <Label htmlFor="manufacturer">Nhà sản xuất</Label>
                        <Input id="manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="unit">Đơn vị</Label>
                        <Input id="unit" name="unit" value={formData.unit} onChange={handleInputChange} />
                        <Label htmlFor="price">Giá</Label>
                        <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} />
                        <Label htmlFor="quantity">Số lượng</Label>
                        <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} />
                        <Label htmlFor="expiry_date">Ngày hết hạn</Label>
                        <Input id="expiry_date" name="expiry_date" type="date" value={formData.expiry_date} onChange={handleInputChange} />
                        <Label>Loại thú cưng</Label>
                        <div className="flex gap-4">
                            {petTypes.map((type) => (
                                <div key={type} className="flex items-center gap-2">
                                    <Checkbox id={type} checked={formData.pet_type.includes(type)} onCheckedChange={() => handlePetTypeChange(type)} />
                                    <Label htmlFor={type}>
                                        {type === "Dog" ? "Chó" : type === "Cat" ? "Mèo" : type}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Label>Hình ảnh</Label>
                <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                            <img src={image.url} alt="Medicine" className="w-full h-24 object-cover rounded-md" />
                            <Button size="icon" className="absolute top-1 right-1 bg-red-500" onClick={() => handleRemoveImage(index)}>
                                <Trash2 size={12} />
                            </Button>
                        </div>
                    ))}
                </div>
                {formData.images.length < 9 && (
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                )}
                <SheetFooter>
                    <SheetClose asChild>
                        <Button onClick={handleSubmit}>Lưu thay đổi</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}