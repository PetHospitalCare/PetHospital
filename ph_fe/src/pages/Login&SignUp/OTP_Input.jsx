import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";
import StepProgressBar from "@/components/Step-progress-bar";
import { Input } from "@/components/ui/input";
import { UserService } from "../../services/UserService";

export default function OTP_Input() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const navigate = useNavigate();
    const { state } = useLocation();

    // Bắt đầu đếm ngược 60s khi nhấn "Send Again"
    const handleSendAgain = async () => {
        if (isSending || countdown > 0) return; // Nếu đang gửi hoặc chưa hết thời gian thì không làm gì

        setIsSending(true);
        setError("");

        try {
            await UserService.sendOtp({ email: state?.email });
            setCountdown(60); // Bắt đầu đếm ngược 60s
        } catch (err) {
            setError("Gửi lại OTP thất bại. Vui lòng thử lại.");
        } finally {
            setIsSending(false);
        }
    };

    // useEffect để đếm ngược
    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer); // Xóa bộ đếm khi component unmount
        }
    }, [countdown]);

    // Handle verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const storedEmail = JSON.parse(localStorage.getItem("tempSignupData"))?.email;
            const email = state?.email || storedEmail;
            const response = await UserService.verifyOTP({ email: email, otp });

            if (response.status === 200) {
                navigate("/loading");
            } else {
                throw new Error("Mã OTP không hợp lệ");
            }
        } catch (err) {
            setError("OTP không hợp lệ hoặc đã hết hạn.");
        }
    };

    return (
        <div className="relative h-screen">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <img
                    src="https://res.cloudinary.com/debx8syhr/image/upload/v1737554135/a42b4dc7074a1bd77c694dbc815a4ced_omkgkz.png"
                    className="w-full h-full object-cover"
                    alt="Background"
                />
            </div>

            {/* Form OTP */}
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                    {/* OTP Input */}
                    <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">Nhập mã OTP</h1>
                    <p className="text-center text-gray-600 mb-4">
                        Mã OTP đã được gửi đến Email: <br />
                        <span className="font-bold text-black">{state?.email}</span>
                    </p>
                    <div className="text-center text-red-600 font-semibold mb-2">
                    ⚠️ Mã OTP chỉ có hiệu lực trong vòng <span className="font-bold">5 phút</span>
                    </div>
                    <div className="text-center text-red-600 font-semibold mb-2">
                     Vui lòng nhập mã trước khi hết hạn!
                    </div>

                    {/* Form input OTP */}
                    <form className="space-y-5" onSubmit={handleVerifyOTP}>
                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">
                                Mã OTP<span className="text-red-600">*</span>
                            </label>
                            <Input
                                type="text"
                                required
                                className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>

                        {/* Change email / Send Again */}
                        <div className="flex justify-between text-sm">
                            <Link to="/change-email" state={{ email: state?.email }} className="text-red-500 font-medium underline">
                                Thay đổi Email
                            </Link>
                            <button
                                type="button"
                                disabled={isSending || countdown > 0} // Chặn khi đang gửi hoặc đang đếm ngược
                                onClick={handleSendAgain}
                                className="text-blue-500 font-medium underline"
                            >
                                {countdown > 0 ? `Resend in ${countdown}s` : "Gửi lại"}
                            </button>
                        </div>

                        {error && <p className="text-red-500">{error}</p>}

                        {/* Step Progress Bar */}
                        <StepProgressBar step={2} />

                        {/* Next */}
                        <div className="text-center">
                            <Button
                                type="submit"
                                className="w-2/5 bg-blue-400 text-white py-3 rounded font-medium hover:bg-blue-500 transition-colors"
                            >
                                Xác nhận
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
