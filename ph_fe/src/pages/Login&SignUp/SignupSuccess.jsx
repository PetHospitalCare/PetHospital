import React from "react";
import StepProgressBar from "@/components/Step-progress-bar";
import { Link } from "react-router-dom";


export default function SignupSuccess() {
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
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-green-500">Tạo tài khoản thành công!</h1>
                        <div className="flex justify-center mt-8">
                            <svg width="150" height="130" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">

                                <circle cx="100" cy="100" r="80" fill="#4CAF50" />
                                <circle cx="100" cy="100" r="70" fill="#66BB6A" />

                                <path d="M70 100L90 120L130 80" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <p className="font-semibold text-lg mb-10">Bây giờ bạn có thể đăng nhập vào tài khoản của mình </p>


                        <StepProgressBar step={4} />
                        <Link to="/login" className="text-blue-500 underline">Đăng nhập</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}