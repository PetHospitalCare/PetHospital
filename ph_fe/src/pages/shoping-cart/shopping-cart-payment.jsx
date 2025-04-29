import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext.jsx";
import { ShoppingCartService } from "@/services/ShoppingCartService.js";
import { useAddToCart } from "@/lib/shopping-cart-util.js";
import { ShoppingCartContext } from "@/contexts/ShoppingCartContext.jsx";
import { toast } from "sonner";
import UpdateProductQuantity from "@/pages/shoping-cart/update-shopping-cart-modal.jsx";
import { useNavigate } from "react-router-dom";

const GHN_API_URL = "https://online-gateway.ghn.vn/shiip/public-api";
const GHN_TOKEN = import.meta.env.VITE_GHN_TOKEN;

export default function ShoppingCartPayment() {
    const [cart, setCart] = useState(null);
    const { user } = useContext(UserContext);
    const addToCart = useAddToCart();
    const { cartCount, setDataCartContext } = useContext(ShoppingCartContext);
    const { isChangeCart, setDataIsChangeCartContext } = useContext(ShoppingCartContext);
    const [productToUpdate, setProductToUpdate] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [specificAddress, setSpecificAddress] = useState("");
    const [addressError, setAddressError] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [cityError, setCityError] = useState("");
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [districtError, setDistrictError] = useState("");
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState("");
    const [wardError, setWardError] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("online");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [showValidation, setShowValidation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        makeData();

        if (user) {
            if (user.email) {
                setEmail(user.email);
            }
            if (user.phone) {
                setPhoneNumber(user.phone);
            }
        } else {
            setTimeout(() => {
                if (!user) {
                    toast.warning('Vui lòng đăng nhập để mua hàng!');
                    navigate('/');
                }
            }, 2000)
        }

        fetchProvinces();
    }, [user, cartCount, isChangeCart]);

    const fetchProvinces = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${GHN_API_URL}/master-data/province`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': GHN_TOKEN
                }
            });

            const result = await response.json();

            if (result.code === 200) {
                if (Array.isArray(result.data)) {
                    setProvinces(result.data);
                } else if (result.data && typeof result.data === 'object') {
                    try {
                        const provincesArray = Object.values(result.data)
                            .filter(item => item && typeof item === 'object' && item.ProvinceID && item.ProvinceName)
                            .map(item => ({
                                ProvinceID: item.ProvinceID,
                                ProvinceName: item.ProvinceName,
                                Code: item.Code || ""
                            }));

                        if (provincesArray.length > 0) {
                            setProvinces(provincesArray);
                        } else {
                            console.error("No provinces found in data:", result.data);
                            toast.error("Định dạng dữ liệu tỉnh/thành phố không hợp lệ");
                        }
                    } catch (parseError) {
                        console.error("Error parsing provinces data:", parseError);
                        toast.error("Lỗi xử lý dữ liệu tỉnh/thành phố");
                    }
                } else {
                    console.error("Unexpected provinces data format:", result.data);
                    toast.error("Định dạng dữ liệu tỉnh/thành phố không hợp lệ");
                }
            } else {
                console.error("Error fetching provinces:", result);
                toast.error(`Không thể tải danh sách tỉnh/thành phố: ${result.message || 'Lỗi không xác định'}`);
            }
        } catch (error) {
            console.error("Error fetching provinces:", error);
            toast.error("Có lỗi xảy ra khi tải danh sách tỉnh/thành phố");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDistricts = async (provinceId) => {
        if (!provinceId) {
            setDistricts([]);
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`${GHN_API_URL}/master-data/district`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': GHN_TOKEN
                },
                body: JSON.stringify({ province_id: parseInt(provinceId) })
            });

            const result = await response.json();

            if (result.code === 200) {
                if (Array.isArray(result.data)) {
                    setDistricts(result.data);
                } else if (result.data && typeof result.data === 'object') {
                    try {
                        const districtsArray = Object.values(result.data)
                            .filter(item => item && typeof item === 'object' && item.DistrictID && item.DistrictName)
                            .map(item => ({
                                DistrictID: item.DistrictID,
                                ProvinceID: item.ProvinceID,
                                DistrictName: item.DistrictName,
                                Code: item.Code || "",
                                Type: item.Type || 0
                            }));

                        if (districtsArray.length > 0) {
                            setDistricts(districtsArray);
                        } else {
                            console.error("No districts found in data:", result.data);
                            toast.error("Không tìm thấy dữ liệu quận/huyện");
                        }
                    } catch (parseError) {
                        console.error("Error parsing districts data:", parseError);
                        toast.error("Lỗi xử lý dữ liệu quận/huyện");
                    }
                } else {
                    console.error("Unexpected districts data format:", result.data);
                    toast.error("Định dạng dữ liệu quận/huyện không hợp lệ");
                }
            } else {
                console.error("Error fetching districts:", result);
                toast.error(`Không thể tải danh sách quận/huyện: ${result.message || 'Lỗi không xác định'}`);
            }
        } catch (error) {
            console.error("Error fetching districts:", error);
            toast.error("Có lỗi xảy ra khi tải danh sách quận/huyện");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWards = async (districtId) => {
        if (!districtId) {
            setWards([]);
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`${GHN_API_URL}/master-data/ward`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': GHN_TOKEN
                },
                body: JSON.stringify({ district_id: parseInt(districtId) })
            });

            const result = await response.json();

            if (result.code === 200) {
                if (Array.isArray(result.data)) {
                    setWards(result.data);
                } else if (result.data && typeof result.data === 'object') {
                    try {
                        const wardsArray = Object.values(result.data)
                            .filter(item => item && typeof item === 'object' && item.WardCode && item.WardName)
                            .map(item => ({
                                WardCode: item.WardCode,
                                DistrictID: item.DistrictID,
                                WardName: item.WardName
                            }));

                        if (wardsArray.length > 0) {
                            setWards(wardsArray);
                        } else {
                            console.error("No wards found in data:", result.data);
                            toast.error("Không tìm thấy dữ liệu phường/xã");
                        }
                    } catch (parseError) {
                        console.error("Error parsing wards data:", parseError);
                        toast.error("Lỗi xử lý dữ liệu phường/xã");
                    }
                } else {
                    console.error("Unexpected wards data format:", result.data);
                    toast.error("Định dạng dữ liệu phường/xã không hợp lệ");
                }
            } else {
                console.error("Error fetching wards:", result);
                toast.error(`Không thể tải danh sách phường/xã: ${result.message || 'Lỗi không xác định'}`);
            }
        } catch (error) {
            console.error("Error fetching wards:", error);
            toast.error("Có lỗi xảy ra khi tải danh sách phường/xã");
        } finally {
            setIsLoading(false);
        }
    };

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhoneNumber = (phone) => {
        const re = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
        return re.test(String(phone));
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (!value) {
            setEmailError("Email không được để trống");
        } else if (!validateEmail(value)) {
            setEmailError("Email không hợp lệ");
        } else {
            setEmailError("");
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);

        if (!value) {
            setPhoneNumberError("Số điện thoại không được để trống");
        } else if (!validatePhoneNumber(value)) {
            setPhoneNumberError("Số điện thoại không hợp lệ");
        } else {
            setPhoneNumberError("");
        }
    };

    const handleSpecificAddressChange = (e) => {
        const value = e.target.value;
        setSpecificAddress(value);

        if (value) {
            setSelectedAddress("");
        }

        if (!value && !selectedAddress) {
            setAddressError("Vui lòng nhập địa chỉ giao hàng");
        } else {
            setAddressError("");
        }
    };

    const handleSelectedAddressChange = (e) => {
        const value = e.target.value;
        setSelectedAddress(value);

        if (value) {
            setSpecificAddress("");
        }

        if (!value && !specificAddress) {
            setAddressError("Vui lòng nhập địa chỉ giao hàng");
        } else {
            setAddressError("");
        }
    };

    const handleProvinceChange = (e) => {
        const value = e.target.value;
        const provinceId = e.target.options[e.target.selectedIndex].getAttribute('data-id');

        setSelectedProvince(value);
        setSelectedDistrict("");
        setSelectedWard("");
        setWards([]);

        if (!value) {
            setCityError("Vui lòng chọn tỉnh/thành phố");
        } else {
            setCityError("");
            fetchDistricts(provinceId);
        }
    };

    const handleDistrictChange = (e) => {
        const value = e.target.value;
        const districtId = e.target.options[e.target.selectedIndex].getAttribute('data-id');

        setSelectedDistrict(value);
        setSelectedWard("");

        if (!value) {
            setDistrictError("Vui lòng chọn quận/huyện");
        } else {
            setDistrictError("");
            fetchWards(districtId);
        }
    };

    const handleWardChange = (e) => {
        const value = e.target.value;
        setSelectedWard(value);

        if (!value) {
            setWardError("Vui lòng chọn phường/xã");
        } else {
            setWardError("");
        }
    };

    const validateForm = () => {
        let isValid = true;

        if (!email) {
            setEmailError("Email không được để trống");
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError("Email không hợp lệ");
            isValid = false;
        } else {
            setEmailError("");
        }

        if (!phoneNumber) {
            setPhoneNumberError("Số điện thoại không được để trống");
            isValid = false;
        } else if (!validatePhoneNumber(phoneNumber)) {
            setPhoneNumberError("Số điện thoại không hợp lệ");
            isValid = false;
        } else {
            setPhoneNumberError("");
        }

        if (!selectedAddress && !specificAddress) {
            setAddressError("Vui lòng nhập địa chỉ giao hàng");
            isValid = false;
        } else {
            setAddressError("");
        }

        if (!selectedProvince) {
            setCityError("Vui lòng chọn tỉnh/thành phố");
            isValid = false;
        } else {
            setCityError("");
        }

        if (!selectedDistrict) {
            setDistrictError("Vui lòng chọn quận/huyện");
            isValid = false;
        } else {
            setDistrictError("");
        }

        if (!selectedWard) {
            setWardError("Vui lòng chọn phường/xã");
            isValid = false;
        } else {
            setWardError("");
        }

        return isValid && cart && cart?.items?.length > 0;
    };

    const handlePayment = async (event) => {
        if (event) {
            event.preventDefault();
        }

        setShowValidation(true);

        const isValid = validateForm();

        if (!user || !user._id) {
            toast.warning('Vui lòng đăng nhập để mua hàng!');
            return;
        }

        if (!isValid) {
            return;
        }

        if (cart && cart?.items?.length > 0) {
            setIsLoading(true);

            const provinceName = provinces.find(p => p.ProvinceID.toString() === selectedProvince)?.ProvinceName || "";
            const districtName = districts.find(d => d.DistrictID.toString() === selectedDistrict)?.DistrictName || "";
            const wardName = wards.find(w => w.WardCode.toString() === selectedWard)?.WardName || "";

            const fullAddress = `${specificAddress || selectedAddress || ''},  ${wardName || ''}, ${districtName || ''}, ${provinceName || ''}`;

            const orderInfo = {
                userId: user._id,
                email: email,
                address: fullAddress,
                phoneNumber: phoneNumber,
                province: provinceName,
                district: districtName,
                ward: wardName,
                inputAddress: specificAddress,
                selectedAddress: selectedAddress,
                items: cart.items,
                totalPrice: cart.totalPrice,
                shipFee: cart.shipFee || 0,
                paymentMethod: paymentMethod
            };

            if (paymentMethod === "cod") {
                try {
                    const response = await ShoppingCartService.createCodOrder(user._id, orderInfo);

                    if (response && response.status === 200) {
                        toast.success("Đặt hàng thành công!");
                    } else {
                        toast.error("Có lỗi xảy ra khi đặt hàng!");
                    }

                    localStorage.removeItem("cart");
                    setCart(null);
                    setDataCartContext(0);
                    setDataIsChangeCartContext(!isChangeCart);
                    setIsLoading(false);

                    setTimeout(() => {
                        navigate('/');
                    }, 200);
                } catch (error) {
                    localStorage.removeItem("cart");
                    setCart(null);
                    setDataCartContext(0);
                    setDataIsChangeCartContext(!isChangeCart);
                    setIsLoading(false);
                    console.error("Error creating COD order:", error);
                    toast.error("Có lỗi xảy ra khi đặt hàng!");

                    setTimeout(() => {
                        navigate('/');
                    }, 200);
                }
            } else {
                try {
                    const response = await ShoppingCartService.paymentShoppingCartByUserId(user._id, orderInfo);

                    if (response && response.status === 200 && response.data.paymentUrl) {
                        setIsLoading(false);
                        window.location.href = response.data.paymentUrl;
                    } else {
                        toast.error("Có lỗi xảy ra khi thanh toán online!");
                    }

                    setIsLoading(false);
                } catch (error) {
                    setIsLoading(false);
                    console.error("Error processing online payment:", error);
                    toast.error("Có lỗi xảy ra khi thanh toán online!");
                }
            }
        } else {
            toast.warning("Giỏ hàng trống!");
        }
    };

    const makeData = () => {
        const cartLocal = localStorage.getItem("cart");

        if (cartLocal) {
            setCart(JSON.parse(cartLocal));
        } else {
            setCart(null);
        }
    };

    const addToCardFunction = (product, order) => {
        addToCart({
            productId: product.productId,
            quantity: 1,
            price: product.price,
            imageUrl: product.imageUrl,
            name: product.name
        }, setDataCartContext, setDataIsChangeCartContext, order, true);
    };

    const handleOpenModalUpdateProductQuantity = (data) => {
        setProductToUpdate(data);

        setTimeout(() => {
            setIsOpenModal(true);
        }, 100);
    };

    const close = () => {
        setIsOpenModal(false);
    };

    const formatCurrency = (amount) => {
        return amount?.toLocaleString('vi-VN') + ' đ';
    };

    return (
        <div className="w-full h-full" style={{ backgroundColor: "#fef6e9", minHeight: "calc(-100px + 100vh)" }}>
            <div className="container mx-auto px-4 py-8 pt-32" style={{ backgroundColor: "#fef6e9" }}>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow flex flex-col" style={{ height: "590px" }}>
                        <h2 className="text-xl font-bold mb-4">Thanh toán</h2>

                        <div className="flex-1 overflow-y-auto pr-2 h-[310px]">
                            <form className="space-y-4">
                                <div className="mb-6 relative">
                                    <input
                                        type="email"
                                        placeholder="Địa chỉ email"
                                        className={`w-full border p-2 rounded outline-none focus:border-blue-500 focus:border-2 ${showValidation && emailError ? 'border-red-500' : ''}`}
                                        disabled={user && user.email ? true : false}
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                    <div className="h-5 mt-1">
                                        {showValidation && emailError && <p className="text-red-500 text-sm absolute">{emailError}</p>}
                                    </div>
                                </div>

                                <div className="mb-6 relative">
                                    <input
                                        type="tel"
                                        placeholder="Số điện thoại"
                                        className={`w-full border p-2 rounded outline-none focus:border-blue-500 focus:border-2 ${showValidation && phoneNumberError ? 'border-red-500' : ''}`}
                                        value={phoneNumber}
                                        onChange={handlePhoneChange}
                                    />
                                    <div className="h-5 mt-1">
                                        {showValidation && phoneNumberError && <p className="text-red-500 text-sm absolute">{phoneNumberError}</p>}
                                    </div>
                                </div>

                                <div className="mb-6 relative">
                                    <select
                                        className={`w-full border p-2 rounded outline-none focus:border-blue-500 focus:border-2 ${showValidation && addressError && !specificAddress ? 'border-red-500' : ''}`}
                                        value={selectedAddress}
                                        onChange={handleSelectedAddressChange}
                                        disabled={!!specificAddress}
                                    >
                                        <option value="">Chọn địa chỉ</option>
                                        {user && user.address && (
                                            <option value={user.address}>{user.address}</option>
                                        )}
                                    </select>
                                    <div className="h-5 mt-1">
                                        {/* Để trống để giữ khoảng cách đồng nhất */}
                                    </div>
                                </div>

                                <div className="mb-6 relative">
                                    <input
                                        type="text"
                                        placeholder="Địa chỉ cụ thể (số nhà, tên đường...)"
                                        className={`w-full border p-2 rounded outline-none focus:border-blue-500 focus:border-2 ${showValidation && addressError && !selectedAddress ? 'border-red-500' : ''}`}
                                        value={specificAddress}
                                        onChange={handleSpecificAddressChange}
                                        disabled={!!selectedAddress}
                                    />
                                    <div className="h-5 mt-1">
                                        {showValidation && addressError && !selectedAddress && !specificAddress && <p className="text-red-500 text-sm absolute">{addressError}</p>}
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 mb-6">
                                    <div className="w-full md:w-1/3 relative">
                                        <select
                                            className={`w-full border p-2 rounded outline-none focus:border-blue-500 focus:border-2 ${showValidation && cityError ? 'border-red-500' : ''}`}
                                            value={selectedProvince}
                                            onChange={handleProvinceChange}
                                            disabled={isLoading}
                                        >
                                            <option value="">Chọn tỉnh/thành phố</option>
                                            {provinces.map((province) => (
                                                <option
                                                    key={province.ProvinceID}
                                                    value={province.ProvinceID}
                                                    data-id={province.ProvinceID}
                                                >
                                                    {province.ProvinceName}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="h-5 mt-1">
                                            {showValidation && cityError && <p className="text-red-500 text-sm absolute">{cityError}</p>}
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/3 relative">
                                        <select
                                            className={`w-full border p-2 rounded outline-none focus:border-blue-500 focus:border-2 ${showValidation && districtError ? 'border-red-500' : ''}`}
                                            value={selectedDistrict}
                                            onChange={handleDistrictChange}
                                            disabled={!selectedProvince || isLoading}
                                        >
                                            <option value="">Chọn quận/huyện</option>
                                            {districts.map((district) => (
                                                <option
                                                    key={district.DistrictID}
                                                    value={district.DistrictID}
                                                    data-id={district.DistrictID}
                                                >
                                                    {district.DistrictName}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="h-5 mt-1">
                                            {showValidation && districtError && <p className="text-red-500 text-sm absolute">{districtError}</p>}
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/3 relative">
                                        <select
                                            className={`w-full border p-2 rounded outline-none focus:border-blue-500 focus:border-2 ${showValidation && wardError ? 'border-red-500' : ''}`}
                                            value={selectedWard}
                                            onChange={handleWardChange}
                                            disabled={!selectedDistrict || isLoading}
                                        >
                                            <option value="">Chọn phường/xã</option>
                                            {wards.map((ward) => (
                                                <option
                                                    key={ward.WardCode}
                                                    value={ward.WardCode}
                                                >
                                                    {ward.WardName}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="h-5 mt-1">
                                            {showValidation && wardError && <p className="text-red-500 text-sm absolute">{wardError}</p>}
                                        </div>
                                    </div>
                                </div>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={paymentMethod === "cod"}
                                        onChange={(e) => setPaymentMethod(e.target.checked ? "cod" : "online")}
                                    />
                                    <span>Thanh toán khi nhận hàng</span>
                                </label>
                            </form>
                        </div>

                        <div className="mt-2 pt-1">
                            <button
                                className={`w-full py-2 rounded font-medium ${!cart || !cart.items || cart.items.length === 0 || isLoading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                type="button"
                                onClick={handlePayment}
                                disabled={!cart || !cart.items || cart.items.length === 0 || isLoading}
                            >
                                {isLoading ? "Đang xử lý..." : "Thanh toán"}
                            </button>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow flex flex-col" style={{ height: "590px" }}>
                        <h2 className="text-xl font-bold mb-4">Giỏ hàng</h2>

                        <div className="flex-1 overflow-y-auto pr-2">
                            <div className="space-y-4">
                                {cart?.items && cart.items.length > 0 && (
                                    cart.items.map((item, index) => (
                                        <div className="flex gap-4" key={index}>
                                            <img src={item.imageUrl} alt="Product" className="w-16 h-16" />
                                            <div className="flex-1">
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-gray-500">{formatCurrency(item.price)}</p>
                                                <p className="text-sm">Số lượng: {item.quantity}</p>
                                            </div>
                                            <div className="text-right text-sm text-gray-500">
                                                <a className="text-blue-500 cursor-pointer" onClick={() => handleOpenModalUpdateProductQuantity(item)}>Chỉnh sửa</a> | <a
                                                    onClick={() => addToCardFunction(item, 'delete')}
                                                    className="text-red-500 cursor-pointer"
                                                >
                                                    Loại bỏ
                                                </a>
                                            </div>
                                        </div>
                                    )))}
                            </div>
                        </div>

                        <div className="mt-4 pt-2 border-t">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-semibold">Tổng giá trị:</p>
                                <p className="text-right font-bold">{cart && cart?.totalPrice ? formatCurrency(cart.totalPrice + (cart.shipFee || 0)) : '0 đ'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <UpdateProductQuantity open={isOpenModal} onClose={() => close()} productData={productToUpdate}></UpdateProductQuantity>
        </div>
    );
}