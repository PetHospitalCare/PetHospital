import { useState, useEffect, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import axios from "axios";
export default function TestimonialCarousel() {

    const [api, setApi] = useState(null);
    const [centerIndex, setCenterIndex] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:9999/service/get-all");
                if (response.data.success) {
                    const filteredServices = response.data.services
                        .filter(service => service.isAvailable)
                        .map(service => ({
                            image: service.image,
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

        fetchData();
    }, []);
    useEffect(() => {
        if (selectedIndex !== null) {
            setSelectedIndex(null);
        }
    }, [centerIndex]);

    // Dùng Intersection Observer để check khi component xuất hiện
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

    return (
        <div ref={containerRef} className="max-w-6xl mx-auto px-4 py-12 transition-opacity duration-700 ease-in-out" style={{ opacity: isVisible ? 1 : 0 }}>
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#1a237e] mb-2">Our services!</h2>
                <p className="text-xl text-[#1a237e]">{services[selectedIndex ?? centerIndex]?.author}</p>
            </div>

            {services.length > 3 ? (
                <div className="relative">
                    <Carousel opts={{ loop: true }} setApi={setApi}>
                        <CarouselContent>
                            {services.map((services, index) => (
                                <CarouselItem
                                    key={index}
                                    className={`relative h-80 md:basis-1/3 lg:basis-1/3 mx-2 transition-transform duration-300 ${index === centerIndex ? "opacity-100" : "opacity-70"
                                        }`}
                                    onClick={() => {
                                        if (index === centerIndex - 1) prevSlide();
                                        else if (index === centerIndex + 1) nextSlide();
                                        else setSelectedIndex(index);
                                    }}
                                >
                                    <div className="flex justify-center w-full h-full">
                                        <div className="relative overflow-hidden rounded-3xl transition-all duration-500 ease-in-out"
                                            style={{
                                                width: index === centerIndex ? "18rem" : "10rem",
                                                height: index === centerIndex ? "20rem" : "16rem",
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                            }}>
                                            <img
                                                src={services.url || "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/anh-cho-hai-1.jpg"}
                                                alt={`Customer ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <div className="flex justify-center mt-4 space-x-2">
                        {services.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api && api.scrollTo(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === centerIndex ? "bg-blue-500 w-4 h-4" : "bg-gray-400"}`}
                            ></button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={`flex justify-center gap-6 flex-wrap transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    {services.map((services, index) => (
                        <div key={index} className={`overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 ease-in-out ${selectedIndex === index ? "w-72 h-80" : "w-40 h-64 opacity-70"}`} onClick={() => setSelectedIndex(index)}>
                            <img src={services.url || "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/anh-cho-hai-1.jpg"} alt={`Customer ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}

            <div className="text-center mt-8 transition-opacity duration-300">
                <p className="text-gray-600 text-lg italic max-w-2xl mx-auto">"{services[selectedIndex ?? centerIndex]?.quote}"</p>
            </div>
        </div>
    );
}
