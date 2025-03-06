import * as React from "react"
import Header from "../../components/Header/Header"
import { useEffect, useState } from "react";
import Footer from "@/components/footer/footer";
import Stickybutton from "@/components/stickybutton";
import { ProductService } from "@/services/ProductService.js";

export default function ProductPage() {
    // const [isScrolled, setIsScrolled] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchData();
        // const handleScroll = () => {
        //     setIsScrolled(window.scrollY > 0);
        // };
        //
        //
        // window.addEventListener("scroll", handleScroll);
        // return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const fetchData = async () => {
        try {
            const response = await ProductService.getAllProduct()
            if (response.data.success) {
                const formattedData = response.data.products.map((product) => ({
                    id: product._id,
                    name: product.name,
                    imageUrl: product.images,
                    description: product.description,
                    price: product.price,
                    quantity: product.quantity,
                    type: product.type,
                    category:
                        product.categoryId.length > 0 ? product.categoryId[0].name : "Không rõ",
                }));

                setProducts(formattedData);
                // console.log(...formattedData)
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        }
    };

    return (
        <>


            <div className="container mx-auto pt-24">
                <div className="grid grid-cols-4 gap-6 pt-12">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className=" bg-white p-4 border border-black rounded-2xl shadow-md w-[295px] h-[336px]  left-[1113px] top-[257px]"
                        >
                            <div
                                className=" rounded-sm bg-cover bg-darken"
                            >
                                <img src={product.imageUrl[0].url}></img>
                            </div>
                            <h3 className="text-lg font-normal text-gray-800  font-inter">
                                {product.name}
                            </h3>
                            <p className=" font-semibold text-sm">
                                {product.price}
                            </p>
                        </div>
                    ))}
                </div>
            </div>



        </>
    );
}