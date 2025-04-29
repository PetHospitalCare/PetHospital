import { NewServices } from "@/services/NewService";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";

export default function NewDetail() {
  const { id } = useParams();
  const [data, setData] = useState();
  const [relatedNews, setRelatedNews] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    fetchAllNews();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await NewServices.GetOneNew(id);
      if (response.data?.success) {
        setData(response.data?.news);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu tin tức:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllNews = async () => {
    try {
      const response = await NewServices.GetAllNews();
      if (response.data?.success) {
        const filteredNews = response.data?.news
          ?.filter((news) => news?._id !== id)
          ?.slice(0, 5); // Hiển thị 5 bài viết mới nhất
        setRelatedNews(filteredNews);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tin tức:", error);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await NewServices.GetAllNews();
      if (response.data?.success) {
        const filteredResults = response.data?.news?.filter((news) =>
          news?.title?.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(filteredResults);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm bài viết:", error);
    }
  };

  const createMarkup = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-24" style={{ backgroundColor: "#fef6e9" }}>
      {/* Thêm pt-24 để đẩy nội dung xuống dưới header */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="bg-[#fef6e9] py-2 px-4 mb-6 rounded-md">
          <nav className="flex text-sm">
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700 truncate">{data?.title || "Chi tiết bài viết"}</span>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : data ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 p-6 border-b">
                  {data?.title}
                </h1>

                <div className="flex items-center px-6 py-3 text-sm text-gray-500 border-b">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {formatDate(data?.createdAt)}
                </div>

                {data?.images?.url && (
                  <div className="p-6">
                    <img
                      src={data?.images?.url}
                      alt={data?.title}
                      className="w-full h-auto object-cover rounded-md"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={createMarkup(data?.content)}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700">Không tìm thấy bài viết</h2>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="bg-blue-600 text-white py-3 px-4 font-bold">TÌM KIẾM</div>
              <div className="p-4">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài viết..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full border rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button className="bg-pink-500 text-white px-4 py-2 rounded-r-md hover:bg-pink-600 focus:outline-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
                {/* Search Results */}
                <div className="divide-y mt-4">
                  {searchResults?.map((news) => (
                    <div key={news?._id} className="p-4 hover:bg-gray-50">
                      <Link to={`/new-detail/${news?._id}`} className="flex gap-3">
                        {news?.images?.url ? (
                          <img
                            src={news?.images?.url}
                            alt={news?.title}
                            className="w-20 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 hover:text-blue-600 line-clamp-2">
                            {news?.title}
                          </h3>
                          <div className="text-xs text-gray-500 mt-1">{formatDate(news?.createdAt)}</div>
                        </div>
                      </Link>
                    </div>
                  ))}
                  {searchResults?.length === 0 && searchTerm && (
                    <div className="p-4 text-center text-gray-500">Không tìm thấy bài viết</div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-pink-500 text-white py-3 px-4 font-bold">BÀI VIẾT MỚI NHẤT</div>
              <div className="divide-y">
                {relatedNews?.map((news) => (
                  <div key={news?._id} className="p-4 hover:bg-gray-50">
                    <Link to={`/new-detail/${news?._id}`} className="flex gap-3">
                      {news?.images?.url ? (
                        <img
                          src={news?.images?.url}
                          alt={news?.title}
                          className="w-20 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 hover:text-blue-600 line-clamp-2">
                          {news?.title}
                        </h3>
                        <div className="text-xs text-gray-500 mt-1">{formatDate(news?.createdAt)}</div>
                      </div>
                    </Link>
                  </div>
                ))}

                {relatedNews?.length === 0 && (
                  <div className="p-4 text-center text-gray-500">Không có bài viết liên quan</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}