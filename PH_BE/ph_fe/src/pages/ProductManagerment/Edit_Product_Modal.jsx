import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MultiSelect from "@/components/multi-select";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductService } from "../../services/ProductService";
import { toast } from "sonner";
import { XIcon } from "lucide-react";



export default function EditProductDialog({ open, onClose, ProductData, onSuccess }) {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [type, setType] = useState([]);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await ProductService.getAllCategory();
                if (response.data.success) {
                    setCategories(
                        response.data.categories.map((category) => ({
                            value: category._id,
                            label: category.name,
                        }))
                    );
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
            }
        };

        fetchCategories();
    }, []);

    // Populate form with product data when modal opens
    // Populate form with product data when modal opens
    useEffect(() => {
        if (ProductData && open) {
            // Basic info
            setName(ProductData.name || "");
            setQuantity(ProductData.quantity || 0);
            setPrice(ProductData.price || 0);
            setDescription(ProductData.description || "");

            // Category
            // Tìm category trong danh sách categories dựa vào tên
            const category = categories.find(cat => cat.label === ProductData.category);
            if (category) {
                setSelectedCategory(category.value);
            }

            // Pet type
            if (ProductData.type) {
                setType(Array.isArray(ProductData.type) ? ProductData.type : [ProductData.type]);
            }

            // Images
            if (ProductData.imageUrl && Array.isArray(ProductData.imageUrl)) {
                setImages(ProductData.imageUrl);
            }
        }
    }, [ProductData, open, categories]);

    // Handle image upload
    const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    // Cập nhật hàm handleImageUpload
    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);

        // Kiểm tra số lượng ảnh
        if (files.length + images.length > 9) {
            toast.error("Bạn chỉ được tải tối đa 9 ảnh.");
            return;
        }

        // Validate từng file
        const invalidFiles = files.filter(
            file => !ACCEPTED_IMAGE_TYPES.includes(file.type)
        );

        // Kiểm tra kích thước file
        const oversizedFiles = files.filter(
            file => file.size > MAX_FILE_SIZE
        );

        // Thông báo lỗi nếu có file không hợp lệ
        if (invalidFiles.length > 0) {
            toast.error(
                "Chỉ chấp nhận file ảnh định dạng JPG, JPEG, PNG hoặc WEBP"
            );
            return;
        }

        // Thông báo lỗi nếu có file quá lớn
        if (oversizedFiles.length > 0) {
            toast.error(
                "Kích thước ảnh không được vượt quá 5MB"
            );
            return;
        }

        // Xử lý files hợp lệ
        const validFiles = files.filter(
            file =>
                ACCEPTED_IMAGE_TYPES.includes(file.type) &&
                file.size <= MAX_FILE_SIZE
        );

        // Thêm ảnh mới vào danh sách
        const newImages = validFiles.map((file) => ({
            url: URL.createObjectURL(file),
            file,
        }));

        setImages([...images, ...newImages]);
    };

    // Remove image
    const handleImageRemove = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // Submit form to update product
    const handleSubmit = async (event) => {
        event.preventDefault();
        let missingFields = [];

        if (!name) missingFields.push("Tên sản phẩm");
        if (!selectedCategory) missingFields.push("Danh mục");
        if (!description) missingFields.push("Mô tả sản phẩm");
        if (!type.length) missingFields.push("Loại sản phẩm (chó, mèo)");
        if (!images.length) missingFields.push("Hình ảnh (tối thiểu 1 ảnh)");
        if (!price || price < 0) missingFields.push("Giá phải lớn hơn 0");
        if (quantity === undefined || quantity < 0) missingFields.push("Số lượng phải lớn hơn hoặc bằng 0"); // Sửa lại điều kiện này

        if (missingFields.length > 0) {
            toast.error(`Vui lòng nhập: ${missingFields.join(", ")}`);
            return;
        }
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("quantity", quantity);
            formData.append("price", price);
            formData.append("description", description);
            formData.append("categoryId", selectedCategory);
            formData.append("type", JSON.stringify(type));

            // Xử lý ảnh
            images.forEach((image, index) => {
                if (image.file) {
                    // Nếu là ảnh mới
                    formData.append("images", image.file);
                } else {
                    // Nếu là ảnh cũ
                    formData.append(`existingImages[${index}]`, JSON.stringify({
                        url: image.url,
                        publicId: image.publicId
                    }));
                }
            });

            const response = await ProductService.updateProduct(ProductData.id, formData);

            if (response.data.success) {
                toast.success("Cập nhật sản phẩm thành công!");
                onSuccess?.(); // Refresh danh sách sản phẩm
                onClose(); // Đóng modal
            } else {
                toast.error("Cập nhật sản phẩm thất bại!");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-[900px] w-[90vw] h-auto max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-2xl font-bold text-center">Chỉnh sửa sản phẩm</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="py-4">
                    {/* Existing form fields */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="pName" className="block text-sm font-medium text-left mb-2">
                                Tên sản phẩm
                            </label>
                            <Input
                                type="text"
                                placeholder="Nhập tên sản phẩm"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-left mb-2">
                                Số lượng
                            </label>
                            <Input
                                type="number"
                                min={0}
                                placeholder="Nhập số lượng"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        {/* Name field remains the same */}

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-left mb-2">
                                Danh mục
                            </label>
                            <Select
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                                defaultValue={ProductData?.categoryId?.[0]?._id}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.value}
                                            value={category.value}
                                        >
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-left mb-2">
                                Giá tiền
                            </label>
                            <Input
                                type="number"
                                placeholder="Nhập giá tiền"
                                value={price}
                                min={0}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                required
                            />
                        </div>
                    </div>


                    {/* Other fields remain the same until pet type selection */}
                    <div className="grid grid-cols-3 gap-6 mb-6">
                        <div className="col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-left mb-2">
                                Mô tả về sản phẩm
                            </label>
                            <Textarea
                                placeholder="Hãy mô tả về sản phẩm của bạn"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="h-[150px]"
                            />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-left mb-2">
                                Loài động vật
                            </label>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="dog"
                                        checked={type.includes("Dog")}
                                        onCheckedChange={(checked) => {
                                            const newType = checked
                                                ? [...type, "Dog"]
                                                : type.filter(t => t !== "Dog");
                                            setType(newType);
                                        }}
                                    />
                                    <label htmlFor="dog">Chó</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="cat"
                                        checked={type.includes("Cat")}
                                        onCheckedChange={(checked) => {
                                            const newType = checked
                                                ? [...type, "Cat"]
                                                : type.filter(t => t !== "Cat");
                                            setType(newType);
                                        }}
                                    />
                                    <label htmlFor="cat">Mèo</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image upload section remains the same */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-left mb-2">Thêm ảnh (tối đa 9 ảnh)</label>
                        <Input type="file" multiple accept="image/*" onChange={handleImageUpload} />
                        <div className="grid grid-cols-9 gap-4 mt-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={image.url || URL.createObjectURL(image.file)}
                                        alt="Uploaded preview"
                                        className="w-32 h-32 object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex justify-center items-center"
                                        onClick={() => handleImageRemove(index)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>

                <DialogFooter className="border-t pt-4 flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="px-4 py-2"
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-primary text-white hover:bg-primary/90"
                    >
                        Cập nhật sản phẩm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}