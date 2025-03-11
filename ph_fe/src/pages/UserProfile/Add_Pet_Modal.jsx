import { Button } from "@/components/ui/button";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PetService } from "@/services/PetService";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PetModal({ open, onOpenChange, onSuccess }) {
    const [formData, setFormData] = React.useState({
        type: "dog",
        name: "",
        gender: 1, // Mặc định là Đực
        species: "",
        weight: "",
        detail: ""
    });

    const [errors, setErrors] = React.useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenderChange = (value) => {
        setFormData({ ...formData, gender: parseInt(value) });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = "Vui lòng nhập tên thú cưng";
        if (!formData.species) newErrors.species = "Vui lòng nhập giống loài";
        if (!formData.weight) newErrors.weight = "Vui lòng nhập cân nặng";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        try {
            if (!validateForm()) return;

            const response = await PetService.createPetByUser(formData);
            onSuccess(response.pet);
            onOpenChange(false);
            toast.success("Thêm thú cưng thành công!");

        } catch (error) {
            toast.error("Thêm thú cưng thất bại!");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#FAF0D7] p-6 rounded-lg max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Thêm mới thú cưng</DialogTitle>
                </DialogHeader>
                <div>
                    {/* Lựa chọn loại thú cưng */}
                    <div className="col-span-2 flex items-center gap-4">
                        <Label className="flex items-center gap-2">
                            <input type="radio" name="type" value="dog" checked={formData.type === "dog"} onChange={handleChange} /> Chó
                        </Label>
                        <Label className="flex items-center gap-2">
                            <input type="radio" name="type" value="cat" checked={formData.type === "cat"} onChange={handleChange} /> Mèo
                        </Label>
                    </div>

                    {/* Form nhập thông tin */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {/* Tên thú cưng */}
                        <div className="col-span-1">
                            <Label htmlFor="name">Tên thú cưng</Label>
                            <Input type="text" id="name" name="name" placeholder="Tên" value={formData.name} onChange={handleChange} className="border p-2 rounded-md w-full" required />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Giống loài */}
                        <div className="col-span-1">
                            <Label htmlFor="species">Giống loài</Label>
                            <Input type="text" id="species" name="species" placeholder="Loại" value={formData.species} onChange={handleChange} className="border p-2 rounded-md w-full" required />
                            {errors.species && <p className="text-red-500 text-sm mt-1">{errors.species}</p>}
                        </div>

                        {/* Giới tính (Dropdown) */}
                        <div className="col-span-1">
                            <Label>Giới tính</Label>
                            <Select value={formData.gender.toString()} onValueChange={handleGenderChange}>
                                <SelectTrigger className="border p-2 rounded-md w-full">
                                    <SelectValue placeholder="Chọn giới tính" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Đực</SelectItem>
                                    <SelectItem value="0">Cái</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Cân nặng */}
                        <div className="col-span-1">
                            <Label htmlFor="weight">Cân nặng</Label>
                            <Input type="number" id="weight" name="weight" placeholder="Cân nặng" value={formData.weight} onChange={handleChange} className="border p-2 rounded-md w-full" required />
                            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                        </div>

                        {/* Chi tiết */}
                        <div className="col-span-2">
                            <Label htmlFor="detail">Chi tiết</Label>
                            <Input type="text" id="detail" name="detail" placeholder="Chi tiết" value={formData.detail} onChange={handleChange} className="border p-2 rounded-md w-full" required />
                        </div>
                    </div>
                </div>
                {/* Nút lưu ở cuối */}
                <div className="flex justify-end mt-4">
                    <Button className="bg-[#3F2E2E] text-white px-6 py-2 rounded-md" onClick={handleSubmit}>Lưu</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
