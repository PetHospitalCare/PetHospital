import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserService } from "@/services/UserService";

export default function ResetPassword() {
    const [currentPassword, setCurrentPassword] = useState(""); // NEW
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmCurrentPassword, setConfirmCurrentPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const isChangePassword = location.pathname === "/change-password";

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError(e.target.value !== newPassword ? "Mật khẩu xác nhận không khớp" : "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let response;
            if (isChangePassword) {
                // Đổi mật khẩu
                response = await UserService.changePassword({
                    currentPassword,
                    newPassword
                });
            } else {
                // Quên mật khẩu
                response = await UserService.resetPassword({
                    email: location.state?.email,
                    newPassword
                });
            }

            if (response.status === 200) {
                toast.success(`${isChangePassword ? "Đổi" : "Đặt lại"} mật khẩu thành công!`);
                if (isChangePassword) {
                    navigate("/");
                } else {
                    navigate("/login");
                }
            } else {
                setConfirmCurrentPassword(response.message || `${isChangePassword ? "Đổi" : "Đặt lại"} mật khẩu thất bại.`);
            }
        } catch (error) {
            console.error("Lỗi:", error);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative h-screen">
            <div className="absolute inset-0 -z-10">
                <img
                    src="https://res.cloudinary.com/debx8syhr/image/upload/v1737554135/a42b4dc7074a1bd77c694dbc815a4ced_omkgkz.png"
                    className="w-full h-full object-cover"
                    alt="Background"
                />
            </div>
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-5">
                        {isChangePassword ? "Đổi mật khẩu" : "Đặt lại mật khẩu cho tài khoản"}
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-4 mb-5">
                        {isChangePassword && (
                            <div>
                                <label className="block text-base font-medium text-gray-600 mb-1">
                                    Mật khẩu hiện tại <span className="text-red-600">*</span>
                                </label>
                                <Input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu hiện tại"
                                    required
                                />
                                {confirmCurrentPassword && (
                                    <p className="text-red-500 text-sm">{confirmCurrentPassword}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">
                                Mật khẩu mới <span className="text-red-600">*</span>
                            </label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">
                                Xác nhận mật khẩu mới <span className="text-red-600">*</span>
                            </label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                placeholder="Nhập lại mật khẩu"
                                required
                            />
                            {confirmPasswordError && (
                                <p className="text-red-500 text-sm">{confirmPasswordError}</p>
                            )}
                        </div>

                        <div className="text-center mt-4">
                            <Button
                                type="submit"
                                className="w-2/5 bg-blue-400 text-white py-3 rounded font-medium hover:bg-blue-500 transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? "Đang xử lý..." : isChangePassword ? "Đổi mật khẩu" : "Đặt lại mật khẩu"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
