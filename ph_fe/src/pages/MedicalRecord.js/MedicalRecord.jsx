import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { BookingServices } from "@/services/BookingService";
import { Services } from "@/services/Services";
import { Badge } from "@/components/ui/badge";
import { UserService } from "@/services/UserService";
import { FileText, Wallet, ArrowLeft, Calendar, User } from "lucide-react";
import { MeidicalServices } from "@/services/MedicalService";
import { useNavigate } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

export default function MedicalRecord() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]); // Store all data for custom filtering
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [services, setServices] = useState([]);
    const [doctor, setDoctor] = useState([]);
    const [medicalRecord, setMedicalRecord] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("all"); // Changed from empty string to "all"
    const [selectedDate, setSelectedDate] = useState(null);
    const [pageSize, setPageSize] = useState(5);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    // Set status directly to "complete"
    const status = "complete";

    const statusMapping = {
        pending: { label: "Chờ xác nhận", color: "bg-yellow-500 text-white" },
        confirm: { label: "Chờ khám", color: "bg-blue-500 text-white" },
        complete: { label: "Đã khám", color: "bg-green-500 text-white" },
        cancel: { label: "Đã hủy", color: "bg-red-500 text-white" },
    };
    const handleBackClick = () => {
        // Navigate back to parent component
        navigate(-1);
    };

    const fetchBookings = async () => {
        try {
            // Since status is now always "complete", we only need this code path
            const response = await MeidicalServices.getAllMedicalRecords();
            const complete = response?.data?.data?.filter(record => record.booking_id?.status === status);
            const bookings = complete.map(record => record.booking_id).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setMedicalRecord(complete);
            setData(bookings);
            setAllData(bookings); // Store all data for filtering
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu booking:", error);
        }
    };

    const getAllService = async () => {
        try {
            const res = await Services.getAllService();
            setServices(res.data.services);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu services:", error);
        }
    };

    const getAllDoctor = async () => {
        try {
            const respon = await UserService.getAllDoctor();
            setDoctor(respon.data.doctor);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu bác sĩ:", error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    fetchBookings(),
                    getAllService(),
                    getAllDoctor(),
                ]);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // Apply filters whenever selectedDoctor or selectedDate changes
    useEffect(() => {
        let filteredData = [...allData];

        // Filter by doctor
        if (selectedDoctor && selectedDoctor !== "all") { // Check for "all" instead of empty string
            filteredData = filteredData.filter(booking =>
                booking.doctor_id?._id === selectedDoctor
            );
        }

        // Filter by date
        if (selectedDate) {
            const dateString = format(selectedDate, 'yyyy-MM-dd');
            filteredData = filteredData.filter(booking =>
                booking.date.startsWith(dateString)
            );
        }

        setData(filteredData);
    }, [selectedDoctor, selectedDate, allData]);

    const handleResetFilters = () => {
        setSelectedDoctor("all"); // Changed from empty string to "all"
        setSelectedDate(null);
        setData(allData);
        table.getColumn("guest_name")?.setFilterValue("");
    };

    const getSubServiceName = (serviceId, subServiceId) => {
        const service = services.find(s => s._id === serviceId);
        if (!service) return "Không tìm thấy";

        const subService = service.subServices.find(sub => sub._id === subServiceId);
        return subService ? subService.name : "Không tìm thấy";
    };

    const columns = [
        {
            accessorKey: "date",
            header: "Ngày và giờ Khám",
            cell: ({ row }) => {
                const time = row.original.hour;
                return (<>
                    <div className="font-medium">{row.getValue("date").split("T")[0].split("-").reverse().join("/")}</div>
                    <div className="text-sm text-muted-foreground">{time}</div></>
                )
            }
        },
        {
            accessorKey: "guest_name",
            header: "Khách hàng",
            cell: ({ row }) => {
                const sdt = row.original.guest_phone;
                const email = row.original.guest_email;
                return (<>
                    <div className="font-medium">{row.getValue("guest_name")}</div>
                    <div className="text-sm text-muted-foreground">{sdt}</div>
                    <div className="text-sm text-muted-foreground">{email}</div></>
                )
            }
        },
        {
            accessorKey: "sub_service_id",
            header: "Dịch vụ",
            cell: ({ row }) => {
                // Find the medical record for this booking
                const record = medicalRecord.find(
                    record => record.booking_id._id === row.original._id
                );
                if (record && record.services) {
                    return (
                        <div className="space-y-1">
                            {record.services.map((service, index) => (
                                <div key={index} className="text-sm">
                                    {getSubServiceName(service.service_id, service.sub_service_id)}
                                </div>
                            ))}
                        </div>
                    );
                }
                return <div className="text-muted-foreground">Không có dịch vụ</div>;
            },
        },
        {
            accessorKey: "type",
            header: "Thú cưng",
            cell: ({ row }) => {
                const type = row.original.pet_id?.type;
                const petname = row.original?.pet_id?.name;

                return (
                    <div className="flex items-center gap-2 min-h-[40px]">
                        {type ? (
                            <>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {petname} -
                                </span>
                                <Badge
                                    variant="outline"
                                    className="capitalize bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700"
                                >
                                    {type === "dog" ? "Chó" : "Mèo"}
                                </Badge>
                            </>
                        ) : (
                            <Badge
                                variant="outline"
                                className="capitalize bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700"
                            >
                                {row.getValue("type") === "dog" ? "Chó" : "Mèo"}
                            </Badge>
                        )}
                    </div>
                );
            }
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => <Badge className={`px-2 py-1 rounded ${statusMapping[row.getValue("status")]?.color || "bg-gray-500 text-white"}`}>
                {statusMapping[row.getValue("status")]?.label || "Không xác định"}
            </Badge>
        },
        {
            accessorKey: "doctor_id",
            header: "Bác sĩ phụ trách",
            cell: ({ row }) =>
                <div className="font-medium">
                    {row.getValue("doctor_id")?.username || "Chưa chỉ định"}
                </div>
        },
        {
            accessorKey: "payment",
            header: "Thanh toán",
            cell: ({ row }) => {
                const record = medicalRecord.find(
                    record => record.booking_id._id === row.original._id
                );
                const isPaid = record?.booking_id?.payment?.status;

                return (
                    <div className={`font-medium ${isPaid ? "text-green-600" : "text-red-600"}`}>
                        {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                    </div>
                );
            }
        },
        {
            accessorKey: "price",
            header: "Tổng số tiền",
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("price") || 0);
                return <div className="font-medium">{amount.toLocaleString()}₫</div>;
            },
        },
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => (
                <div className="flex items-center justify-center">

                    <Button
                        variant="outline"
                        className="flex items-center gap-1  hover:bg-primary hover:text-white transition-colors duration-200"
                        onClick={() => navigate(`/MedicalRecord/${row.original._id}`)}
                    >
                        <FileText className="h-2 w-1" />
                        <span>Xem chi tiết</span>
                    </Button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: {
                pageIndex: currentPageIndex,
                pageSize: pageSize,
            },
        },
        initialState: {
            pagination: {
                pageSize: pageSize,
            },
        },
    });
    useEffect(() => {
        setCurrentPageIndex(0);
        table.setPageSize(pageSize);
    }, [pageSize]);

    // Thêm handlers cho nút next/previous
    const handleNextPage = () => {
        if (table.getCanNextPage()) {
            setCurrentPageIndex(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (table.getCanPreviousPage()) {
            setCurrentPageIndex(prev => prev - 1);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col gap-4 md:flex-row md:items-center py-4">
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    {/* Customer name filter */}
                    <div className="flex-1">
                        <Input
                            placeholder="Tìm kiếm khách hàng..."
                            value={(table.getColumn("guest_name")?.getFilterValue()) ?? ""}
                            onChange={(e) => table.getColumn("guest_name")?.setFilterValue(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Doctor filter */}
                    <div className="flex-1">
                        <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                            <SelectTrigger className="w-full">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <SelectValue placeholder="Lọc theo bác sĩ" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả bác sĩ</SelectItem> {/* Changed from empty string to "all" */}
                                {doctor.map((doc) => (
                                    <SelectItem key={doc._id} value={doc._id}>
                                        {doc.username}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date filter */}
                    <div className="flex-1 max-w-xs">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? (
                                        format(selectedDate, "dd/MM/yyyy")
                                    ) : (
                                        <span>Lọc theo ngày</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>


                </div>

                {/* Reset filters button */}
                <Button variant="outline" onClick={handleResetFilters} className="whitespace-nowrap">
                    Xóa bộ lọc
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <div className="flex items-center justify-center h-[400px]">
                                        <div className="text-center space-y-2">
                                            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                                            <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    Không có dữ liệu.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">Số lịch khám mỗi trang:</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 px-2">
                                {pageSize}
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {[5, 10, 15, 20].map((size) => (
                                <DropdownMenuItem key={size} onClick={() => setPageSize(size)}>
                                    {size}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex-1 text-sm text-gray-700">
                        {`Trang ${table.getState().pagination.pageIndex + 1} / ${table.getPageCount()}`}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Trước
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={!table.getCanNextPage()}
                    >
                        Sau
                    </Button>
                </div>
            </div>
        </div>
    );
}