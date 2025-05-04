import { Line, Doughnut, Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    BarController,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { DashBoardServices } from "@/services/DashBoardService";

// Đăng ký các thành phần Chart.js
ChartJS.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    BarController,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

export default function OverviewTab({ stats, timeRange }) {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "",
                data: [],
                borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                tension: 0.4,
                fill: true,
            },
        ],
    });
    const [summaryData, setSummaryData] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("revenue");

    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                setLoading(true);
                const response = await DashBoardServices.GetBookingDataByTime(timeRange);
                const apiData = response.data.data;
                console.log("apiData", apiData);
                setSummaryData(response.data.summary || {});

                if (timeRange === "all") {
                    // Xử lý hiển thị cho trường hợp 'all'
                    setChartData({
                        labels: ["Tổng doanh thu"],
                        datasets: [
                            {
                                label: "Dịch vụ (triệu VND)",
                                data: [(response.data.summary?.totalBooking || 0) / 1000000],
                                backgroundColor: "#3b82f6",
                                borderColor: "#3b82f6",
                            },
                            {
                                label: "Sản phẩm (triệu VND)",
                                data: [(response.data.summary?.totalPayment || 0) / 1000000],
                                backgroundColor: "#ec4899",
                                borderColor: "#ec4899",
                            }
                        ],
                    });
                } else {
                    // Xử lý cho các trường hợp week/month/year
                    let labels = [];
                    let bookingData = [];
                    let paymentData = [];

                    switch (timeRange) {
                        case "week":
                            labels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
                            bookingData = Array(7).fill(0);
                            paymentData = Array(7).fill(0);
                            apiData.forEach(item => {
                                const index = item.day - 1;
                                bookingData[index] = item.total / 1000000;
                                paymentData[index] = item.paymentTotal / 1000000;
                            });
                            break;

                        case "month":
                            labels = Array.from({ length: 5 }, (_, i) => `Tuần ${i + 1}`);
                            bookingData = Array(5).fill(0);
                            paymentData = Array(5).fill(0);
                            apiData.forEach(item => {
                                const index = item.week - 1;
                                bookingData[index] = item.total / 1000000;
                                paymentData[index] = item.paymentTotal / 1000000;
                            });
                            break;

                        case "year":
                            labels = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6",
                                "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"];
                            bookingData = Array(12).fill(0);
                            paymentData = Array(12).fill(0);
                            apiData.forEach(item => {
                                const index = item.month - 1;
                                bookingData[index] = item.total / 1000000;
                                paymentData[index] = item.paymentTotal / 1000000;
                            });
                            break;
                    }

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: "Dịch vụ (triệu VND)",
                                data: bookingData,
                                borderColor: "#3b82f6",
                                backgroundColor: "rgba(59, 130, 246, 0.1)",
                                tension: 0.4,
                                fill: true,
                            },
                            {
                                label: "Sản phẩm (triệu VND)",
                                data: paymentData,
                                borderColor: "#ec4899",
                                backgroundColor: "rgba(236, 72, 153, 0.1)",
                                tension: 0.4,
                                fill: true,
                            }
                        ],
                    });
                }
            } catch (error) {
                console.error("Error fetching revenue data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRevenueData();
    }, [timeRange]);

    // Dữ liệu biểu đồ phân bổ
    const distributionData = {
        labels: ["Dịch vụ", "Sản phẩm"],
        datasets: [
            {
                label: "Doanh thu (triệu VND)",
                data: [
                    (summaryData?.totalBooking || 0) / 1000000,
                    (summaryData?.totalPayment || 0) / 1000000
                ],
                backgroundColor: ["#3b82f6", "#ec4899"],
            },
            {
                label: "Số lượng",
                data: [
                    summaryData?.totalBookingCount || 0,
                    summaryData?.totalPaymentCount || 0
                ],
                backgroundColor: ["#60a5fa", "#f472b6"],
            }
        ],
    };

    const renderChart = () => {
        if (timeRange === "all") {
            return (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: (value) => value + "M",
                                },
                            },
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                        }
                    }}
                />
            );
        }

        return activeTab === "revenue" ? (
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => value + "M",
                            },
                        },
                    },
                }}
            />
        ) : (
            <Bar
                data={{
                    labels: ["Dịch vụ", "Sản phẩm", "Tổng"],
                    datasets: [{
                        label: "Doanh thu (triệu VND)",
                        data: [
                            (summaryData?.totalBooking || 0) / 1000000,
                            (summaryData?.totalPayment || 0) / 1000000,
                            (summaryData?.grandTotal || 0) / 1000000
                        ],
                        backgroundColor: ["#3b82f6", "#ec4899", "#10b981"],
                    }]
                }}
                options={{
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => value + "M",
                            },
                        },
                    },
                }}
            />
        );
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className={timeRange === "all" ? "lg:col-span-7" : "lg:col-span-4"}>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>
                            {timeRange === "week" ? "Doanh thu theo ngày" :
                                timeRange === "month" ? "Doanh thu theo tuần" :
                                    timeRange === "year" ? "Doanh thu theo tháng" :
                                        "Tổng doanh thu tất cả thời gian"}
                        </CardTitle>
                        {timeRange !== "all" && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setActiveTab("revenue")}
                                    className={`px-3 py-1 rounded-md text-sm ${activeTab === "revenue" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                                >
                                    Doanh thu
                                </button>
                                <button
                                    onClick={() => setActiveTab("distribution")}
                                    className={`px-3 py-1 rounded-md text-sm ${activeTab === "distribution" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                                >
                                    Phân bổ
                                </button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pl-2">
                    {loading ? (
                        <div className="flex items-center justify-center h-[300px]">
                            <div className="text-center space-y-2">
                                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                                <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
                            </div>
                        </div>
                    ) : renderChart()}
                </CardContent>
            </Card>

            {timeRange !== "all" && (
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Phân tích dòng tiền</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex h-[200px] items-center justify-center">
                            <Doughnut
                                data={distributionData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: "bottom",
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function (context) {
                                                    let label = context.dataset.label || '';
                                                    if (label) {
                                                        label += ': ';
                                                    }
                                                    if (context.datasetIndex === 0) {
                                                        label += context.raw + 'M';
                                                    } else {
                                                        label += context.raw;
                                                    }
                                                    return label;
                                                }
                                            }
                                        }
                                    },
                                    cutout: "60%",
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-blue-800">Dịch vụ</h3>
                                <p className="text-2xl font-bold text-blue-600">
                                    {(summaryData?.totalBooking || 0).toLocaleString()}đ
                                </p>
                                <p className="text-sm text-blue-500">

                                </p>
                            </div>
                            <div className="bg-pink-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-pink-800">Sản phẩm</h3>
                                <p className="text-2xl font-bold text-pink-600">
                                    {(summaryData?.totalPayment || 0).toLocaleString()}đ
                                </p>
                                <p className="text-sm text-pink-500">

                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}