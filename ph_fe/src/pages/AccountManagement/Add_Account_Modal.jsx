import { useState, useEffect } from "react";
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
import axios from "axios";
import { UserService } from "@/services/UserService";
import { toast } from "sonner";

export default function CreateAccountDialog({ open, onOpenChange, onSuccess }) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        phone: "",
        roles: []
    });
    useEffect(() => {
        setFormData({ username: "", password: "", email: "", phone: "", roles: [] });
    }, [open]);

    const [errors, setErrors] = useState({});

    const roles = ["customer", "staff", "doctor", "admin"];

    // Map role để hiển thị tên đẹp hơn
    const roleLabels = {
        customer: "Customer",
        staff: "Staff",
        doctor: "Doctor",
        admin: "Admin"
    };

    const handleRoleChange = (role) => {
        setFormData((prevData) => ({
            ...prevData,
            roles: prevData.roles.includes(role)
                ? prevData.roles.filter((r) => r !== role)
                : [...prevData.roles, role]
        }));
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.username) newErrors.username = "Vui lòng nhập tên đăng nhập";
        if (!formData.email) newErrors.email = "Vui lòng nhập email";
        if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
        if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
        if (formData.roles.length === 0) newErrors.roles = "Vui lòng chọn ít nhất một vai trò";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const response = await UserService.createAccount({
                username: formData.username,
                password: formData.password,
                email: formData.email,
                phone: formData.phone,
                role: formData.roles
            });
            if (response.status === 201) {
                toast.success("Tạo tài khoản thành công!");
                onSuccess();
                onOpenChange(false);
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            console.error("Lỗi tạo tài khoản:", error.response?.data || error.message);
            toast.error(error.response?.data?.error || "Tạo tài khoản thất bại");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tạo tài khoản mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin để tạo tài khoản mới.
                    </DialogDescription>

                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Tên Người dùng
                        </Label>
                        <Input
                            id="username"
                            placeholder="Ví dụ: Hồng Minh"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                        {errors.username && <p className="text-red-500 col-span-4 text-right">{errors.username}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Ví dụ: user@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                        {errors.email && <p className="text-red-500 col-span-4 text-right">{errors.email}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Mật khẩu
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                        {errors.password && <p className="text-red-500 col-span-4 text-right">{errors.password}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Số điện thoại
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="Ví dụ: 0987654321"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                        {errors.phone && <p className="text-red-500 col-span-4 text-right">{errors.phone}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-left">Chọn vai trò</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {roles.map((role) => (
                                <div key={role} className="flex items-center gap-2">
                                    <Checkbox
                                        id={role}
                                        checked={formData.roles.includes(role)}
                                        onCheckedChange={() => handleRoleChange(role)}
                                    />
                                    <Label htmlFor={role}>{roleLabels[role]}</Label>
                                </div>
                            ))}
                        </div>
                        {errors.roles && <p className="text-red-500 text-left">{errors.roles}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>
                        Tạo tài khoản
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
