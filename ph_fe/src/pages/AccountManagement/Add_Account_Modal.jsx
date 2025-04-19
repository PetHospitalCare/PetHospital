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

    const roles = ["staff", "doctor", "admin"];

    // Map role để hiển thị tên đẹp hơn
    const roleLabels = {

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



    const handleSubmit = async () => {
        // Kiểm tra các trường bắt buộc
        if (!formData.username.trim()) {
            toast.error("Vui lòng nhập tên người dùng");
            return;
        }

        if (!formData.phone.trim()) {
            toast.error("Vui lòng nhập số điện thoại");
            return;
        }

        // Kiểm tra định dạng số điện thoại
        if (!/^[0-9]{10}$/.test(formData.phone)) {
            toast.error("Số điện thoại phải có 10 chữ số");
            return;
        }

        // Kiểm tra role
        if (formData.role.length === 0) {
            toast.error("Vui lòng chọn ít nhất một vai trò");
            return;
        }

        try {
            const response = await UserService.updateAccount(account._id, formData);
            toast.success("Cập nhật tài khoản thành công!");
            onsuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật tài khoản:", error);
            toast.error("Có lỗi xảy ra khi cập nhật tài khoản");
        }
    }

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

                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email hoặc account
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Ví dụ: user@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />

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

                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Số điện thoại
                        </Label>
                        <Input
                            id="phone"
                            type="number"
                            placeholder="Ví dụ: 0987654321"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />

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
