import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext.jsx";
import { ShoppingCartService } from "@/services/ShoppingCartService.js";
import { useAddToCart } from "@/lib/shopping-cart-util.js";
import { ShoppingCartContext } from "@/contexts/ShoppingCartContext.jsx";
import { toast } from "sonner";
import UpdateProductQuantity from "@/pages/shoping-cart/update-shopping-cart-modal.jsx";
import { useNavigate } from "react-router-dom";

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
    const [phoneNumber, setPhoneNumber] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("online");
    const navigate = useNavigate();

    useEffect(() => {
        makeData()
    }, [user, cartCount, isChangeCart]);

    const handlePayment = async () => {
        event.preventDefault();

        if (!user || !user._id) {
            toast.warning('Bạn cần đăng nhập để mua hàng!');
            return;
        }

        if (!selectedAddress && !specificAddress) {
            toast.warning('Vui lòng nhập địa chỉ giao hàng!');
            return;
        }

        if (!phoneNumber) {
            toast.warning('Vui lòng nhập số điện thoại!');
            return;
        }

        if (!city) {
            toast.warning('Vui lòng chọn thành phố!');
            return;
        }

        if (!district) {
            toast.warning('Vui lòng chọn quận/huyện!');
            return;
        }

        if (!ward) {
            toast.warning('Vui lòng chọn phường/xã!');
            return;
        }

        if (cart && cart?.items?.length > 0) {
            const contactInfo = user._id;

            // Tạo đối tượng thông tin đơn hàng
            const orderInfo = {
                userId: user._id,
                address: specificAddress || selectedAddress,
                phoneNumber: phoneNumber,
                city: city,
                district: district,
                ward: ward,
                items: cart.items,
                totalPrice: cart.totalPrice,
                shipFee: cart.shipFee || 0,
                paymentMethod: paymentMethod
            };

            if (paymentMethod === "cod") {
                // Xử lý thanh toán khi nhận hàng
                try {
                    const response = await ShoppingCartService.createCodOrder(user._id, cart);

                    if (response && response.status === 200) {
                        toast.success("Đặt hàng thành công!");

                        localStorage.removeItem("cart");
                        setCart(null);
                        setDataCartContext(0);
                        setDataIsChangeCartContext(!isChangeCart);

                        setTimeout(() => {
                            navigate('/');
                        }, 200)
                    } else {
                        toast.error("Có lỗi xảy ra khi đặt hàng!");
                    }
                } catch (error) {
                    console.error("Error creating COD order:", error);
                    toast.error("Có lỗi xảy ra khi đặt hàng!");
                }
            } else {
                // Xử lý thanh toán online
                try {
                    const response = await ShoppingCartService.paymentShoppingCartByUserId(contactInfo, cart);

                    if (response && response.status === 200 && response.data.paymentUrl) {
                        window.location.href = response.data.paymentUrl;
                    } else {
                        toast.error("Có lỗi xảy ra khi thanh toán online!");
                    }
                } catch (error) {
                    console.error("Error processing online payment:", error);
                    toast.error("Có lỗi xảy ra khi thanh toán online!");
                }
            }
        } else {
            toast.warning("Giỏ hàng trống!");
        }
    }

    const makeData = () => {
        const cartLocal = localStorage.getItem("cart");

        if (cartLocal) {
            setCart(JSON.parse(cartLocal));
        } else {
            setCart(null);
        }
    }

    const addToCardFunction = (product, order) => {
        addToCart({
            productId: product.productId,
            quantity: 1,
            price: product.price,
            imageUrl: product.imageUrl,
            name: product.name
        }, setDataCartContext, setDataIsChangeCartContext, order, true);
    }

    const handleOpenModalUpdateProductQuantity = (data) => {
        setProductToUpdate(data);

        setTimeout(() => {
            setIsOpenModal(true);
        }, 100)
    }

    const close = () => {
        setIsOpenModal(false);
    }

    const formatCurrency = (amount) => {
        return amount?.toLocaleString('vi-VN') + ' đ';
    }

    return (
        <div className="w-full h-full" style={{ backgroundColor: "#fef6e9", minHeight: "calc(-100px + 100vh)" }}>
            <div className="container mx-auto px-4 py-8 pt-32" style={{ backgroundColor: "#fef6e9" }}>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow h-[500px] flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Thanh toán</h2>

                        <div className="flex-1 overflow-y-auto pr-2">
                            <form className="space-y-4">
                                <input type="email" placeholder="Địa chỉ email"
                                    className="w-full border p-2 rounded outline-none focus:border-blue-500 focus:border-2"
                                    disabled value={user && user.email} />

                                <input type="tel" placeholder="Số điện thoại"
                                    className="w-full border p-2 rounded outline-none focus:border-blue-500 focus:border-2"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)} />

                                <select
                                    className="w-full border p-2 rounded outline-none focus:border-blue-500 focus:border-2"
                                    value={selectedAddress}
                                    onChange={(e) => setSelectedAddress(e.target.value)}
                                >
                                    <option value="">Chọn địa chỉ</option>
                                    {user && user.address && (
                                        <option value={user.address}>{user.address}</option>
                                    )}
                                </select>

                                <input type="text" placeholder="Địa chỉ cụ thể (số nhà, tên đường...)"
                                    className="w-full border p-2 rounded outline-none focus:border-blue-500 focus:border-2"
                                    value={specificAddress}
                                    onChange={(e) => setSpecificAddress(e.target.value)} />

                                <div className="flex gap-4">
                                    <select
                                        className="w-1/3 border p-2 rounded outline-none focus:border-blue-500 focus:border-2"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    >
                                        <option value="">Chọn thành phố</option>
                                        <option value="hanoi">Hà Nội</option>
                                        <option value="hcm">TP. Hồ Chí Minh</option>
                                        <option value="danang">Đà Nẵng</option>
                                        <option value="cantho">Cần Thơ</option>
                                        <option value="haiphong">Hải Phòng</option>
                                    </select>
                                    <select
                                        className="w-1/3 border p-2 rounded outline-none focus:border-blue-500 focus:border-2"
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                    >
                                        <option value="">Chọn quận/huyện</option>
                                        <option value="district1">Quận 1</option>
                                        <option value="district2">Quận 2</option>
                                        <option value="district3">Quận 3</option>
                                    </select>
                                    <select
                                        className="w-1/3 border p-2 rounded outline-none focus:border-blue-500 focus:border-2"
                                        value={ward}
                                        onChange={(e) => setWard(e.target.value)}
                                    >
                                        <option value="">Chọn phường/xã</option>
                                        <option value="ward1">Phường 1</option>
                                        <option value="ward2">Phường 2</option>
                                        <option value="ward3">Phường 3</option>
                                    </select>
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

                        <div className="mt-4 pt-2">
                            <button className="w-full bg-blue-600 text-white py-2 rounded" type="button" onClick={handlePayment}>
                                Thanh toán
                            </button>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow h-[500px] flex flex-col">
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
    )
}