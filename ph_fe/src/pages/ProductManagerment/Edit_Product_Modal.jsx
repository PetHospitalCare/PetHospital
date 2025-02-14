import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import MultiSelect from "@/components/multi-select";
import { Dog, Cat } from "lucide-react"

import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/Combobox";

const frameworksList = [
    { value: "Dog", label: "Chó", icon: Dog },
    { value: "Cat", label: "Mèo", icon: Cat },
];

export default function Edit_Modal({ open, onClose, ProductData }) {
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
                const response = await axios.get("http://localhost:9999/category/get-all");
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
    useEffect(() => {
        if (ProductData && open) {
            setName(ProductData.name || "");
            setQuantity(ProductData.quantity || 0);
            setPrice(ProductData.price || 0);
            setDescription(ProductData.description || "");

            // Handle category selection
            setSelectedCategory(categories.find(cat => cat.label === ProductData.category)?.value);

            // Handle type selection - ensure it works with MultiSelect
            // If type is a string, convert to array, if it's already an array, use it

            //setType(Array.isArray(ProductData.type) ? ProductData.type : [ProductData.type]);


            const typeValue = Array.isArray(ProductData.type)
                ? ProductData.type
                : ProductData.type ? [ProductData.type] : [];
            setType(typeValue);
            console.log("Set type from product data:", typeValue);  // Kiểm tra giá trị đã được set
            console.log(frameworksList.filter(item => typeValue.includes(item.value)));


            // Reset images and prepare for potential image editing
            setImages(ProductData.imageUrl);
            console.log(ProductData)
        }
    }, [ProductData, open]);

    // Create new category
    const handleCreateCategory = (label) => {
        if (label.trim() !== "") {
            const temporaryCategory = {
                value: `temp-${Date.now()}`,
                label: label.trim(),
                isTemporary: true,
            };
            setCategories([...categories, temporaryCategory]);
            setSelectedCategory(temporaryCategory.value);
        } else {
            alert("Vui lòng nhập tên danh mục.");
        }
    };

    // Handle image upload
    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length + images.length > 9) {
            alert("Bạn chỉ được tải tối đa 9 ảnh.");
            return;
        }
        setImages([...images, ...files]);
    };

    // Remove image
    const handleImageRemove = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // Submit form to update product
    const handleSubmit = async (event) => {

    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl">
                <h2 className="text-xl font-bold mb-6 text-left">Chỉnh sửa sản phẩm</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="pName" className="block text-sm font-medium text-left mb-2">Tên sản phẩm</label>
                            <Input
                                type="text"
                                placeholder="Nhập tên sản phẩm"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-left mb-2">Số lượng</label>
                            <Input
                                type="number"
                                placeholder="Nhập số lượng"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-left mb-2">Giá tiền</label>
                            <Input
                                type="number"
                                placeholder="Nhập giá tiền"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-left mb-2">Danh mục</label>
                            <Combobox
                                options={categories}
                                selected={selectedCategory}
                                placeholder="Chọn danh mục"
                                onChange={(selected) => {
                                    setSelectedCategory(selected.value);
                                    console.log(selected.value)
                                }}
                                onCreate={(label) => handleCreateCategory(label)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-left mb-2">Mô tả về sản phẩm</label>
                            <Textarea
                                placeholder="Hãy mô tả về sản phẩm của bạn"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-left mb-2">Loài động vật</label>
                            <MultiSelect
                                className="text-gray-400"
                                options={frameworksList}
                                onValueChange={(selected) => {
                                    console.log("Selected types:", selected);
                                    setType(selected);
                                }}
                                value={type}
                                placeholder="Chọn loài động vật"
                                variant="inverted"
                                animation={2}
                                maxCount={2}
                            />


                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-left mb-2">Thêm ảnh (tối đa 9 ảnh)</label>
                        <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <div className="grid grid-cols-9 gap-4 mt-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={image.url ? image.url : URL.createObjectURL(image)}
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

                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-red-500 underline"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-3 rounded"
                        >
                            Cập nhật sản phẩm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}