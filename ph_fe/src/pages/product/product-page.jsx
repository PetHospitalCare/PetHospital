import { useEffect, useState } from "react";
import { ProductService } from "@/services/ProductService.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

export default function ProductPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        searchProductsByCategoryId();
    }, [searchParams]);

    const fetchData = async () => {
        try {
            const match = location.search.match(/category_id=([^&]+)/);
            const categoryIdMatch = match ? match[1] : null;
            const response = await ProductService.getAllProduct()

            if (response.data.success) {
                let formattedData = response.data.products.map((product) => ({
                    id: product._id,
                    name: product.name,
                    imageUrl: product.images,
                    description: product.description,
                    price: product.price,
                    quantity: product.quantity,
                    type: product.type,
                    category:
                        product.categoryId.length > 0 ? product.categoryId[0].name : "Không rõ",
                    category_id: product.categoryId
                }));

                setProducts(formattedData);

                if (categoryIdMatch !== undefined && categoryIdMatch !== null && categoryIdMatch?.trim()?.length > 0) {
                    formattedData = formattedData.filter(item =>
                        item.category_id.some(categoryItem => categoryItem?._id.toString() === categoryIdMatch)
                    );
                }

                setFilteredProducts(formattedData);
                // console.log(...formattedData)
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        }
    };

    const searchProductsByText = (textInput) => {
        let tempProducts = products.filter((product) => {
            return product.name.toLowerCase().indexOf(textInput.toLowerCase()) > -1;
        });

        const match = location.search.match(/category_id=([^&]+)/);
        const categoryIdMatch = match ? match[1] : null;

        if (categoryIdMatch !== undefined && categoryIdMatch !== null && categoryIdMatch?.trim()?.length > 0) {
            tempProducts = tempProducts.filter(
                item =>
                    item.category_id.some(categoryItem => categoryItem?._id.toString() === categoryIdMatch)
            );
        }

        setFilteredProducts(tempProducts);
    };

    const searchProductsByCategoryId = () => {
        const match = location.search.match(/category_id=([^&]+)/);
        const categoryIdMatch = match ? match[1] : null;

        if (categoryIdMatch !== undefined && categoryIdMatch !== null && categoryIdMatch?.trim()?.length > 0) {
            const tempProducts = products.filter(
                item =>
                    item.category_id.some(categoryItem => categoryItem?._id.toString() === categoryIdMatch)
            );

            setFilteredProducts(tempProducts);
        } else {
            setFilteredProducts(products)
        }
    };

    const handleInputChange = (e) => {
        const { value } = e.target;
        setSearchText(value);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const newTimeout = setTimeout(() => {
            searchProductsByText(value);
        }, 500);

        setDebounceTimeout(newTimeout);
    };

    const goToDetail = (idInput) => {
        navigate(`/product-detail?product_id=${idInput}`);
    }

    return (
        <div className="bg-gradient-to-bl from-blue-50 to-violet-50 flex items-center justify-center min-h-screen">
            <div className="container mx-auto p-4 pt-40">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="w-72 p-2 pl-10 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchText}
                                onChange={handleInputChange}
                            />
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                        </div>
                    </div>

                    {/*<div className="flex-1 text-right">*/}
                    {/*    <ShoppingCartButton />*/}
                    {/*</div>*/}
                </div>

                {/*<p className="text-3xl font-bold text-center mb-8">PRODUCTS</p>*/}

                {/*<div className="mt-16 min-h-[calc(100vh-200px)]">*/}
                {/*    <div*/}
                {/*        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">*/}
                {/*        {filteredProducts && filteredProducts.map((product) => (*/}
                {/*            <div key={product.id} className="bg-white rounded-[10px] border p-4"*/}
                {/*                 onClick={() => goToDetail(product.id)}>*/}
                {/*                <img src={product.imageUrl[0].url} alt=""*/}
                {/*                     className="w-full h-80 rounded-md object-cover"/>*/}
                {/*                <div className="px-1 py-4">*/}
                {/*                    <div className="font-bold text-xl mb-2 text-center">{product.name}</div>*/}
                {/*                    <p className="text-gray-700 text-base text-center">*/}
                {/*                        <strong>{product.price} VNĐ</strong>*/}
                {/*                    </p>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="container mx-auto px-4 py-16">
                    <h2 className="text-3xl font-bold text-center">Danh Sách Sản Phẩm</h2>
                    <p className="text-center text-gray-500 mt-2">
                        Sản phẩm chất lượng cho thú cưng.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
                        {filteredProducts && filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white shadow-md rounded-lg border border-gray-200 p-4 relative flex flex-col hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                                onClick={() => goToDetail(product.id)}
                            >
                                {/* Ảnh sản phẩm */}
                                <img
                                    src={product.imageUrl[0].url}
                                    alt={product.name}
                                    className="w-full h-60 object-cover rounded-lg"
                                />

                                {/* Nội dung */}
                                <div className="flex-1 flex flex-col justify-between mt-4">
                                    <div>
                                        <p className="text-gray-500 text-sm">{product.category}</p>
                                        <h3 className="text-lg font-semibold">{product.name}</h3>
                                    </div>

                                    {/* Giá tiền */}
                                    <div className="mt-auto pt-3">
                                        {product.price && (
                                            <span className="text-gray-400 line-through mr-2">
                                                {Math.round(product.price * 1.2)} VNĐ
                                            </span>
                                        )}
                                        <span className="text-gray-800 font-bold">{product.price} VNĐ</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}