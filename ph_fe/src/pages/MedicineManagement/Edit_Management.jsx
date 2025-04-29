import React, { useEffect, useState } from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MedicineService } from "@/services/MedicineService";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SheetDemo({ open, onOpenChange, medicine, onsuccess }) {
    const petTypes = ["Dog", "Cat"];
    // Gợi ý cho các ô input
    const typeExamples = "Kháng sinh, Thuốc giảm đau, Thuốc trị nấm, Thuốc trị ký sinh trùng, Vitamin";
    const unitExamples = "Viên, Ống, Gói, Lọ, Chai";

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
        expiry_date: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

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
                    : "",
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
        const files = Array.from(e.target.files);
        if (files.length > 1 || formData.images.length >= 1) {
            toast.error("Chỉ được tải lên tối đa 1 ảnh.");
            return;
        }
        const newImages = files.map((file) => ({ url: URL.createObjectURL(file), file }));
        setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({
            ...prev,
            images: [],
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        const today = new Date().toISOString().split("T")[0]; // Lấy ngày hôm nay (YYYY-MM-DD)

        // Regex patterns
        const lettersAndSpacesOnly = /^[A-Za-zÀ-ỹ\s]+$/; // Chỉ chấp nhận chữ cái và khoảng trắng (bao gồm tiếng Việt)

        if (!formData.name) newErrors.name = "Vui lòng nhập tên thuốc";
        if (!formData.description) newErrors.description = "Vui lòng nhập mô tả";
        if (!formData.dosage) newErrors.dosage = "Vui lòng nhập liều lượng";

        if (!formData.unit) {
            newErrors.unit = "Vui lòng nhập đơn vị";
        } else if (!lettersAndSpacesOnly.test(formData.unit)) {
            newErrors.unit = "Đơn vị không được chứa số hoặc ký tự đặc biệt";
        }

        if (!formData.manufacturer) {
            newErrors.manufacturer = "Vui lòng nhập nhà sản xuất";
        } else if (!lettersAndSpacesOnly.test(formData.manufacturer)) {
            newErrors.manufacturer = "Nhà sản xuất không được chứa số hoặc ký tự đặc biệt";
        }

        if (!formData.type) newErrors.type = "Vui lòng nhập loại thuốc";
        if (!formData.price && formData.price !== 0) {
            newErrors.price = "Vui lòng nhập giá thuốc";
        } else if (formData.price <= 0) {
            newErrors.price = "Giá thuốc phải lớn hơn 0";
        }
        if (!formData.pet_type.length) newErrors.pet_type = "Vui lòng chọn ít nhất một loại thú cưng";
        if (!formData.expiry_date) {
            newErrors.expiry_date = "Vui lòng nhập ngày hết hạn";
        } else if (formData.expiry_date < today) {
            newErrors.expiry_date = "Ngày hết hạn không thể là ngày trong quá khứ";
        }
        if (!formData.images.length) {
            newErrors.images = "Vui lòng tải lên ít nhất một ảnh";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true); // Bắt đầu trạng thái loading
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("type", formData.type);
        formDataToSend.append("dosage", formData.dosage);
        formDataToSend.append("manufacturer", formData.manufacturer);
        formDataToSend.append("unit", formData.unit);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("expiry_date", formData.expiry_date);

        formData.pet_type.forEach((type) => {
            formDataToSend.append("pet_type[]", type);
        });

        formData.images.forEach((image) => {
            if (image.file) {
                formDataToSend.append("imageUrl", image.file);
            } else {
                formDataToSend.append("existingImages[]", image.url);
            }
        });

        try {
            await MedicineService.updateMedicine(medicine._id, formDataToSend);
            toast.success("Cập nhật thành công");
            onsuccess?.();
            onOpenChange(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật thuốc:", error);
            toast.error("Cập nhật thất bại");
        } finally {
            setIsLoading(false); // Kết thúc trạng thái loading
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
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Nhập tên thuốc"
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                        <Label htmlFor="description">Mô tả</Label>
                        <Input
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Nhập mô tả thuốc"
                            title="Mô tả thuốc"
                        />
                        {errors.description && <p className="text-red-500">{errors.description}</p>}
                        <Label htmlFor="type">Loại</Label>
                        <Input
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            title={typeExamples}
                            placeholder="Ví dụ: Kháng sinh, Thuốc giảm đau..."
                        />
                        {errors.type && <p className="text-red-500">{errors.type}</p>}
                        <Label htmlFor="dosage">Liều lượng</Label>
                        <Input
                            id="dosage"
                            name="dosage"
                            value={formData.dosage}
                            onChange={handleInputChange}
                            placeholder="Nhập liều lượng thuốc"
                        />
                        {errors.dosage && <p className="text-red-500">{errors.dosage}</p>}
                        <Label htmlFor="manufacturer">Nhà sản xuất</Label>
                        <Input
                            id="manufacturer"
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleInputChange}
                            title="Chỉ nhập chữ cái và khoảng trắng"
                        />
                        {errors.manufacturer && <p className="text-red-500">{errors.manufacturer}</p>}
                    </div>
                    <div>
                        <Label htmlFor="unit">Đơn vị</Label>
                        <Input
                            id="unit"
                            name="unit"
                            value={formData.unit}
                            onChange={handleInputChange}
                            title={unitExamples}
                            placeholder="Ví dụ: Viên, Ống, Gói, Lọ..."
                        />
                        {errors.unit && <p className="text-red-500">{errors.unit}</p>}
                        <Label htmlFor="price">Giá</Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Nhập giá thuốc"
                            title="Giá thuốc không được âm"
                        />
                        {errors.price && <p className="text-red-500">{errors.price}</p>}
                        <Label htmlFor="expiry_date">Ngày hết hạn</Label>
                        <Input id="expiry_date" name="expiry_date" type="date" value={formData.expiry_date} onChange={handleInputChange} />
                        {errors.expiry_date && <p className="text-red-500">{errors.expiry_date}</p>}
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
                        {errors.pet_type && <p className="text-red-500">{errors.pet_type}</p>}
                    </div>
                </div>
                <Label>Hình ảnh (Tối đa 1 ảnh)</Label>
                <div className="grid grid-cols-1 gap-2">
                    {formData.images.map((image, index) => (
                        <div key={index} className="relative w-32 h-32"> {/* tăng kích thước khung ảnh */}
                            <img
                                src={image.url}
                                alt="Medicine"
                                className="w-full h-full object-cover rounded-md"
                            />
                            <Button
                                size="icon"
                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600"
                                onClick={() => handleRemoveImage(index)} // nhớ truyền index nếu cần xóa đúng ảnh
                            >
                                <Trash2 size={16} /> {/* tăng size icon nếu muốn */}
                            </Button>
                        </div>
                    ))}
                </div>
                {formData.images.length < 1 && (
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                )}
                {errors.images && <p className="text-red-500">{errors.images}</p>}
                <SheetFooter>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}