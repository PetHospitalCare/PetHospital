
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

const frameworksList = [
    { value: "Dog", label: "Chó", icon: Dog },
    { value: "Cat", label: "Mèo", icon: Cat },
];

export default function Add_Modal({ open, onClose }) {
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [type, setType] = useState([]);

    // Fetch categories from the backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:9999/category/get-all");
                if (response.data.success) {
                    const formattedData = response.data.categories.map((category) => ({
                        id: category._id,
                        name: category.name,
                    }));
                    setCategories(formattedData);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length + images.length > 9) {
            alert("Bạn chỉ được tải tối đa 9 ảnh.");
            return;
        }
        setImages([...images, ...files]);
    };

    const handleImageRemove = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!productName || !selectedCategory || !productDescription || !type.length || !images.length) {
            alert("Vui lòng nhập đầy đủ thông tin và tải lên ít nhất một ảnh.");
            return;
        }

        const formData = new FormData();
        formData.append("name", productName);
        images.forEach((image) => formData.append("imageUrl", image));
        formData.append("description", productDescription);
        formData.append("price", price);
        formData.append("quantity", quantity);
        formData.append("categoryId", selectedCategory);
        formData.append("type", JSON.stringify(type));


        try {
            const response = await axios.post("http://localhost:9999/product/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.data.message === "Tạo sản phẩm thành công") {
                alert("Sản phẩm đã được thêm!");
                window.location.reload()
                onClose();
            }
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            alert("Đã xảy ra lỗi, vui lòng thử lại.");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl">
                <h2 className="text-xl font-bold mb-6 text-left">Thêm sản phẩm mới</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="pName" className="block text-sm font-medium text-left mb-2">Tên sản phẩm</label>
                            <Input type="text" placeholder="Nhập tên sản phẩm" value={productName} onChange={(e) => setProductName(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-left mb-2">Số lượng</label>
                            <Input type="number" placeholder="Nhập số lượng" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-left mb-2">Giá tiền</label>
                            <Input type="number" placeholder="Nhập giá tiền" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-left mb-2">Danh mục</label>
                            <Select onValueChange={(value) => setSelectedCategory(value)}>
                                <SelectTrigger className="w-2xl">
                                    <SelectValue placeholder="Chọn danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Danh mục</SelectLabel>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="pName" className="block text-sm font-medium text-left mb-2">Mô tả về sản phẩm</label>
                            <Textarea placeholder="Hãy mô tả về sản phẩm của bạn" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-left mb-2">Loài động vật</label>
                            <MultiSelect
                                options={frameworksList}
                                onValueChange={(selected) => setType(selected)}
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
                        <Input type="file" multiple accept="image/*" onChange={handleImageUpload} />
                        <div className="grid grid-cols-9 gap-4 mt-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative">
                                    <img src={URL.createObjectURL(image)} alt="Uploaded preview" className="w-32 h-32 object-cover rounded-md" />
                                    <button type="button" className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex justify-center items-center" onClick={() => handleImageRemove(index)}>
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <button type="button" onClick={onClose} className="text-red-500 underline">Hủy bỏ</button>
                        <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded">Thêm sản phẩm</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
