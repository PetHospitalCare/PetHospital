import { NewServices } from "@/services/NewService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";

export default function News() {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await NewServices.GetAllNews();
                if (response.data.success) {
                    setNewsList(response.data.news);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const createMarkup = (htmlContent) => {
        return { __html: DOMPurify.sanitize(htmlContent) };
    };
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-start py-8 " style={{ backgroundColor: "#fef6e9" }}>
            <div className="container mx-auto px-4 lg:px-16 xl:px-24 pt-24">
                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Danh Sách Bài Viết</h1>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                ) : newsList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newsList.map((news) => (
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
                ) : (
                    <div className="text-center py-10">
                        <h2 className="text-2xl font-semibold text-gray-700">Không có bài viết nào</h2>
                    </div>
                )}
            </div>
        </div>
    );
}