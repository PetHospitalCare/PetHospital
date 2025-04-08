// dash-board.jsx
import { useEffect, useState } from "react"
import StatCard from "./Chart&Card/StatCard"
import OverviewTab from "./Chart&Card/OverViewTab"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js"
import { DashBoardServices } from "@/services/DashBoardService";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
)

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("overview")
    const [timeRange, setTimeRange] = useState("week")
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({
        summary: {
            totalAppointments: 0,
            upcomingAppointments: 0,
            totalCustomers: 0,
            totalProducts: 0,
            totalPets: 0,
            newCustomersThisPeriod: 0,
            revenueThisPeriod: 0
        },
        details: {
            appointments: {
                byStatus: {
                    pending: 0,
                    confirm: 0,
                    complete: 0,
                    cancel: 0
                }
            },
            pets: {
                byType: {
                    dog: 0,
                    cat: 0
                }
            }
        }
    })

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true)
                const response = await DashBoardServices.getStatForCard(timeRange)
                setStats(response.data.data)
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [timeRange])
    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <div className="ml-auto">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Chọn khoảng thời gian" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="week">Tuần này</SelectItem>
                            <SelectItem value="month">Tháng này</SelectItem>
                            <SelectItem value="year">Năm nay</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </header>

            <main className="flex-1 space-y-4 p-4 md:p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Tổng lịch hẹn"
                        timeRange={timeRange}
                        value={stats?.summary?.totalAppointments}
                        subValue={`${stats?.details?.appointments?.byStatus?.pending || 0} đang chờ xếp lịch, ${stats?.details?.appointments?.byStatus?.confirm || 0} đang chờ khám, ${stats?.details?.appointments?.byStatus?.complete || 0} hoàn thành`}
                        icon="calendar"
                    />
                    <StatCard
                        title="Doanh thu"
                        value={stats.summary.revenueThisPeriod}
                        subValue={`${timeRange === "all" ? "Tổng doanh thu" : `Doanh thu ${timeRange === "week" ? "tuần" : timeRange === "month" ? "tháng" : "năm"} này`}`}
                        icon="dollar"
                        isCurrency
                    />
                    <StatCard
                        title="Thú cưng"
                        value={stats.summary.totalPets}
                        subValue={`${stats.details.pets.byType.dog || 0} chó, ${stats.details.pets.byType.cat || 0} mèo`}
                        icon="pet"
                    />
                    <StatCard
                        title="Tài khoản"
                        value={stats.summary.totalCustomers}
                        subValue={`${stats?.details?.customers?.byRole.customer || 0} khách hàng mới, ${stats?.details?.customers?.byRole?.admin || 0} quản lý, ${stats?.details?.customers?.byRole?.staff || 0} nhân viên, ${stats?.details?.customers?.byRole?.doctor || 0} bác sĩ`}
                        icon="service"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex space-x-2 border-b">
                        <button
                            className={`px-4 py-2 ${activeTab === "overview" ? "border-b-2 border-primary" : ""}`}
                            onClick={() => setActiveTab("overview")}
                        >
                            Tổng quan
                        </button>
                    </div>

                    {activeTab === "overview" && <OverviewTab stats={stats} timeRange={timeRange} />}
                </div>
            </main>
        </div>
    )
}