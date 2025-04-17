import { useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import { ShoppingCartContext } from "@/contexts/ShoppingCartContext.jsx";
import { useAddToCart } from "@/lib/shopping-cart-util.js";

export default function ({ open, onClose, productData }) {
    const { setDataCartContext } = useContext(ShoppingCartContext);
    const { setDataIsChangeCartContext } = useContext(ShoppingCartContext);
    const addToCart = useAddToCart();
    const [product, setProduct] = useState(productData || {});
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (productData) {
            setProduct(productData);
            setQuantity(productData.quantity || 1);
        }
    }, [productData]);

    const handleIncrement = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) {
            setQuantity(value);
        }
    };

    const addToCardFunction = (product, order) => {
        addToCart({
            productId: product.productId,
            quantity: quantity,
            price: product.price,
            imageUrl: product.imageUrl,
            name: product.name
        }, setDataCartContext, setDataIsChangeCartContext, order, true);
    }

    const handleSetProductQuantity = async () => {
        try {
            await addToCardFunction(productData, 'update');
            onClose();
        } catch (e) {
            toast.error("Có lỗi xảy ra khi chỉnh sửa số lượng sản phẩm!");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl flex flex-col overflow-hidden" style={{ backgroundColor: "#fef6e9" }}>
                <div className="flex flex-1">
                    <div className="w-1/3 bg-gray-50 p-6 flex flex-col" style={{ backgroundColor: "#fef6e9" }}>
                        <div className="flex-grow flex flex-col items-center justify-center">
                            <div className="w-full aspect-square bg-gray-200 rounded overflow-hidden mb-4">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No image
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-2/3 p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-left">Chỉnh sửa số lượng sản phẩm</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-medium text-lg">{product.name || "Tên sản phẩm"}</h3>
                            <p className="text-gray-600 mb-2">{product.price ? `${product.price.toLocaleString('vi-VN')} đ` : "Giá sản phẩm"}</p>
                            <a href={`/product-detail?product_id=${product.productId}`} className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                                Xem chi tiết
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số lượng
                            </label>
                            <div className="flex items-center">
                                <button
                                    onClick={handleDecrement}
                                    className="w-10 h-10 rounded-l border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200"
                                    disabled={quantity <= 1}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={handleInputChange}
                                    className="w-16 h-10 border-t border-b border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleIncrement}
                                    className="w-10 h-10 rounded-r border border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex border-t border-gray-200 p-4">
                    <div className="flex-1 flex justify-start">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Hủy
                        </button>
                    </div>
                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={handleSetProductQuantity}
                            className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}