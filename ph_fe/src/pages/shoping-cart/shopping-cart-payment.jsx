import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext.jsx";
import { ShoppingCartService } from "@/services/ShoppingCartService.js";

export default function ShoppingCartPayment() {
    const [cart, setCart] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        makeData()
    }, []);


    const handlePayment = async () => {
        event.preventDefault();
        console.log(11212)
        if (user && user._id && cart) {
            const response = await ShoppingCartService.paymentShoppingCartByUserId(user._id, cart);
            console.log('response: ', response)
        }
    }

    const makeData = () => {
        const cartLocal = localStorage.getItem("cart");

        if (cartLocal) {
            setCart(JSON.parse(cartLocal));
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 pt-32">
            {/* Bố cục chung */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Form Thanh Toán */}
                <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Thanh toán</h2>

                    <button className="w-full bg-black text-white py-2 rounded mb-4">QR Code</button>
                    <p className="text-center text-gray-500 mb-4">or</p>

                    <form className="space-y-4">
                        <input type="email" placeholder="Địa chỉ email"
                            className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
                            disabled value={user && user.email} />
                        <input type="text" placeholder="Tên thẻ"
                            className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="text" placeholder="Số thẻ"
                            className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" />

                        <div className="flex gap-4">
                            <input type="text" placeholder="Thời gian hiệu lực (MM/YY)"
                                className="w-1/2 border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" />
                            <input type="text" placeholder="CVC"
                                className="w-1/2 border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <input type="text" placeholder="Địa chỉ"
                            className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
                            value={user && user.address} />

                        <div className="flex gap-4">
                            <input type="text" placeholder="Thành phố"
                                className="w-1/3 border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" />
                            <input type="text" placeholder="Xã/Phường"
                                className="w-1/3 border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" />
                            <input type="text" placeholder="Mã bưu chính"
                                className="w-1/3 border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            <span>Địa chỉ thanh toán giống với địa chỉ giao hàng</span>
                        </label>

                        <button className="w-full bg-blue-600 text-white py-2 rounded" type="button" onClick={handlePayment}>Thanh
                            toán
                        </button>
                    </form>
                </div>

                {/* Giỏ Hàng */}
                <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Giỏ hàng</h2>

                    <div className="space-y-4">
                        {/* Sản phẩm */}
                        {cart?.items && cart.items.length > 0 && (
                            cart.items.map((item, index) => (
                                <div className="flex gap-4" key={index}>
                                    <img src={item.imageUrl} alt="Product" className="w-16 h-16" />
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-gray-500">{item.price}</p>
                                        <p className="text-sm">Số lượng: {item.quantity}</p>
                                    </div>
                                    <div className="text-right text-sm text-gray-500">
                                        <a className="text-blue-500">Chỉnh sửa</a> | <a
                                            className="text-red-500">Loại
                                            bỏ</a>
                                    </div>
                                </div>
                            )))}

                        {/* Mã giảm giá */}
                        <div className="flex justify-between">
                            <input type="text" placeholder="Mã giảm giá"
                                className="w-2/3 border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500" />
                            <button className="w-1/3 bg-gray-300 py-2 rounded ml-3">Áp dụng</button>
                        </div>

                        <p className="text-right font-bold">{cart && cart?.totalPrice ? cart.totalPrice : 0} VNĐ</p>
                    </div>
                </div>
            </div>
        </div>)
}