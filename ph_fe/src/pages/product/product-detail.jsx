import * as React from "react"
import {useEffect, useState} from "react";
import {ProductService} from "@/services/ProductService.js";
// import {useLocation} from "react-router-dom";
// import { useSearchParams } from "react-router-dom";

export default function ProductDetail() {
    // const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [product, setProduct] = useState();
    // const [searchParams] = useSearchParams();
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchData();
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    const fetchData = async () => {
        try {
            const match = location.search.match(/product_id=([^&]+)/);
            const productIdMatch = match ? match[1] : null;
            const response = await ProductService.getProductById(productIdMatch);

            if (response.data.success) {
               if(response.data.productData){
                   setProduct(response.data.productData);
               }
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        }
    };

    const handleDecrease = () => {
        setQuantity(prev => Math.max(1, prev - 1));
    };

    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    };

    const setMainImage = (url) => {
        document.getElementById("mainImage").src = url;
    }

    return (
        <div className="bg-gray-100">
            <div className="container mx-auto px-4 py-8 pt-40">
                {product && (
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full md:w-1/2 px-4 mb-8">
                        <img
                            src={product.images?.[0]?.url}
                            alt="Product"
                            className="w-full max-w-[1000px] h-auto max-h-[600px] object-cover rounded-lg shadow-md mb-4"
                            id="mainImage"
                        />

                        <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                            {product.images?.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                                    onClick={() => setMainImage(image.url)}
                                />
                            ))}

                        </div>
                    </div>

                    <div className="w-full md:w-1/2 px-4">
                        <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                        <p className="text-gray-600 mb-4">Mã sản phẩm: 8850477016903</p>
                        <div className="mb-4">
                            <span className="text-2xl font-bold mr-2">{product.price} VNĐ</span>
                            <span className="text-gray-500 line-through">{Math.round(product.price * 1.1)} VNĐ</span>
                        </div>
                        <div className="mb-6 flex items-center space-x-2">
                            <button
                                onClick={handleDecrease}
                                className="w-10 h-8 flex items-center justify-center bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
                            >
                                −
                            </button>

                            <input
                                type="number"
                                value={quantity}
                                readOnly
                                className="w-12 h-8 text-center rounded-md border border-gray-300 shadow-sm focus:outline-none"
                            />

                            <button
                                onClick={handleIncrease}
                                className="w-10 h-8 flex items-center justify-center bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
                            >
                                +
                            </button>
                        </div>

                        <div className="flex space-x-4 mb-6">
                            <button
                                className="bg-indigo-600 flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
                                </svg>
                                Add to Cart
                            </button>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">THÔNG TIN SẢN PHẨM:</h3>
                            <ul className="list-disc list-inside text-gray-700">
                                <li>{product.description}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}