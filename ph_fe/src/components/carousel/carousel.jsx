import { useState, useEffect, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { NewServices } from "@/services/NewService";
import { Services } from "@/services/Services";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";

export default function TestimonialAndNews() {
    const [api, setApi] = useState(null);
    const [centerIndex, setCenterIndex] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [services, setServices] = useState([]);
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await Services.getAllService();
                if (response.data.success) {
                    const filteredServices = response.data.services
                        .map(service => ({
                            image: service.publicId,
                            quote: service.description,
                            url: service.url,
                            author: service.name,
                        }));
                    setServices(filteredServices);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách dịch vụ:", error);
            }
        };

        const fetchNews = async () => {
            try {
                const response = await NewServices.GetAllNews();
                if (response.data.success) {
                    const latestNews = [...response.data.news]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 2);

                    setNews(latestNews);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tin tức:", error);
            }
        };

        fetchServices();
        fetchNews();
    }, []);

    useEffect(() => {
        if (selectedIndex !== null) {
            setSelectedIndex(null);
        }
    }, [centerIndex]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (services.length <= 3) {
                        setSelectedIndex(0);
                    }
                }
            },
            { threshold: 0.15 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [services.length]);

    useEffect(() => {
        if (!api || services.length <= 3) return;

        const updateCenterIndex = () => {
            const currentIndex = api.selectedScrollSnap();
            const totalItems = services.length;
            let newIndex = (currentIndex % totalItems + totalItems) % totalItems;
            setCenterIndex(newIndex);
        };

        api.on("select", updateCenterIndex);
        updateCenterIndex();

        return () => api.off("select", updateCenterIndex);
    }, [api, services.length]);

    const nextSlide = () => api?.scrollNext();
    const prevSlide = () => api?.scrollPrev();

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const createMarkup = (htmlContent) => {
        return { __html: DOMPurify.sanitize(htmlContent) };
    };

    return (
        <div className="bg-gradient-to-b from-slate-50 to-slate-100 py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Services Carousel Section - Left Column */}
                    <div ref={containerRef} className="lg:w-1/2 transition-all duration-1000 ease-in-out"
                        style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-[#1a237e] mb-3">Our Services</h2>
                            <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full mb-4"></div>
                            <p className="text-xl font-semibold text-[#1a237e]">{services[selectedIndex ?? centerIndex]?.author}</p>
                        </div>

                        {services.length > 3 ? (
                            <div className="relative">
                                <Carousel opts={{ loop: true }} setApi={setApi}>
                                    <CarouselContent>
                                        {services.map((service, index) => (
                                            <CarouselItem
                                                key={index}
                                                className={`relative h-96 basis-full transition-all duration-500 ${index === centerIndex ? "opacity-100" : "opacity-70"}`}
                                                onClick={() => {
                                                    if (index === centerIndex - 1) prevSlide();
                                                    else if (index === centerIndex + 1) nextSlide();
                                                    else setSelectedIndex(index);
                                                }}
                                            >
                                                <div className="flex justify-center w-full h-full">
                                                    <div className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 ease-in-out"
                                                        style={{
                                                            width: index === centerIndex ? "20rem" : "12rem",
                                                            height: index === centerIndex ? "22rem" : "18rem",
                                                            position: "absolute",
                                                            top: "50%",
                                                            left: "50%",
                                                            transform: `translate(-50%, -50%) ${index === centerIndex ? 'scale(1.05)' : 'scale(1)'}`,
                                                        }}>
                                                        <img
                                                            src={"https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/anh-cho-hai-1.jpg"}
                                                            alt={`Service ${index + 1}`}
                                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
                                                    </div>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                </Carousel>
                                <div className="flex justify-center mt-6 space-x-3">
                                    {services.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => api && api.scrollTo(index)}
                                            className={`transition-all duration-300 ${index === centerIndex
                                                ? "w-6 h-6 bg-blue-600 rounded-full ring-2 ring-blue-300"
                                                : "w-4 h-4 bg-gray-400 rounded-full hover:bg-blue-400"
                                                }`}
                                        ></button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className={`flex justify-center gap-8 flex-wrap transition-all duration-700 ${isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-8"}`}>
                                {services.map((service, index) => (
                                    <div
                                        key={index}
                                        className={`overflow-hidden rounded-3xl shadow-xl cursor-pointer transition-all duration-500 ease-in-out ${selectedIndex === index ? "w-80 h-96" : "w-48 h-72 opacity-70"
                                            }`}
                                        onClick={() => setSelectedIndex(index)}
                                    >
                                        <div className="relative w-full h-full">
                                            <img
                                                src={"https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/anh-cho-hai-1.jpg"}
                                                alt={`Service ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="text-center mt-6 transition-opacity duration-300">
                            <p className="text-gray-600 text-lg italic max-w-2xl mx-auto">"{services[selectedIndex ?? centerIndex]?.quote}"</p>
                        </div>
                    </div>

                    {/* News Section - Right Column */}
                    <div className="lg:w-1/2">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-[#1a237e] mb-3">Latest News</h2>
                            <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full mb-4"></div>
                            <p className="text-lg text-gray-600">Stay updated with our latest information</p>
                        </div>

                        <div className="space-y-6">
                            {news.map((newsItem, index) => (
                                <Link
                                    to={`/new-detail/${newsItem._id}`}
                                    key={index}
                                    className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-blue-50 flex flex-col md:flex-row group"
                                >
                                    <div className="md:w-2/5 h-56 md:h-auto overflow-hidden relative">
                                        <img
                                            src={newsItem.images?.url || "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/anh-cho-hai-1.jpg"}
                                            alt={newsItem.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-lg text-sm font-medium">
                                            {newsItem.createdAt && formatDate(newsItem.createdAt)}
                                        </div>
                                    </div>
                                    <div className="md:w-3/5 p-6">
                                        <h3 className="text-xl font-bold text-[#1a237e] mb-3 group-hover:text-blue-700">{newsItem.title}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3"
                                            dangerouslySetInnerHTML={createMarkup(newsItem?.content)}
                                        ></p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-blue-600 font-medium inline-flex items-center group-hover:text-blue-800 group-hover:underline">
                                                Read Full Article
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:ml-2 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}