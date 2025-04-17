import { useState, useEffect } from "react";
import { ProductService } from "@/services/ProductService.js";
import { useNavigate } from "react-router-dom";

export default function TrendingProducts() {
    const navigate = useNavigate();
    const [trendingProducts, setTrendingProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ProductService.getTrendingProducts();

                if (response?.data?.success && response?.data?.trendingProducts?.length > 0) {
                    setTrendingProducts(response.data.trendingProducts);
                } else {
                    setTrendingProducts([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách xu hướng sản phẩm:", error);
            }
        };

        fetchData();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const gotoDetail = (id) => {
        navigate(`/product-detail?product_id=${id}`);
    }

    return (
        <>
            {trendingProducts && trendingProducts.length > 0 && (
                <div className="bg-gradient-to-b from-slate-50 to-slate-100 py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sản Phẩm Xu Hướng</h2>
                            <p className="text-gray-600">Những sản phẩm được yêu thích nhất</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {trendingProducts.map((product) => (
                                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer" onClick={() => gotoDetail(product._id)}>
                                    <div className="h-64 overflow-hidden relative">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-contain rounded-t-lg"
                                        />
                                    </div>

                                    <div className="p-4 text-center">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 truncate">{product.name}</h3>

                                        <div className="flex justify-center items-center">
                                            <span className="text-lg font-bold text-red-600">{formatPrice(product.price)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}