import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserService } from "../../../services/UserService";
import { toast } from "sonner";

export default function Forgot_Password() {
    const [Email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Reset lỗi trước khi gửi
        setIsLoading(true); // Bắt đầu trạng thái loading
        try {
            // Gọi API để kiểm tra email
            const response = await UserService.forgotPassword({ email: Email });

            if (response.data.success) {
                // Nếu thành công, gửi OTP
                await UserService.sendOtp({ email: Email, type: "forgotPassword" });
                toast.success("Gửi mã OTP thành công!");
                // Chuyển hướng đến trang nhập OTP
                navigate("/otp", { state: { email: Email, type: "forgotPassword" } });
            } else {
                // Nếu không thành công, hiển thị lỗi
                setError(response.data.message || "Không tồn tại email trong hệ thống. Vui lòng thử lại.");
            }
        } catch (err) {
            setError("Email không tồn tại hoặc đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setIsLoading(false); // Kết thúc trạng thái loading
        }
    };

    return (
        <div className="relative h-screen">
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
                <img
                    src="https://res.cloudinary.com/debx8syhr/image/upload/v1737554135/a42b4dc7074a1bd77c694dbc815a4ced_omkgkz.png"
                    className="w-full h-full object-cover "
                    alt="Background"
                />
            </div>

            {/* Content */}
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                    {/* Back to Login */}
                    <Link to="/login" className="flex items-center text-gray-500 hover:text-gray-700 mb-6">
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Quay lại đăng nhập
                    </Link>

                    {/* Title */}
                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                        Quên mật khẩu
                    </h1>
                    <p className="text-sm text-gray-600 text-center mb-6">
                        Nhập email mà bạn đã đăng ký để nhận mã OTP đặt lại mật khẩu.
                    </p>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-500 text-sm text-center mb-4">
                            {error}
                        </p>
                    )}

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email<span className="text-red-600">*</span>
                            </label>
                            <Input
                                type="email"
                                value={Email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email của bạn"
                                className="w-full p-2 bg-gray-100 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="text-center mt-4">
                            <Button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-3 rounded font-medium hover:bg-blue-400 transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? "Đang xử lý..." : "Xác nhận"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}