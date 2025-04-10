import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserService } from "../../services/UserService";
import { UserContext } from "../../contexts/UserContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({}); // State để lưu lỗi
  const { loginContext, user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu đã đăng nhập, chuyển hướng về trang chủ
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Xóa lỗi khi người dùng nhập
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email.";
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset lỗi trước khi kiểm tra

    if (!validateForm()) {
      return; // Dừng nếu form không hợp lệ
    }

    setIsLoading(true);

    try {
      const response = await UserService.signInService(formData);
      if (response.status === 200) {
        loginContext();
        toast.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        setErrors({ general: "Vui lòng kiểm tra lại tài khoản và mật khẩu!" });
      }
    } catch (error) {
      setErrors({ general: error.message || "Đã xảy ra lỗi. Vui lòng thử lại." });
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
        />
      </div>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-10 text-left">Đăng nhập</h1>

              {/* Hiển thị lỗi chung */}
              {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-2 text-left">Email</label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-100 border rounded"
                  />
                  {/* Hiển thị lỗi email */}
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-left">Mật khẩu</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-100 border rounded"
                  />
                  {/* Hiển thị lỗi mật khẩu */}
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  <div className="text-right mt-1">
                    <Link to="/forgot-password" className="text-sm text-blue-500 underline">
                      Quên mật khẩu?
                    </Link>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="w-2/5 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                  </Button>
                </div>
              </form>

              <p className="mt-4 text-sm text-center">
                Bạn chưa có tài khoản?{" "}
                <Link to="/SignUp" className="text-blue-500 underline">
                  Đăng ký
                </Link>
              </p>

              <div className="text-left mt-8">
                <Link to="/" className="flex text-gray-400 hover:text-gray-500">
                  Trang chủ
                </Link>
              </div>
            </div>

            <div className="p-8 flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/dyv5p6rpf/image/upload/v1737568026/cute-mascot_fkjwgv.png"
                alt="Cute mascot"
                className="w-fit h-fit rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
