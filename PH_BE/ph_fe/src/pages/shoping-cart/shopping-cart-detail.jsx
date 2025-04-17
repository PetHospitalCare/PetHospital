import { useState, useEffect, useContext } from "react";
import { ShoppingCartService } from "@/services/ShoppingCartService.js";
import { UserContext } from "@/contexts/UserContext.jsx";
import { updateLocalStorageShoppingCart, useAddToCart } from "@/lib/shopping-cart-util.js";
import { ShoppingCartContext } from "@/contexts/ShoppingCartContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ShoppingCartDetail() {
    const { user } = useContext(UserContext);
    const [cart, setCart] = useState(null);
    const addToCart = useAddToCart();
    const { cartCount, setDataCartContext } = useContext(ShoppingCartContext);
    const { isChangeCart, setDataIsChangeCartContext } = useContext(ShoppingCartContext);
    const navigate = useNavigate();

    // Function to format currency in Vietnamese style
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(amount);
    };

    useEffect(() => {
        makeData();
    }, [user, cartCount, isChangeCart]);

    const makeData = async () => {
        if (user && user._id) {
            // call api get card data
            const response = await ShoppingCartService.getShoppingCartByUserId(user._id);

            if (response.data.success) {
                setCart(response.data?.shoppingCart)
                updateLocalStorageShoppingCart(response.data?.shoppingCart || null, 'replace', null, null)
            }
        } else {
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
        }, setDataCartContext, setDataIsChangeCartContext, order, false);
    }

    const goToPayment = () => {
        if (!user || !user._id) {
            toast.warning('Vui lòng đăng nhập để mua hàng!');
            return;
        }

        if (cart && cart?.items?.length > 0) {
            navigate("/shopping-cart-payment");
        } else {
            toast.warning('Giỏ hàng trống!')
        }
    }

    // Function to handle promo code submission
    const handlePromoCode = (e) => {
        e.preventDefault();
        // You can implement promo code logic here
        // toast.info('Mã khuyến mãi đang được xử lý');
    }

    return (
        <div className="w-full" style={{ backgroundColor: "#fef6e9", minHeight: "calc(100vh - 100px)" }}>
            <div className="w-full" style={{ height: 96 }}></div>
            {/*<div className="w-full" style={{height: 20, backgroundColor: "white"}}></div>*/}
            <div className="ml-4 mr-4 px-4 py-8">
                {/* Main grid with equal height columns */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Left column */}
                    <div className="col-span-2 flex flex-col">
                        <div className="bg-yellow-50 p-4 rounded-lg border border-gray-200 flex-grow shadow-xl" style={{ minHeight: "700px" }}>
                            <img
                                src="/thucung001.jpg"
                                alt="Pet store promotional image"
                                className="w-full h-full rounded-lg object-cover"
                            />
                        </div>
                    </div>

                    {/* Middle and right columns - now wrapped in a single outer border */}
                    <div className="col-span-10">
                        {/* Border wrapper around all elements */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xl" style={{ minHeight: "700px", backgroundColor: "#fef6e9" }}>
                            {/* Breadcrumb at top left */}
                            <div className="grid grid-cols-10 gap-6 mb-8">
                                <div className="col-span-7">
                                    <nav className="text-lg">
                                        <ul className="flex space-x-2">
                                            <li>
                                                <a href="/" className="text-gray-500 hover:underline">Trang chủ</a>
                                            </li>
                                            <li>&gt;</li>
                                            <li className="text-gray-500">Giỏ hàng</li>
                                        </ul>
                                    </nav>
                                </div>
                                <div className="col-span-3">
                                    {/* Empty space to match alignment */}
                                </div>
                            </div>

                            {/* Products and Invoice sections side by side */}
                            <div className="grid grid-cols-10 gap-6">
                                {/* Products section - 7 columns */}
                                <div className="col-span-7">
                                    <div className="bg-white border border-gray-200 rounded-lg p-6 flex-grow flex flex-col shadow-xl" style={{ minHeight: "590px" }}>
                                        <h2 className="text-2xl font-semibold mb-4">Sản phẩm</h2>

                                        {cart?.items && cart.items.length > 0 ? (
                                            <div className="flex flex-col space-y-4 overflow-y-scroll pr-2" style={{ maxHeight: "492px" }}>
                                                {cart.items.map((item, index) => (
                                                    <div className="flex items-center gap-4 border border-gray-200 rounded-lg shadow-md p-1" key={index}>
                                                        <div className="w-24 h-24 flex-shrink-0">
                                                            <img src={item.imageUrl} className="w-full h-full object-contain" alt={item.name} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-sm font-semibold">{item.name}</h3>
                                                            <div className="flex items-center mt-2 justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
                                                                        onClick={() => addToCardFunction(item, 'subtract')}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-current" viewBox="0 0 124 124">
                                                                            <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"></path>
                                                                        </svg>
                                                                    </button>
                                                                    <span className="text-sm">{item.quantity}</span>
                                                                    <button
                                                                        className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center"
                                                                        onClick={() => addToCardFunction(item, 'add')}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-white" viewBox="0 0 42 42">
                                                                            <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"></path>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-semibold">{formatCurrency(item.price)}</span>
                                                                    <button
                                                                        className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                                                                        onClick={() => addToCardFunction(item, 'delete')}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                                                                            <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"></path>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-8 h-full">
                                                <img
                                                    src="/thucung002.jpg"
                                                    alt="Pet products"
                                                    className="mb-4 rounded-lg h-52 object-cover"
                                                />
                                                <p className="text-sm text-gray-600">Giỏ hàng trống, hãy thêm <a href="/product" className="text-blue-500">Sản Phẩm</a> vào giỏ hàng mới!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Invoice section - 3 columns with position adjusted to align with breadcrumb */}
                                <div className="col-span-3" style={{ marginTop: "-56px" }}>  {/* Negative margin to pull it up */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xl">
                                        <h2 className="text-xl w-full font-semibold mb-3 text-center">Hóa đơn</h2>

                                        <div className="space-y-4">
                                            <div className="flex justify-between text-sm">
                                                <span>Giá trị đơn hàng:</span>
                                                <span className="font-medium">{formatCurrency(totalPrice)}</span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span>VAT:</span>
                                                <span className="font-medium">{formatCurrency(0)}</span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span>Phí giao hàng:</span>
                                                <span className="font-medium">{formatCurrency(cart?.shipFee || 0)}</span>
                                            </div>

                                            <div className="pt-2">
                                                <p className="text-sm mb-2">Mã Chiết khấu:</p>
                                                <form onSubmit={handlePromoCode} className="flex">
                                                    <input
                                                        type="text"
                                                        className="w-full border rounded-lg px-3 py-2 text-sm"
                                                        placeholder="Nhập mã khuyến mãi"
                                                    />
                                                </form>
                                            </div>

                                            <div className="pt-2">
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span>Tổng:</span>
                                                    <span>{formatCurrency(totalPrice + (cart?.shipFee || 0))}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span>Số tiền triết khấu:</span>
                                                <span className="font-medium">{formatCurrency(0)}</span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span>Số tiền phải thanh toán:</span>
                                                <span className="font-medium">{formatCurrency(totalPrice + (cart?.shipFee || 0))}</span>
                                            </div>

                                            <div className="mt-4">
                                                <button
                                                    type="button"
                                                    className="w-full py-3 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                    onClick={goToPayment}
                                                >
                                                    Thanh toán
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}