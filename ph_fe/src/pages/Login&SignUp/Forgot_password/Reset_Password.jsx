import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserService } from "@/services/UserService";
import StepProgressBar from "@/components/Step-progress-bar";

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { state } = useLocation();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.value !== newPassword) {
            setConfirmPasswordError("Mật khẩu xác nhận không khớp");
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await UserService.resetPassword({ email: state?.email, newPassword });
            
            console.log("Response:", response); // Log the response for debugging
            if (response.data.success) {
                toast.success("Đặt lại mật khẩu thành công!");
                navigate("/login");
            } else {
                toast.error(response.data.message || "Đặt lại mật khẩu thất bại.");
            }
        } catch (error) {
            console.error("Lỗi khi đặt lại mật khẩu:", error);
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
                    <h1 className="text-2xl font-bold mb-5">Đặt lại mật khẩu cho tài khoản </h1>
                    <form onSubmit={handleSubmit} className="space-y-4 mb-5">
                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">Mật khẩu mới <span className="text-red-600">*</span></label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                                required
                            />
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">Xác nhận lại mật khẩu mới<span className="text-red-600">*</span></label>

                            <Input
                                type="password"
                                value={confirmPassword}
                                placeholder="Nhập lại mật khẩu"
                                onChange={handleConfirmPasswordChange}
                                required />
                            {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
                        </div>

                        <div className="text-center mt-4">
                            <Button type="submit" className="w-2/5 bg-blue-400 text-white py-3 rounded font-medium hover:bg-blue-500 transition-colors" disabled={isLoading}>
                                {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}