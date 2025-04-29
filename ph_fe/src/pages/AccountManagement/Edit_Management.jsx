import React, { useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pen } from "lucide-react";
import axios from "axios";
import { UserService } from "@/services/UserService";
import { toast } from "sonner";
export default function SheetDemo({ open, onOpenChange, account, onsuccess }) {
    const roles = ["staff", "admin", "doctor"];
    const [formData, setFormData] = useState({ username: "", email: "", phone: "", role: [] });

    useEffect(() => {
        if (account) {
            setFormData({
                username: account.username || "",
                email: account.email || "",
                phone: account.phone || "",
                role: account.role || [],
            });
        }
    }, [account]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (role) => {
        setFormData((prev) => ({
            ...prev,
            role: prev.role.includes(role)
                ? prev.role.filter((r) => r !== role)
                : [...prev.role, role],
        }));
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
            if (response.status === 200) {
                toast.success("Cập nhật tài khoản thành công!");
                onsuccess();
                onOpenChange(false);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật tài khoản:", error);
            toast.error("Có lỗi xảy ra khi cập nhật tài khoản");
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Chỉnh sửa tài khoản</SheetTitle>
                    <SheetDescription>
                        Cập nhật thông tin tài khoản của bạn. Nhấn lưu khi hoàn tất.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Tên người dùng
                        </Label>
                        <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="col-span-3"
                            disabled
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Số điện thoại
                        </Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Vai trò</Label>
                        <div className="col-span-3">
                            {roles.map((role) => (
                                <div key={role} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={role}
                                        checked={formData.role.includes(role)}
                                        onChange={() => handleRoleChange(role)}
                                    />
                                    <Label htmlFor={role}>{role}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button onClick={handleSubmit}>Lưu thay đổi</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
