import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";
import StepProgressBar from "@/components/Step-progress-bar";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { UserService } from "../../services/UserService";

export default function OTP_Input() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [isSending, setIsSending] = useState(false);

    const navigate = useNavigate();
    const { state } = useLocation();

    //Handle send again
    const handleSendAgain = async () => {
        setIsSending(true);
        setError("");
        try {
            // await axios.post("http://localhost:9999/account/send-otp", { email: state?.email });
            await UserService.sendOtp({ email: state?.email });
            setIsSending(false);
        } catch (err) {
            setError("Gửi lại OTP thất bại. Vui lòng thử lại.");
            setIsSending(false);
        }
    };

    //handle verify otp to loading screen
    const handleVerifyOTP = (e) => {
        e.preventDefault();
        navigate("/loading", { state: { email: state?.email, otp } });
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
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
                    {/* OTP Input */}
                    <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">Input your OTP</h1>
                    <p className="text-center text-gray-600 mb-4">
                        The OTP code has been sent to your email <br />
                        <span className="font-bold text-black">{state?.email}</span>
                    </p>
                    {/* Form input OTP */}
                    <form className="space-y-5" onSubmit={handleVerifyOTP}>
                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">
                                OTP code<span className="text-red-600">*</span>
                            </label>
                            <Input
                                type="text"
                                required
                                className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>

                        {/* Choice to select change email or Send Again */}
                        <div className="flex justify-between text-sm">
                            <Link to="/change-email" state={{ email: state?.email }} className="text-red-500 font-medium underline">
                                Change your email
                            </Link>
                            <button
                                type="button"
                                disabled={isSending}
                                onClick={handleSendAgain}
                                className="text-blue-500 font-medium underline"
                            >

                                {isSending ? "is sending..." : "Send again"}
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
                                Next
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
