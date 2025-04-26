import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";
import StepProgressBar from "@/components/Step-progress-bar";
import { Input } from "@/components/ui/input";
import { UserService } from "../../services/UserService";

export default function SignUp() {
    const [gender, setGender] = useState("male");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        // Kiểm tra họ và tên
        if (!username) newErrors.username = "Vui lòng nhập họ và tên.";

        // Kiểm tra email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = "Vui lòng nhập email.";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Email không hợp lệ.";
        }

        // Kiểm tra số điện thoại
        const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/; // Định dạng số điện thoại Việt Nam
        if (!phone) {
            newErrors.phone = "Vui lòng nhập số điện thoại.";
        } else if (!phoneRegex.test(phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ.";
        } else if (phone.length !== 10) {
            newErrors.phone = "Số điện thoại phải có đúng 10 chữ số.";
        }

        // Kiểm tra mật khẩu
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!password) {
            newErrors.password = "Vui lòng nhập mật khẩu.";
        } else if (!passwordRegex.test(password)) {
            newErrors.password =
                "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ in hoa, số và ký tự đặc biệt.";
        }

        // Kiểm tra xác nhận mật khẩu
        if (!confirmPassword) {
            newErrors.confirmPassword = "Vui lòng nhập xác nhận mật khẩu .";
        } else if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset lỗi trước khi kiểm tra

        if (!validateForm()) {
            return; // Dừng nếu form không hợp lệ
        }

        setIsLoading(true);

        try {
            const response = await UserService.getAllAccount();
            const accounts = response.data.accounts;

            // validate email or phone exist
            const isEmailExist = accounts.some((acc) => acc.email === email);
            const isPhoneExist = accounts.some((acc) => acc.phone === phone);

            if (isEmailExist) {
                setErrors({ email: "Email đã được đăng ký." });
                setIsLoading(false);
                return;
            }
            if (isPhoneExist) {
                setErrors({ phone: "Số điện thoại đã được đăng ký." });
                setIsLoading(false);
                return;
            }

            await UserService.sendOtp({ email: email, type: "register" });

            // save temporary in localStorage
            localStorage.setItem(
                "tempSignupData",
                JSON.stringify({
                    username,
                    password,
                    gender,
                    email,
                    phone,
                    role: ["customer"],
                })
            );

            navigate("/otp", { state: { email: email, type: "register" } });
        } catch (err) {
            setErrors({ general: "Không thể kiểm tra tài khoản hiện có." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.value !== password) {
            setErrors({ ...errors, confirmPassword: "Mật khẩu xác nhận không khớp." });
        } else {
            const newErrors = { ...errors };
            delete newErrors.confirmPassword;
            setErrors(newErrors);
        }
    };

    return (
        <div className="relative w-full">
            {/* Background Image */}
            <div className="fixed inset-0 -z-10">
                <img
                    src="https://res.cloudinary.com/debx8syhr/image/upload/v1737554135/a42b4dc7074a1bd77c694dbc815a4ced_omkgkz.png"
                    className="w-full h-full object-cover"
                    alt="Background"
                />
            </div>
            
            {/* Main content with proper spacing to avoid header overlap */}
            <div className="min-h-screen flex flex-col justify-center items-center">
                {/* Header spacing - Adjust this value based on your actual header height */}
                <div className="w-full h-16 md:h-20 lg:h-24"></div>
                
                {/* Form container */}
                <div className="w-full max-w-md mx-auto px-4 py-6 flex-grow flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full">
                        <div className="flex items-center justify-between mb-4">
                            <Link to="/Login" className="flex items-center text-gray-500 hover:text-gray-700">
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                <span className="text-sm">Quay lại</span>
                            </Link>
                            <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-700 flex-1">Đăng ký</h1>
                            <div className="w-16"></div> {/* Spacer cho cân đối layout */}
                        </div>
                        
                        {errors.general && <p className="text-red-500 text-sm text-center mb-4">{errors.general}</p>}
                        
                        {/* Form with scrollable container if needed */}
                        <div className="max-h-[60vh] lg:max-h-none overflow-y-auto pb-2 pr-1">
                            <form className="space-y-3 md:space-y-4" onSubmit={handleSignUp}>
                                {/* UserName */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Họ & Tên<span className="text-red-600">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={username}
                                        placeholder="Nhập tên người dùng"
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full"
                                    />
                                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                                </div>


                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Email<span className="text-red-600">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={email}
                                        placeholder="Nhập email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Số điện thoại<span className="text-red-600">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        value={phone}
                                        placeholder="Nhập số điện thoại"
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>

                                {/* Gender Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Giới tính<span className="text-red-600">*</span>
                                    </label>
                                    <div className="flex justify-between gap-2">
                                        <Button
                                            type="button"
                                            value="male"
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                                                gender === "male" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                            }`}
                                            onClick={() => setGender("male")}
                                        >
                                            Nam
                                        </Button>
                                        <Button
                                            type="button"
                                            value="female"
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                                                gender === "female" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                            }`}
                                            onClick={() => setGender("female")}
                                        >
                                            Nữ
                                        </Button>
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Mật khẩu<span className="text-red-600">*</span>
                                    </label>
                                    <Input
                                        type="password"
                                        value={password}
                                        placeholder="Nhập mật khẩu"
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full"
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>

                                {/* Confirm password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Xác nhận mật khẩu<span className="text-red-600">*</span>
                                    </label>
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        placeholder="Nhập lại mật khẩu"
                                        onChange={handleConfirmPasswordChange}
                                        className="w-full"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                {/* Step Progress Bar */}
                                <div className="my-3">
                                    <StepProgressBar step={1} />
                                </div>

                                {/* Submit form button */}
                                <div className="text-center mt-4">
                                    <Button
                                        type="submit"
                                        className="w-full sm:w-2/3 md:w-3/5 bg-blue-400 text-white py-2 rounded font-medium hover:bg-blue-500 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Đang xử lý..." : "Tiếp theo"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                {/* Bottom spacing for better visual balance */}
                <div className="w-full h-6 md:h-8 lg:h-10"></div>
            </div>
        </div>
    );
}