import { useEffect, useState } from "react";
import { ProductService } from "@/services/ProductService.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import BookingDialog from "@/components/Booking-modal.jsx";

export default function ProductPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);
    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        applyFiltersFromURL();
    }, [searchParams, products]);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
    }, [filteredProducts, productsPerPage]);

    const fetchData = async () => {
        try {
            const response = await ProductService.getAllProduct()

            if (response.data.success) {
                let formattedData = response.data.products.map((product) => ({
                    id: product._id,
                    name: product.name,
                    imageUrl: product.images,
                    description: product.description,
                    price: product.price,
                    quantity: product.quantity,
                    type: Array.isArray(product.type) ? product.type : [product.type],
                    category:
                        product.categoryId.length > 0 ? product.categoryId[0].name : "Không rõ",
                    category_id: product.categoryId
                }));

                setProducts(formattedData);
                setFilteredProducts(formattedData);
                extractFilters(formattedData);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        }
    };

    const extractFilters = (data) => {
        const uniqueCategories = new Set();
        data.forEach(product => {
            if (product.category_id && product.category_id.length > 0) {
                product.category_id.forEach(cat => {
                    if (cat && cat._id && cat.name) {
                        uniqueCategories.add(JSON.stringify({ id: cat._id, name: cat.name }));
                    }
                });
            }
        });
        const categoryArray = Array.from(uniqueCategories).map(cat => JSON.parse(cat));
        setCategories(categoryArray);

        const typeCounter = {};

        data.forEach(product => {
            if (Array.isArray(product.type)) {
                const uniqueProductTypes = new Set(
                    product.type
                        .filter(Boolean)
                        .map(type => type.trim())
                );

                uniqueProductTypes.forEach(type => {
                    if (typeCounter[type]) {
                        typeCounter[type]++;
                    } else {
                        typeCounter[type] = 1;
                    }
                });
            }
        });

        const typeArray = Object.keys(typeCounter).map(name => ({
            name,
            count: typeCounter[name]
        }));

        typeArray.sort((a, b) => b.count - a.count);

        setProductTypes(typeArray);
    };

    const applyFiltersFromURL = () => {
        if (products.length === 0) return;

        const categoryId = searchParams.get('category_id');
        const type = searchParams.get('type');
        const search = searchParams.get('search');

        if (categoryId) {
            setSelectedCategory(categoryId);
        } else {
            setSelectedCategory('');
        }

        if (type) {
            setSelectedType(type);
        } else {
            setSelectedType('');
        }

        if (search) {
            setSearchText(search);
        } else {
            setSearchText('');
        }

        applyAllFilters(search || '', categoryId || '', type || '');
    };

    const applyAllFilters = (search, categoryId, type) => {
        let tempProducts = [...products];

        if (search && search.trim() !== '') {
            tempProducts = tempProducts.filter(product =>
                product.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (categoryId && categoryId.trim() !== '') {
            tempProducts = tempProducts.filter(item =>
                item.category_id.some(categoryItem => categoryItem?._id.toString() === categoryId)
            );
        }

        if (type && type.trim() !== '') {
            tempProducts = tempProducts.filter(product =>
                Array.isArray(product.type) && product.type.includes(type)
            );
        }

        setFilteredProducts(tempProducts);
        setCurrentPage(1);
    };

    const handleInputChange = (e) => {
        const { value } = e.target;
        setSearchText(value);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const newTimeout = setTimeout(() => {
            updateFiltersInURL(value, selectedCategory, selectedType);
        }, 500);

        setDebounceTimeout(newTimeout);
    };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        updateFiltersInURL(searchText, categoryId, selectedType);
    };

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setSelectedType(type);
        updateFiltersInURL(searchText, selectedCategory, type);
    };

    const updateFiltersInURL = (search, categoryId, type) => {
        const params = new URLSearchParams();

        if (search && search.trim() !== '') {
            params.set('search', search);
        }

        if (categoryId && categoryId.trim() !== '') {
            params.set('category_id', categoryId);
        }

        if (type && type.trim() !== '') {
            params.set('type', type);
        }

        setSearchParams(params);
        applyAllFilters(search, categoryId, type);
    };

    const clearFilters = () => {
        setSearchText('');
        setSelectedCategory('');
        setSelectedType('');
        setSearchParams({});
        setFilteredProducts(products);
        setCurrentPage(1);
    };

    const goToDetail = (idInput) => {
        navigate(`/product-detail?product_id=${idInput}`);
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <>
            <div className="bg-gradient-to-bl from-blue-50 to-violet-50 min-h-screen"
                style={{ backgroundColor: "#fef6e9" }}>
                <div className="w-full p-4 pt-40 relative mx-auto" style={{ backgroundColor: "#fef6e9" }}>
                    <div className="container mx-auto px-0 md:px-24 lg:px-24 xl:px-24 2xl:px-24">
                        <nav className="text-lg px-4 mb-8">
                            <ul className="flex space-x-2">
                                <li>
                                    <a href="/" className="text-blue-500 hover:underline">Trang chủ</a>
                                </li>
                                <li>&gt;</li>

                                <li className="text-gray-500">Sản phẩm</li>
                            </ul>
                        </nav>

                        {/* Quảng cáo bên trái */}
                        <div
                            className="hidden md:block fixed md:left-0 xl:left-0 3xl:left-8 top-1/2 transform -translate-y-1/2
               w-[10%] md:w-[10%] lg:w-[8%] xl:w-[7%] 2xl:w-[8%] [min-width:1740px]:w-[12%] z-10">
                            <div
                                className="mx-1 p-2 3xl:p-4 rounded-lg shadow-md text-black text-center text-xs 3xl:text-sm h-full flex flex-col justify-center"
                                style={{ backgroundColor: "#faf7f1" }}>
                                <h3 className="text-xs 3xl:text-base font-bold">🐾 Ưu Đãi!</h3>
                                {/* Luôn hiển thị văn bản đầy đủ */}
                                <p className="block mt-1 text-xs 3xl:text-sm">Thực phẩm bổ sung giảm <strong>20%</strong>
                                </p>
                                <div
                                    className="mt-2 text-lg md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl 3xl:text-4xl">🛍️
                                </div>
                            </div>
                        </div>

                        {/* Quảng cáo bên phải */}
                        <div
                            className="hidden md:block fixed md:right-0 xl:right-0 3xl:right-8 top-1/2 transform -translate-y-1/2
               w-[10%] md:w-[10%] lg:w-[8%] xl:w-[7%] 2xl:w-[8%] [min-width:1740px]:w-[12%] z-10">
                            <div
                                className="mx-1 p-2 3xl:p-4 rounded-lg shadow-md text-black text-center text-xs 3xl:text-sm h-full flex flex-col justify-center"
                                style={{ backgroundColor: "#faf7f1" }}>
                                <h3 className="text-xs 3xl:text-base font-bold">🦴 Thực phẩm</h3>
                                {/* Luôn hiển thị văn bản đầy đủ */}
                                <p className="block mt-1 text-xs 3xl:text-sm">Chất lượng đảm bảo</p>
                                <div className="mt-2 text-lg md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl 3xl:text-4xl">🍖
                                </div>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-center">Danh Sách Sản Phẩm</h2>

                        {/*<div className="w-full text-center mt-12 px-4">*/}
                        {/*    <div className="p-4 rounded-lg shadow-md text-black" style={{backgroundColor: "#faf7f1"}}>*/}
                        {/*        <h3 className="text-lg font-bold">🐶🐱 Giảm Giá Lớn!</h3>*/}
                        {/*        <p className="text-sm mt-1">Sản phẩm dành cho thú cưng giảm đến <strong>20%</strong> hôm*/}
                        {/*            nay!*/}
                        {/*        </p>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className="w-full text-center mt-12 px-4 relative">
                            <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                {/* Sử dụng thẻ img thay vì background-image */}
                                <img
                                    src="/cho_meo_banner.jpg"
                                    alt="Chăm sóc thú cưng"
                                    className="absolute inset-0 w-full h-full object-cover brightness-[0.7]"
                                />

                                {/* Banner content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                    <h2 className="text-4xl font-bold mb-2">Bạn cần chăm sóc thú cưng?</h2>
                                    <p className="text-lg mb-6">Đăng ký lịch hẹn ngay để thú cưng của bạn được chăm sóc tốt
                                        nhất!</p>
                                    <button
                                        onClick={() => setOpen(true)}
                                        className="bg-purple-800 hover:bg-purple-900 text-white px-6 py-3 rounded-md flex items-center">
                                        <svg className="w-6 h-6 mr-2" fill="white" viewBox="0 0 24 24">
                                            <path d="M19.5,9c-0.7,0-1.4,0.2-2,0.5c-0.5-1.7-2-3-3.8-3c-0.5,0-1,0.1-1.5,0.3C11.3,4.7,9.2,3,6.5,3C4,3,2,5,2,7.5
      c0,1.2,0.5,2.3,1.2,3.1C1.9,11.4,1,12.8,1,14.5C1,17,3,19,5.5,19c0.3,0,0.6,0,0.9-0.1c0.6,1.3,2,2.1,3.5,2.1
      c1.2,0,2.2-0.5,2.9-1.3c0.4,0.2,0.8,0.3,1.3,0.3c1.3,0,2.4-0.9,2.8-2.1c0.3,0.1,0.7,0.1,1.1,0.1c2.5,0,4.5-2,4.5-4.5
      S22,9,19.5,9z"/>
                                        </svg>
                                        Đăng ký lịch hẹn ngay!
                                    </button>
                                </div>
                            </div>
                        </div>


                        <div className="flex items-center bg-white p-4 rounded-lg shadow-md mt-14 w-1/2 ml-4">
                            <div className="relative w-1/2 mr-4">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    value={searchText}
                                    onChange={handleInputChange}
                                />
                                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"></i>

                                {searchText && (
                                    <button
                                        onClick={() => updateFiltersInURL('', selectedCategory, selectedType)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        <i className="fas fa-times-circle"></i>
                                    </button>
                                )}
                            </div>

                            <div className="w-1/2 flex items-center">
                                <select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mr-2"
                                >
                                    <option value="">Danh mục</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={selectedType}
                                    onChange={handleTypeChange}
                                    className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="">Loại</option>
                                    {productTypes.map(type => (
                                        <option key={type.name} value={type.name}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="w-full px-4 py-8">
                            {filteredProducts.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-xl text-gray-500">Không tìm thấy sản phẩm phù hợp với bộ lọc.</p>
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        Xóa bộ lọc
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
                                    {currentProducts && currentProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="bg-white shadow-md rounded-lg border border-gray-200 p-4 relative flex flex-col hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                                            onClick={() => goToDetail(product.id)}
                                        >
                                            <img
                                                src={product.imageUrl[0].url}
                                                alt={product.name}
                                                className="w-full h-60 object-cover rounded-lg"
                                            />

                                            <div className="flex-1 flex flex-col justify-between mt-4">
                                                <div>
                                                    <div className="flex justify-between mb-1">
                                                        <p className="text-gray-500 text-sm">{product.category}</p>
                                                    </div>
                                                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>

                                                    {/* Display all types as tags */}
                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        {Array.isArray(product.type) && product.type.map((type, index) => (
                                                            <span
                                                                key={index}
                                                                className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs"
                                                            >
                                                                {type}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

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
                            )}

                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <nav className="flex items-center">
                                        <button
                                            onClick={prevPage}
                                            disabled={currentPage === 1}
                                            className={`mx-1 px-3 py-2 rounded-md ${currentPage === 1
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                                }`}
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                        </button>

                                        {[...Array(totalPages).keys()].map(number => (
                                            <button
                                                key={number + 1}
                                                onClick={() => paginate(number + 1)}
                                                className={`mx-1 px-4 py-2 rounded-md ${currentPage === number + 1
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-white text-blue-500 hover:bg-blue-100'
                                                    }`}
                                            >
                                                {number + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={nextPage}
                                            disabled={currentPage === totalPages}
                                            className={`mx-1 px-3 py-2 rounded-md ${currentPage === totalPages
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                                }`}
                                        >
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </nav>
                                </div>
                            )}

                            {filteredProducts.length > 0 && (
                                <div className="text-center text-gray-500 mt-4">
                                    Hiển
                                    thị {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, filteredProducts.length)} trong
                                    tổng số {filteredProducts.length} sản phẩm
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <BookingDialog open={open} onClose={() => setOpen(false)} />
        </>
    );
}