import { useState, useEffect, useContext } from "react";
import { ShoppingCartService } from "@/services/ShoppingCartService.js";
import { UserContext } from "@/contexts/UserContext.jsx";
import { useAddToCart } from "@/lib/shopping-cart-util.js";
import { ShoppingCartContext } from "@/contexts/ShoppingCartContext.jsx";

export default function ShoppingCartDetail() {
    const { user } = useContext(UserContext);
    const [cart, setCart] = useState(null);
    const addToCart = useAddToCart();
    const { cartCount, setDataCartContext } = useContext(ShoppingCartContext);

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
            // get and set card data by localStorage
        }
    }

    const totalPrice = cart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

    const addToCardFunction = (product) => {
        addToCart({
            productId: product.productId,
            quantity: 1,
            price: product.price,
            imageUrl: product.imageUrl,
            name: product.name
        }, setDataCartContext);
    }

    return (
        <div className="max-w-5xl max-md:max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-slate-900 pt-40">Your Cart</h1>
            <div className="grid md:grid-cols-3 gap-10 mt-8">
                <div className="md:col-span-2 space-y-4">
                    {cart?.items && cart.items.length > 0 ? (
                        cart.items.map((item, index) => (
                            <div
                                className="flex gap-4 bg-white px-4 py-6 rounded-md shadow-[0_2px_12px_-3px_rgba(61,63,68,0.3)]"
                                key={index}>
                                <div className="flex gap-4">
                                    <div className="w-28 h-28 max-sm:w-24 max-sm:h-24 shrink-0">
                                        <img src={item.imageUrl}
                                            className="w-full h-full object-contain" />
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <h3 className="text-sm sm:text-base font-semibold text-slate-900">{item.name}</h3>
                                        </div>

                                        <div className="mt-auto flex items-center gap-3">
                                            <button type="button"
                                                className="flex items-center justify-center w-5 h-5 bg-slate-400 outline-none rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-2 fill-white"
                                                    viewBox="0 0 124 124">
                                                    <path
                                                        d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                                                        data-original="#000000"></path>
                                                </svg>
                                            </button>
                                            <span
                                                className="font-semibold text-sm leading-[18px]">{item.quantity}</span>
                                            <button type="button"
                                                className="flex items-center justify-center w-5 h-5 bg-slate-800 outline-none rounded-full"
                                                onClick={() => addToCardFunction(item)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-2 fill-white"
                                                    viewBox="0 0 42 42">
                                                    <path
                                                        d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                                                        data-original="#000000"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-auto flex flex-col">
                                    <div className="flex items-start gap-4 justify-end">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            className="w-4 h-4 cursor-pointer fill-slate-400 hover:fill-red-600 inline-block"
                                            viewBox="0 0 24 24">
                                            <path
                                                d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                                data-original="#000000"></path>
                                            <path
                                                d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 mt-auto">{item.price} VNĐ</h3>
                                </div>
                            </div>
                        ))) : (
                        <p className="text-center text-gray-500">Giỏ hàng trống !</p>
                    )}

                </div>

                <div className="bg-white rounded-md px-4 py-6 h-max shadow-[0_2px_12px_-3px_rgba(61,63,68,0.3)]">
                    <ul className="text-slate-900 font-medium space-y-4">
                        <li className="flex flex-wrap gap-4 text-sm">Tổng cộng<span
                            className="ml-auto font-semibold">{totalPrice} VNĐ</span></li>
                        <li className="flex flex-wrap gap-4 text-sm">Phí giao hàng<span
                            className="ml-auto font-semibold">{cart?.shipFee | 0} VNĐ</span></li>
                        <hr className="border-slate-300" />
                        <li className="flex flex-wrap gap-4 text-sm font-semibold">Tổng đơn hàng <span
                            className="ml-auto">{(totalPrice + cart?.shipFee) | 0} VNĐ</span></li>
                    </ul>

                    <div className="mt-8 space-y-2">
                        <button type="button"
                            className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-slate-800 hover:bg-slate-900 text-white rounded-md">Thanh
                            toán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
