import { NewServices } from "@/services/NewService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";

export default function NewDetail() {
  const { id } = useParams();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await NewServices.GetOneNew(id);
      
      if (response.data.success) {
        setData(response.data.news);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu tin tức:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to safely render HTML content
  const createMarkup = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-start py-8" style={{ backgroundColor: "#fef6e9" }}>
        <div className="container mx-auto px-4 lg:px-16 xl:px-24 pt-20">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            ) : data ? (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl mx-auto h-[calc(100vh-4rem)]">
                    {data.images && data.images.url && (
                        <div className="w-full h-80 overflow-hidden">
                            <img 
                                src={data.images.url} 
                                alt={data.title} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="p-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">{data.title}</h1>
                        <div className="text-base text-gray-500 mb-8 text-center">
                            {new Date(data.createdAt).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                        <div 
                            className="prose max-w-none text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={createMarkup(data.content)}
                        ></div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-10">
                    <h2 className="text-2xl font-semibold text-gray-700">Không tìm thấy bài viết</h2>
                </div>
            )}
        </div>
    </div>
);
}