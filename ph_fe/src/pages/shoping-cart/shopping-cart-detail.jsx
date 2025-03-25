import { useState, useEffect, useContext } from "react";
import { ShoppingCartService } from "@/services/ShoppingCartService.js";
import { UserContext } from "@/contexts/UserContext.jsx";
import { useAddToCart } from "@/lib/shopping-cart-util.js";
import { ShoppingCartContext } from "@/contexts/ShoppingCartContext.jsx";
import { useNavigate } from "react-router-dom";

export default function ShoppingCartDetail() {
    const { user } = useContext(UserContext);
    const [cart, setCart] = useState(null);
    const addToCart = useAddToCart();
    const { cartCount, setDataCartContext } = useContext(ShoppingCartContext);
    const navigate = useNavigate();

    useEffect(() => {
        makeData();
    }, [user, cartCount]);

    // const makeData = () => {
    //     // if userId => setCard by user
    //     // if not userId => setCard by local
    //     // const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    //     // setCart(storedCart);
    // }
    const makeData = async () => {
        if (user && user._id) {
            // call api get card data
            const response = await ShoppingCartService.getShoppingCartByUserId(user._id);

            if (response.data.success) {
                setCart(response.data?.shoppingCart)
            }
        } else {
            // console.log(521565656)
            // get and set card data by localStorage
            const localStorageShoppingCart = localStorage.getItem("cart") || null;

            if (localStorageShoppingCart) {
                setCart(JSON.parse(localStorageShoppingCart))
            } else {
                setCart(null);
            }
        }
    }

    const totalPrice = cart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

    const addToCardFunction = (product, order) => {
        addToCart({
            productId: product.productId,
            quantity: 1,
            price: product.price,
            imageUrl: product.imageUrl,
            name: product.name
        }, setDataCartContext, order);
    }

    const goToPayment = () => {
        navigate("/shopping-cart-payment")
    }

    return (
        <div className="container mx-auto px-4 py-8 pt-32">
            <h1 className="text-2xl font-bold text-slate-900">Your Cart</h1>

            <div className="grid md:grid-cols-3 gap-10 mt-8">
                {/* Giỏ hàng */}
                <div className="md:col-span-2 space-y-4">
                    {cart?.items && cart.items.length > 0 ? (
                        cart.items.map((item, index) => (
                            <div
                                className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-md"
                                key={index}>
                                {/* Ảnh sản phẩm */}
                                <div className="w-28 h-28 shrink-0 max-sm:w-24 max-sm:h-24">
                                    <img src={item.imageUrl} className="w-full h-full object-contain" />
                                </div>

                                {/* Thông tin sản phẩm */}
                                <div className="flex flex-col flex-1">
                                    {/* Tên sản phẩm */}
                                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">{item.name}</h3>

                                    {/* Hàng ngang chứa số lượng, giá và nút xóa */}
                                    <div className="flex justify-between items-center mt-2">
                                        {/* Số lượng */}
                                        <div className="flex items-center gap-3">
                                            {/* Button giảm số lượng */}
                                            <button className="flex items-center justify-center w-6 h-6 bg-slate-400 rounded-full hover:bg-slate-500"
                                                onClick={() => addToCardFunction(item, 'subtract')}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-white" viewBox="0 0 124 124">
                                                    <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"></path>
                                                </svg>
                                            </button>

                                            <span className="font-semibold text-sm">{item.quantity}</span>

                                            {/* Button tăng số lượng */}
                                            <button className="flex items-center justify-center w-6 h-6 bg-slate-800 rounded-full hover:bg-slate-900"
                                                onClick={() => addToCardFunction(item, 'add')}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-white" viewBox="0 0 42 42">
                                                    <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"></path>
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Giá & Nút xóa (căn bên phải) */}
                                        <div className="flex items-center gap-4 ml-auto">
                                            {/* Giá sản phẩm */}
                                            <h3 className="text-sm sm:text-base font-semibold text-slate-900">{item.price} VNĐ</h3>

                                            {/* Nút xóa */}
                                            <button className="w-6 h-6 flex items-center justify-center bg-red-500 rounded-full hover:bg-red-600"
                                                onClick={() => addToCardFunction(item, 'delete')}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                                                    <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Giỏ hàng trống!</p>
                    )}
                </div>

                {/* Thanh toán */}
                <div className="bg-white rounded-lg p-6 shadow-md">
                    <ul className="text-slate-900 font-medium space-y-4">
                        <li className="flex justify-between text-sm">
                            <span>Tổng cộng</span>
                            <span className="font-semibold">{totalPrice} VNĐ</span>
                        </li>
                        <li className="flex justify-between text-sm">
                            <span>Phí giao hàng</span>
                            <span className="font-semibold">{cart?.shipFee || 0} VNĐ</span>
                        </li>
                        <hr className="border-slate-300" />
                        <li className="flex justify-between text-sm font-semibold">
                            <span>Tổng đơn hàng</span>
                            <span>{(totalPrice + cart?.shipFee) || 0} VNĐ</span>
                        </li>
                    </ul>

                    <div className="mt-8">
                        <button type="button"
                            className="w-full py-3 text-sm font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-900"
                            onClick={() => goToPayment()}>
                            Thanh toán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
