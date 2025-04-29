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
        expiry_date: ""
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
    const petTypes = ["Dog", "Cat"];

    // Gợi ý cho các ô input
    const typeExamples = "Kháng sinh, Thuốc giảm đau, Thuốc trị nấm, Thuốc trị ký sinh trùng, Vitamin";
    const unitExamples = "Viên, Ống, Gói, Lọ, Chai";

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
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Thêm thuốc mới</DialogTitle>
                    <DialogDescription>Nhập thông tin để thêm thuốc mới vào kho.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                        <Label htmlFor="name">Tên thuốc</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Tên thuốc"
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <Label htmlFor="type">Loại</Label>
                        <Input
                            id="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            title={typeExamples}
                            placeholder="Ví dụ: Kháng sinh, Thuốc giảm đau..."
                        />
                        {errors.type && <p className="text-red-500">{errors.type}</p>}
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            placeholder="Mô tả thuốc"
                            onChange={handleInputChange}
                        />
                        {errors.description && <p className="text-red-500">{errors.description}</p>}
                    </div>
                    <div>
                        <Label htmlFor="dosage">Liều lượng</Label>
                        <Input
                            id="dosage"
                            value={formData.dosage}
                            placeholder="Liều lượng thuốc"
                            onChange={handleInputChange}
                        />
                        {errors.dosage && <p className="text-red-500">{errors.dosage}</p>}
                    </div>
                    <div>
                        <Label htmlFor="manufacturer">Nhà sản xuất</Label>
                        <Input
                            id="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleInputChange}
                            title="Chỉ nhập chữ cái và khoảng trắng"
                            placeholder="Nhà sản xuất"
                        />
                        {errors.manufacturer && <p className="text-red-500">{errors.manufacturer}</p>}
                    </div>
                    <div>
                        <Label htmlFor="unit">Đơn vị</Label>
                        <Input
                            id="unit"
                            value={formData.unit}
                            onChange={handleInputChange}
                            title={unitExamples}
                            placeholder="Ví dụ: Viên, Ống, Gói, Lọ..."
                        />
                        {errors.unit && <p className="text-red-500">{errors.unit}</p>}
                    </div>
                    <div>
                        <Label htmlFor="price">Giá</Label>
                        <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            placeholder="Giá thuốc"
                            title="Chỉ nhập số"
                            onChange={handleInputChange}
                        />
                        {errors.price && <p className="text-red-500">{errors.price}</p>}
                    </div>
                    <div>
                        <Label htmlFor="expiry_date">Ngày hết hạn</Label>
                        <Input
                            id="expiry_date"
                            type="date"
                            value={formData.expiry_date}
                            title="Ngày hết hạn không thể là ngày trong quá khứ"
                            onChange={handleInputChange} />
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
                        {errors.images && <p className="text-red-500">{errors.images}</p>}
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