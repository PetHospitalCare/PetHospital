import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StepProgressBar from "@/components/Step-progress-bar";
import { UserService } from "../../services/UserService";

export default function LoadingScreen() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [error, setError] = useState("");

    useEffect(() => {
        const verifyOTP = async () => {
            try {
                const tempData = JSON.parse(localStorage.getItem("tempSignupData"));
                await UserService.signUpService(tempData);
                // Xóa dữ liệu tạm thời và điều hướng
                localStorage.removeItem("tempSignupData");
                navigate("/signup-success");
            } catch (err) {
                navigate("/otp", { state: { email: state?.email, error: "Invalid OTP or expired" } });
            }
        };

        verifyOTP();
    }, [navigate, state]);

    return (
        <div className="relative min-h-screen w-full">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <img
                    src="https://res.cloudinary.com/debx8syhr/image/upload/v1737554135/a42b4dc7074a1bd77c694dbc815a4ced_omkgkz.png"
                    className="w-full h-full object-cover"
                    alt="Background"
                />
            </div>

            {/* Form OTP */}
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
                <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg md:shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-sm">
                    <div className="flex justify-center mb-4 sm:mb-6">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                    </div>
                    <StepProgressBar step={3} />
                </div>
            </div>
        </div>
    );
}