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
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [productsPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [categories, setCategories] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('');
    const [isFiltering, setIsFiltering] = useState(false);
    const [categoryVisibleCounts, setCategoryVisibleCounts] = useState({});
    const [categoryLoadingStates, setCategoryLoadingStates] = useState({});
    const [sortedCategoryProducts, setSortedCategoryProducts] = useState({});

    const sidebarImages = [
        { src: "/thucung001.jpg", alt: "Thức ăn thú cưng" },
        { src: "/thucung002.jpg", alt: "Phụ kiện thú cưng" }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            applyFiltersFromURL();
        }
    }, [searchParams, products]);

    useEffect(() => {
        const isAnyFilterApplied =
            (searchText !== '' && searchText !== null) ||
            (selectedType !== '' && selectedType !== null);

        setIsFiltering(isAnyFilterApplied);

        if (selectedCategory && !isAnyFilterApplied) {
            const categoryProducts = products.filter(product =>
                product.category_id && product.category_id.some(cat => cat && cat._id === selectedCategory)
            );

            let sortedProducts = [...categoryProducts];
            if (sortOrder === 'price-asc') {
                sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
            } else if (sortOrder === 'price-desc') {
                sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
            }

            setFilteredProducts(sortedProducts);
            setDisplayedProducts(sortedProducts.slice(0, productsPerPage));
            setCurrentPage(1);
            setHasMore(sortedProducts.length > productsPerPage);
        } else if (isAnyFilterApplied || selectedCategory) {
            setDisplayedProducts(filteredProducts.slice(0, productsPerPage));
            setCurrentPage(1);
            setHasMore(filteredProducts.length > productsPerPage);
        } else {
            setDisplayedProducts([]);
            setCurrentPage(1);
            setHasMore(false);

            const initialCounts = {};
            categories.forEach(category => {
                initialCounts[category.id] = productsPerPage;
            });
            setCategoryVisibleCounts(initialCounts);

            applySortingToAllCategories();
        }
    }, [filteredProducts, selectedCategory, productsPerPage, products, searchText, selectedType, sortOrder, categories]);

    useEffect(() => {
        if (products.length > 0 && categories.length > 0) {
            const initialCounts = {};
            categories.forEach(category => {
                initialCounts[category.id] = productsPerPage;
            });
            setCategoryVisibleCounts(initialCounts);

            applySortingToAllCategories();
        }
    }, [products, categories, productsPerPage, sortOrder]);

    const applySortingToAllCategories = () => {
        const sorted = {};
        categories.forEach(category => {
            const categoryProducts = products.filter(product =>
                product.category_id && product.category_id.some(cat => cat && (cat._id === category.id || cat.id === category.id))
            );

            let sortedCatProducts = [...categoryProducts];
            if (sortOrder === 'price-asc') {
                sortedCatProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
            } else if (sortOrder === 'price-desc') {
                sortedCatProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
            }

            sorted[category.id] = sortedCatProducts;
        });

        setSortedCategoryProducts(sorted);
    };

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
                setDisplayedProducts(formattedData.slice(0, productsPerPage));
                extractFilters(formattedData);
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

        categoryArray.sort((a, b) => a.name.localeCompare(b.name));
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
        const sort = searchParams.get('sort');

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

        if (sort) {
            setSortOrder(sort);
        } else {
            setSortOrder('');
        }

        applyAllFilters(search || '', categoryId || '', type || '', sort || '');
    };

    const applyAllFilters = (search, categoryId, type, sort) => {
        let tempProducts = [...products];

        if (search && search.trim() !== '') {
            tempProducts = tempProducts.filter(product =>
                product.name && product.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (categoryId && categoryId.trim() !== '') {
            tempProducts = tempProducts.filter(item =>
                item.category_id && item.category_id.some(categoryItem =>
                    categoryItem && (categoryItem._id?.toString() === categoryId || categoryItem.id?.toString() === categoryId))
            );
        }

        if (type && type.trim() !== '') {
            tempProducts = tempProducts.filter(product =>
                Array.isArray(product.type) && product.type.includes(type)
            );
        }

        let sortedProducts = [...tempProducts];

        if (sort === 'price-asc') {
            sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sort === 'price-desc') {
            sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else {
            sortedProducts = tempProducts;
        }

        setFilteredProducts(sortedProducts);
        setHasMore(sortedProducts.length > productsPerPage);
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

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        updateFiltersInURL(searchText, categoryId, selectedType);
    };

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setSelectedType(type);
        updateFiltersInURL(searchText, selectedCategory, type, sortOrder);
    };

    const handleSortChange = (e) => {
        const sort = e.target.value;
        setSortOrder(sort);
        updateFiltersInURL(searchText, selectedCategory, selectedType, sort);
    };

    const updateFiltersInURL = (search, categoryId, type, sort = sortOrder) => {
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

        if (sort && sort.trim() !== '') {
            params.set('sort', sort);
        }

        setSearchParams(params);
        applyAllFilters(search, categoryId, type, sort);
    };

    const clearFilters = () => {
        setSearchText('');
        setSelectedType('');
        setSortOrder('');
        setSelectedCategory('');

        const initialCounts = {};
        categories.forEach(category => {
            initialCounts[category.id] = productsPerPage;
        });
        setCategoryVisibleCounts(initialCounts);

        updateFiltersInURL('', '', '', '');
    };

    const goToDetail = (idInput) => {
        navigate(`/product-detail?product_id=${idInput}`);
    };

    const loadMoreProducts = () => {
        setIsLoading(true);

        setTimeout(() => {
            const nextPage = currentPage + 1;
            const startIndex = displayedProducts.length;
            const endIndex = startIndex + productsPerPage;

            let productsToAdd = [];
            if (isFiltering || selectedCategory) {
                productsToAdd = filteredProducts.slice(startIndex, endIndex);
                setHasMore(endIndex < filteredProducts.length);
            } else {
                const allProducts = products.filter(product =>
                    !selectedCategory || (product.category_id && product.category_id.some(cat => cat && (cat._id === selectedCategory || cat.id === selectedCategory)))
                );
                productsToAdd = allProducts.slice(startIndex, endIndex);
                setHasMore(endIndex < allProducts.length);
            }

            const newDisplayedProducts = [...displayedProducts, ...productsToAdd];
            setDisplayedProducts(newDisplayedProducts);
            setCurrentPage(nextPage);
            setIsLoading(false);
        }, 500);
    };

    const loadMoreProductsForCategory = (categoryId) => {
        setCategoryLoadingStates(prev => ({
            ...prev,
            [categoryId]: true
        }));

        setTimeout(() => {
            const currentCount = categoryVisibleCounts[categoryId] || productsPerPage;

            const categoryProductsAll = sortedCategoryProducts[categoryId] ||
                products.filter(product =>
                    product.category_id && product.category_id.some(cat => cat && (cat._id === categoryId || cat.id === categoryId))
                );

            const newCount = Math.min(currentCount + productsPerPage, categoryProductsAll.length);

            setCategoryVisibleCounts(prev => ({
                ...prev,
                [categoryId]: newCount
            }));

            setCategoryLoadingStates(prev => ({
                ...prev,
                [categoryId]: false
            }));
        }, 500);
    };

    const formatPrice = (price) => {
        if (price === null || price === undefined) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(price);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const getProductsToShow = (categoryId) => {
        if (!categoryId) return [];

        const visibleCount = categoryVisibleCounts[categoryId] || productsPerPage;

        if (sortedCategoryProducts[categoryId]) {
            return sortedCategoryProducts[categoryId].slice(0, visibleCount);
        }

        const categoryProducts = products.filter(product =>
            product.category_id && product.category_id.some(cat => cat && (cat._id === categoryId || cat.id === categoryId))
        );

        let sortedProducts = [...categoryProducts];
        if (sortOrder === 'price-asc') {
            sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortOrder === 'price-desc') {
            sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        }

        return sortedProducts.slice(0, visibleCount);
    };

    return (
        <>
            <div className="grid grid-cols-12 bg-gradient-to-bl from-blue-50 to-violet-50 min-h-screen" style={{ backgroundColor: "#fef6e9" }}>
                <div className="col-span-2 hidden md:block relative pt-36" style={{ backgroundColor: "#fef6e9" }}>
                    <div className="sticky top-20 p-4">
                        <div className="bg-yellow-50 p-4 rounded-lg shadow-md">
                            <img
                                src="/thucung003.jpg"
                                alt="Pet store promotional image"
                                className="w-full rounded-lg object-cover"
                            />
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg shadow-md mt-3">
                            <img
                                src="/thucung004.jpg"
                                alt="Pet store promotional image"
                                className="w-full rounded-lg object-cover"
                            />
                        </div>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-10 p-4 pt-36" style={{ backgroundColor: "#fef6e9" }}>
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                        <nav className="text-lg mb-8">
                            <ul className="flex space-x-2">
                                <li>
                                    <a href="/" className="text-blue-500 hover:underline">Trang chủ</a>
                                </li>
                                <li>&gt;</li>
                                <li className="text-gray-500">Cửa hàng</li>
                            </ul>
                        </nav>

                        <div className="mb-8">
                            <div className="md:w-auto">
                                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                    <img
                                        src="/cho_meo_banner.jpg"
                                        alt="Chăm sóc thú cưng"
                                        className="absolute inset-0 w-full h-full object-fill brightness-[0.7]"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                        <h2 className="text-3xl md:text-4xl font-bold mb-2">Bạn cần chăm sóc thú cưng?</h2>
                                        <p className="text-lg mb-6">Đăng ký lịch hẹn ngay để thú cưng của bạn được chăm sóc tốt nhất!</p>
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
                            <div className="clear-both"></div>
                        </div>

                        <div className="flex flex-wrap mb-8">
                            <div className="hidden md:block md:w-1/6 lg:w-1/5 mr-6"></div>

                            <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-3 ml-auto" style={{ right: 0 }}>
                                <div className="flex flex-wrap items-center">
                                    <div className="w-full md:w-3/12 pr-2">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Tìm kiếm sản phẩm..."
                                                className="w-full p-2 pl-8 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={searchText}
                                                onChange={handleInputChange}
                                            />
                                            <i className="fas fa-search absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"></i>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-2/12 px-1 mt-2 md:mt-0">
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => handleCategoryChange(e.target.value)}
                                            className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Tất cả danh mục</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-full md:w-2/12 px-1 mt-2 md:mt-0">
                                        <select
                                            value={selectedType}
                                            onChange={handleTypeChange}
                                            className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Tất cả loại</option>
                                            {productTypes.map(type => (
                                                <option key={type.name} value={type.name}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-full md:w-3/12 px-1 mt-2 md:mt-0">
                                        <select
                                            value={sortOrder}
                                            onChange={handleSortChange}
                                            className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sắp xếp theo</option>
                                            <option value="price-asc">Giá: Thấp đến cao</option>
                                            <option value="price-desc">Giá: Cao đến thấp</option>
                                        </select>
                                    </div>

                                    <div className="w-full md:w-2/12 pl-2 mt-2 md:mt-0">
                                        <button
                                            onClick={clearFilters}
                                            className="w-full p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-md border border-gray-300 shadow-sm"
                                        >
                                            Xóa bộ lọc
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="md:hidden mb-4">
                                <button
                                    onClick={toggleFilters}
                                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center"
                                >
                                    <i className="fas fa-filter mr-2"></i>
                                    {showFilters ? 'Ẩn bộ lọc' : 'Hiển thị bộ lọc'}
                                </button>
                            </div>

                            {showFilters && (
                                <div className="md:hidden mb-6 p-4 bg-white rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold mb-4">Bộ lọc</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tìm kiếm sản phẩm
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Tìm kiếm sản phẩm..."
                                                    className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={searchText}
                                                    onChange={handleInputChange}
                                                />
                                                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Danh mục sản phẩm
                                            </label>
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => handleCategoryChange(e.target.value)}
                                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Tất cả danh mục</option>
                                                {categories.map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Loại sản phẩm
                                            </label>
                                            <select
                                                value={selectedType}
                                                onChange={handleTypeChange}
                                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Tất cả loại</option>
                                                {productTypes.map(type => (
                                                    <option key={type.name} value={type.name}>
                                                        {type.name} ({type.count})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Sắp xếp theo
                                            </label>
                                            <select
                                                value={sortOrder}
                                                onChange={handleSortChange}
                                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Mặc định</option>
                                                <option value="price-asc">Giá: Thấp đến cao</option>
                                                <option value="price-desc">Giá: Cao đến thấp</option>
                                            </select>
                                        </div>

                                        <button
                                            onClick={clearFilters}
                                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors border border-gray-300"
                                        >
                                            Xóa bộ lọc
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isFiltering ? (
                                <div className="mb-12">
                                    <div className="mb-4">
                                        <h3 className="inline-block text-xl font-semibold px-4 py-2 text-white border border-brown-700 rounded-t-lg shadow-sm" style={{backgroundColor: 'brown'}}>
                                            Sản phẩm
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                                        {displayedProducts.length > 0 ? displayedProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="bg-white shadow-md rounded-lg border border-gray-200 p-3 relative flex flex-col hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                                                onClick={() => goToDetail(product.id)}
                                            >
                                                <img
                                                    src={product.imageUrl && product.imageUrl[0] ? product.imageUrl[0].url : '/placeholder-image.jpg'}
                                                    alt={product.name || 'Sản phẩm'}
                                                    className="w-full h-48 object-cover rounded-lg"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/placeholder-image.jpg';
                                                    }}
                                                />

                                                <div className="flex-1 flex flex-col justify-between mt-3">
                                                    <div>
                                                        <div className="flex justify-between mb-1">
                                                            <p className="text-gray-500 text-xs">{product.category}</p>
                                                        </div>
                                                        <h3 className="text-base font-semibold mb-1 line-clamp-2">{product.name}</h3>

                                                        <div className="flex flex-wrap gap-1 mb-1">
                                                            {Array.isArray(product.type) && product.type.map((type, index) => (
                                                                type && (
                                                                    <span
                                                                        key={index}
                                                                        className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full text-xs border border-blue-200"
                                                                    >
                                                                        {type}
                                                                    </span>
                                                                )
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="mt-auto pt-2">
                                                        {product.price && (
                                                            <span className="text-gray-400 text-xs line-through mr-1">
                                                                {formatPrice(Math.round(product.price * 1.2))}
                                                            </span>
                                                        )}
                                                        <span className="text-gray-800 font-bold text-sm">{formatPrice(product.price)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="col-span-5 text-center py-12 bg-white rounded-lg shadow-md">
                                                <p className="text-xl text-gray-500">Không tìm thấy sản phẩm phù hợp với bộ lọc.</p>
                                                <button
                                                    onClick={clearFilters}
                                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors border border-blue-600"
                                                >
                                                    Xóa bộ lọc
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {hasMore && displayedProducts.length > 0 && (
                                        <div className="text-center mt-6">
                                            <button
                                                onClick={loadMoreProducts}
                                                disabled={isLoading}
                                                className={`px-5 py-2 rounded-md font-medium border ${
                                                    isLoading
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400'
                                                        : 'bg-blue-500 text-white hover:bg-blue-600 border-blue-600'
                                                }`}
                                            >
                                                {isLoading ? (
                                                    <span className="flex items-center justify-center">
                                                        <i className="fas fa-spinner fa-spin mr-2"></i> Đang tải...
                                                    </span>
                                                ) : (
                                                    'Xem thêm'
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                categories.map((category) => {
                                    if (selectedCategory && selectedCategory !== category.id) return null;

                                    const productsToShow = getProductsToShow(category.id);

                                    if (productsToShow.length === 0) return null;

                                    const visibleCount = categoryVisibleCounts[category.id] || productsPerPage;

                                    const categoryProductsAll = sortedCategoryProducts[category.id] ||
                                        products.filter(product =>
                                            product.category_id && product.category_id.some(cat => cat && (cat._id === category.id || cat.id === category.id))
                                        );

                                    const hasMoreCategoryProducts = categoryProductsAll.length > visibleCount;
                                    const isCategoryLoading = categoryLoadingStates[category.id] || false;

                                    return (
                                        <div key={category.id} className="mb-12">
                                            <div className="mb-4">
                                                <h3 className="inline-block text-xl font-semibold px-4 py-2 text-white border border-brown-700 rounded-t-lg shadow-sm" style={{backgroundColor: 'brown'}}>
                                                    {category.name}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                                                {productsToShow.map((product) => (
                                                    <div
                                                        key={product.id}
                                                        className="bg-white shadow-md rounded-lg border border-gray-200 p-3 relative flex flex-col hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                                                        onClick={() => goToDetail(product.id)}
                                                    >
                                                        <img
                                                            src={product.imageUrl && product.imageUrl[0] ? product.imageUrl[0].url : '/placeholder-image.jpg'}
                                                            alt={product.name || 'Sản phẩm'}
                                                            className="w-full h-48 object-cover rounded-lg"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/placeholder-image.jpg';
                                                            }}
                                                        />

                                                        <div className="flex-1 flex flex-col justify-between mt-3">
                                                            <div>
                                                                <div className="flex justify-between mb-1">
                                                                    <p className="text-gray-500 text-xs">{product.category}</p>
                                                                </div>
                                                                <h3 className="text-base font-semibold mb-1 line-clamp-2">{product.name}</h3>

                                                                <div className="flex flex-wrap gap-1 mb-1">
                                                                    {Array.isArray(product.type) && product.type.map((type, index) => (
                                                                        type && (
                                                                            <span
                                                                                key={index}
                                                                                className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full text-xs border border-blue-200"
                                                                            >
                                                                                {type}
                                                                            </span>
                                                                        )
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="mt-auto pt-2">
                                                                {product.price && (
                                                                    <span className="text-gray-400 text-xs line-through mr-1">
                                                                        {formatPrice(Math.round(product.price * 1.2))}
                                                                    </span>
                                                                )}
                                                                <span className="text-gray-800 font-bold text-sm">{formatPrice(product.price)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {!selectedCategory && hasMoreCategoryProducts && (
                                                <div className="text-center mt-4">
                                                    <button
                                                        onClick={() => loadMoreProductsForCategory(category.id)}
                                                        disabled={isCategoryLoading}
                                                        className={`text-blue-500 hover:bg-blue-50 border border-blue-300 px-4 py-2 rounded-md inline-block 
                                                            ${isCategoryLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {isCategoryLoading ? (
                                                            <span className="flex items-center justify-center">
                                                                <i className="fas fa-spinner fa-spin mr-2"></i> Đang tải...
                                                            </span>
                                                        ) : (
                                                            'Xem thêm'
                                                        )}
                                                    </button>
                                                </div>
                                            )}

                                            {selectedCategory === category.id && hasMore && (
                                                <div className="text-center mt-6">
                                                    <button
                                                        onClick={loadMoreProducts}
                                                        disabled={isLoading}
                                                        className={`px-5 py-2 rounded-md font-medium border ${
                                                            isLoading
                                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400'
                                                                : 'bg-blue-500 text-white hover:bg-blue-600 border-blue-600'
                                                        }`}
                                                    >
                                                        {isLoading ? (
                                                            <span className="flex items-center justify-center">
                                                                <i className="fas fa-spinner fa-spin mr-2"></i> Đang tải...
                                                            </span>
                                                        ) : (
                                                            'Xem thêm'
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}

                            {!isFiltering && !categories.some(category =>
                                (selectedCategory ? category.id === selectedCategory : true) &&
                                products.filter(product =>
                                    product.category_id && product.category_id.some(cat => cat && (cat._id === category.id || cat.id === category.id))
                                ).length > 0
                            ) && (
                                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                                    <p className="text-xl text-gray-500">Không tìm thấy sản phẩm phù hợp với bộ lọc.</p>
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors border border-blue-600"
                                    >
                                        Xóa bộ lọc
                                    </button>
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