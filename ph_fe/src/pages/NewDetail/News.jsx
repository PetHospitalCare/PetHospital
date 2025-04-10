import { NewServices } from "@/services/NewService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";

export default function News() {
    const [newsList, setNewsList] = useState([]); // Danh sách bài viết gốc
    const [filteredNews, setFilteredNews] = useState([]); // Danh sách bài viết sau khi lọc
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const itemsPerPage = 9; // Số bài viết mỗi trang

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await NewServices.GetAllNews();
                if (response.data.success) {
                    // Sắp xếp bài viết từ mới nhất đến cũ nhất
                    const sortedNews = response.data.news.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setNewsList(sortedNews);
                    setFilteredNews(sortedNews); // Khởi tạo danh sách lọc
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    // Xử lý tìm kiếm theo tiêu đề
    useEffect(() => {
        const filtered = newsList.filter((news) =>
            news.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredNews(filtered);
        setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
    }, [searchTerm, newsList]);

    // Tính toán bài viết hiển thị trên trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

    // Tổng số trang
    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

    // Hàm chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const createMarkup = (htmlContent) => {
        return { __html: DOMPurify.sanitize(htmlContent) };
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-start py-8" style={{ backgroundColor: "#fef6e9" }}>
            <div className="container mx-auto px-4 lg:px-16 xl:px-24 pt-24">
                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Danh Sách Bài Viết</h1>
                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                ) : currentItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentItems.map((news) => (
                                <Link
                                    to={`/news/${news._id}`}
                                    key={news._id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    {news.images && news.images.url && (
                                        <div className="w-full h-48 overflow-hidden">
                                            <img
                                                src={news.images.url}
                                                alt={news.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-2">{news.title}</h2>
                                        <p className="text-sm text-gray-500 mb-4">
                                            {new Date(news.createdAt).toLocaleDateString("vi-VN", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                        <p className="text-gray-600 mb-4 line-clamp-3"
                                            dangerouslySetInnerHTML={createMarkup(news?.content)}
                                        ></p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {/* Phân trang */}
                        <div className="flex justify-center mt-8">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-4 py-2 mx-1 rounded-lg ${
                                        currentPage === index + 1
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10">
                        <h2 className="text-2xl font-semibold text-gray-700">Không có bài viết nào</h2>
                    </div>
                )}
            </div>
        </div>
    );
}