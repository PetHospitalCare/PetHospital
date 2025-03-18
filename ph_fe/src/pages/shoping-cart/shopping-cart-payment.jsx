import {useEffect, useState} from "react";
import {ProductService} from "@/services/ProductService.js";
import {useLocation, useNavigate} from "react-router-dom";
import {useSearchParams} from "react-router-dom";

export default function ShoppingCartPayment() {
    const location = useLocation();
    // const navigate = useNavigate();
    // const [isScrolled, setIsScrolled] = useState(false);
    // const [filteredProducts, setFilteredProducts] = useState(products);
    //
    // const [searchParams] = useSearchParams();

    useEffect(() => {
        // fetchData();
    }, []);

    // const fetchData = async () => {
    //     try {
    //         const match = location.search.match(/category_id=([^&]+)/);
    //         const categoryIdMatch = match ? match[1] : null;
    //         const response = await ProductService.getAllProduct()
    //
    //         if (response.data.success) {
    //             let formattedData = response.data.products.map((product) => ({
    //                 id: product._id,
    //                 name: product.name,
    //                 imageUrl: product.images,
    //                 description: product.description,
    //                 price: product.price,
    //                 quantity: product.quantity,
    //                 type: product.type,
    //                 category:
    //                     product.categoryId.length > 0 ? product.categoryId[0].name : "Không rõ",
    //                 category_id: product.categoryId
    //             }));
    //
    //             // setProducts(formattedData);
    //
    //             if (categoryIdMatch !== undefined && categoryIdMatch !== null && categoryIdMatch?.trim()?.length > 0) {
    //                 formattedData = formattedData.filter(item =>
    //                     item.category_id.some(categoryItem => categoryItem?._id.toString() === categoryIdMatch)
    //                 );
    //             }
    //
    //             setFilteredProducts(formattedData);
    //             // console.log(...formattedData)
    //         }
    //     } catch (error) {
    //         console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    //     }
    // };


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
                               className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"/>
                        <input type="text" placeholder="Tên thẻ"
                               className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"/>
                        <input type="text" placeholder="Số thẻ"
                               className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"/>

                        <div className="flex gap-4">
                            <input type="text" placeholder="Thời gian hiệu lực (MM/YY)"
                                   className="w-1/2 border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"/>
                            <input type="text" placeholder="CVC"
                                   className="w-1/2 border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>

                        <input type="text" placeholder="Địa chỉ"
                               className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"/>

                        <div className="flex gap-4">
                            <input type="text" placeholder="Thành phố"
                                   className="w-1/3 border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"/>
                            <input type="text" placeholder="Xã/Phường"
                                   className="w-1/3 border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"/>
                            <input type="text" placeholder="Mã bưu chính"
                                   className="w-1/3 border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>

                        <label className="flex items-center gap-2">
                            <input type="checkbox"/>
                            <span>Địa chỉ thanh toán giống với địa chỉ giao hàng</span>
                        </label>

                        <button className="w-full bg-blue-600 text-white py-2 rounded">Thanh toán</button>
                    </form>
                </div>

                {/* Giỏ Hàng */}
                <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Giỏ hàng</h2>

                    <div className="space-y-4">
                        {/* Sản phẩm */}
                        <div className="flex gap-4">
                            <img src="https://via.placeholder.com/80" alt="Product" className="w-16 h-16"/>
                            <div className="flex-1">
                                <p className="font-semibold">Hạt Zoi Dogs</p>
                                <p className="text-gray-500">150.000 VND - 1kg</p>
                                <p className="text-sm">Số lượng: 2</p>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                                <a href="#" className="text-blue-500">Chỉnh sửa</a> | <a href="#"
                                                                                         className="text-red-500">Loại
                                bỏ</a>
                            </div>
                        </div>

                        {/* Mã giảm giá */}
                        <div className="flex justify-between">
                            <input type="text" placeholder="Mã giảm giá"
                                   className="w-2/3 border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"/>
                            <button className="w-1/3 bg-gray-300 py-2 rounded">Áp dụng</button>
                        </div>

                        <p className="text-right font-bold">Tạm tính: 380.000 VND</p>
                    </div>
                </div>
            </div>
        </div>)
}