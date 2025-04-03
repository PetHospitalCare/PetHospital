import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { MedicineService } from "@/services/MedicineService";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AddMedicineDialog({ open, onOpenChange, onSuccess }) {
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
    const [imageFiles, setImageFiles] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
    const petTypes = ["Dog", "Cat"];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handlePetTypeChange = (type) => {
        setFormData((prevData) => ({
            ...prevData,
            pet_type: prevData.pet_type.includes(type)
                ? prevData.pet_type.filter((t) => t !== type)
                : [...prevData.pet_type, type]
        }));
    };

    // Hành động thêm ảnh và kiểm tra validate
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 1 || imageFiles.length >= 1) {
            toast.error("Chỉ được tải lên tối đa 1 ảnh.");
            return;
        }
        setImageFiles(files);

        // Preview images
        const newImages = files.map((file) => URL.createObjectURL(file));
        setFormData(prev => ({
            ...prev,
            images: newImages
        }));
    };

    // Xoá ảnh
    const handleRemoveImage = () => {
        setFormData((prev) => ({
            ...prev,
            images: [],
        }));
        setImageFiles([]);
    };

    // Trường kiểm tra thông tin
    const validateForm = () => {
        let newErrors = {};
        const today = new Date().toISOString().split("T")[0]; // Lấy ngày hôm nay (YYYY-MM-DD)

        if (!formData.name) newErrors.name = "Vui lòng nhập tên thuốc";
        if (!formData.price) newErrors.price = "Vui lòng nhập giá thuốc";
        if (!formData.quantity) newErrors.quantity = "Vui lòng nhập số lượng";
        if (!formData.pet_type.length) newErrors.pet_type = "Vui lòng chọn ít nhất một loại thú cưng";
        if (!formData.expiry_date) {
            newErrors.expiry_date = "Vui lòng nhập ngày hết hạn";
        } else if (formData.expiry_date < today) {
            newErrors.expiry_date = "Ngày hết hạn không thể là ngày trong quá khứ";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Thực hiện add
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true); // Bắt đầu trạng thái loading
        const formDataToSend = new FormData();

        // Thêm các trường dữ liệu
        Object.keys(formData).forEach(key => {
            if (key === 'pet_type') {
                formDataToSend.append(key, JSON.stringify(formData[key]));
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });
        // Thêm file ảnh
        imageFiles.forEach(file => {
            formDataToSend.append('imageUrl', file);
        });

        try {
            await MedicineService.createMedicine(formDataToSend);
            toast.success("Thêm thuốc thành công!");
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Lỗi thêm thuốc:", error.response?.data || error.message);
            toast.error(error.response?.data?.error || "Thêm thuốc thất bại");
        } finally {
            setIsLoading(false); // Kết thúc trạng thái loading
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Thêm thuốc mới</DialogTitle>
                    <DialogDescription>Nhập thông tin để thêm thuốc mới vào kho.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                        <Label htmlFor="name">Tên thuốc</Label>
                        <Input id="name" value={formData.name} onChange={handleInputChange} />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <Label htmlFor="type">Loại</Label>
                        <Input id="type" value={formData.type} onChange={handleInputChange} />
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea id="description" value={formData.description} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="dosage">Liều lượng</Label>
                        <Input id="dosage" value={formData.dosage} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="manufacturer">Nhà sản xuất</Label>
                        <Input id="manufacturer" value={formData.manufacturer} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="unit">Đơn vị</Label>
                        <Input id="unit" value={formData.unit} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="price">Giá</Label>
                        <Input id="price" type="number" value={formData.price} onChange={handleInputChange} />
                        {errors.price && <p className="text-red-500">{errors.price}</p>}
                    </div>
                    <div>
                        <Label htmlFor="quantity">Số lượng</Label>
                        <Input id="quantity" type="number" value={formData.quantity} onChange={handleInputChange} />
                        {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
                    </div>
                    <div>
                        <Label htmlFor="expiry_date">Ngày hết hạn</Label>
                        <Input id="expiry_date" type="date" value={formData.expiry_date} onChange={handleInputChange} />
                        {errors.expiry_date && <p className="text-red-500">{errors.expiry_date}</p>}
                    </div>
                    <div>
                        <Label>Loại thú cưng</Label>
                        <div className="flex gap-4">
                            {petTypes.map((type) => (
                                <div key={type} className="flex items-center gap-2">
                                    <Checkbox
                                        id={type}
                                        checked={formData.pet_type.includes(type)}
                                        onCheckedChange={() => handlePetTypeChange(type)}
                                    />
                                    <Label htmlFor={type}>
                                        {type === "Dog" ? "Chó" : type === "Cat" ? "Mèo" : type}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {errors.pet_type && <p className="text-red-500">{errors.pet_type}</p>}
                    </div>
                    <div className="col-span-2">
                        <Label>Hình ảnh (Tối đa 1 ảnh)</Label>
                        <Input type="file" name="imageUrl" accept="image/*" onChange={handleImageChange} />
                        <div className="grid grid-cols-1 gap-2 mt-2">
                            {formData.images.map((img, index) => (
                                <div key={index} className="relative">
                                    <img src={img} alt="preview" className="w-full h-24 object-cover" />
                                    <Button size="icon" className="absolute top-1 right-1 bg-red-500" onClick={handleRemoveImage}>
                                        <Trash2 size={12} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Đang xử lý..." : "Thêm thuốc"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}