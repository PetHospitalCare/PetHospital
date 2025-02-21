import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StepProgressBar from "@/components/Step-progress-bar";
import { UserService } from "../../services/UserService";
import  axios  from "axios";
export default function LoadingScreen() {
    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect(() => {
        const verifyOTP = async () => {
            try {
                const storedEmail = JSON.parse(localStorage.getItem("tempSignupData"))?.email;
                const email = state?.email || storedEmail;

                const response = await UserService.verifyOTP({email:email, otp: state?.otp});
             
                if (response.status == 400) throw new Error("Invalid OTP");

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
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                    </div>
                    <StepProgressBar step={3} />
                </div>
            </div>
        </div>
    );
}
