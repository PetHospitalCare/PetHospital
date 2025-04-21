import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pen, Trash2, CalendarCheck, FileText, Wallet } from "lucide-react";
import { ChevronDown, CalendarIcon, Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
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
import { socket } from "../../App"
import { Check } from 'lucide-react';
import AssignDoctor from "./AssignDoctor";
import { UserService } from "@/services/UserService";
import { toast } from "sonner";
import EditBookingDialog from "./EditBookingSchedule"
import BookingDialog from "@/components/Booking-modal";
import MedicalExaminationDialog from "../MedicalExamination/Medicalexamination";
import PaymentDialog from "./payment.jsx";
import { MeidicalServices } from "@/services/MedicalService";
export default function BookingStatus({ status, setCount }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [services, setServices] = useState([]);
    const [openAssignDoctor, setOpenAssignDoctor] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [open, setOpen] = useState(false);
    const [doctor, setDoctor] = useState([]);
    const [medicalRecord, setMedicalRecord] = useState([]);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [selectedPaymentBooking, setSelectedPaymentBooking] = useState(null);
    const [pageSize, setPageSize] = useState(5);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const statusMapping = {
        pending: { label: "Chờ xác nhận", color: "bg-yellow-500 text-white" },
        confirm: { label: "Chờ khám", color: "bg-blue-500 text-white" },
        complete: { label: "Đã khám", color: "bg-green-500 text-white" },
        cancel: { label: "Đã hủy", color: "bg-red-500 text-white" },
    };
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState("all");
    const [allData, setAllData] = useState([]);
    const handlePaymentClick = (booking) => {
        setSelectedPaymentBooking(booking);
        setIsPaymentDialogOpen(true);
    };
    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            if (status === "complete") {
                const response = await MeidicalServices.getAllMedicalRecords();
                const complete = response?.data?.data?.filter(record => record.booking_id?.status === status);
                const bookings = complete.map(record => record.booking_id)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setAllData(bookings);
                setData(bookings);
                setMedicalRecord(complete);
            } else {
                const response = await BookingServices.getAllBookingByStatus(status);
                const sortedData = response?.data?.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                setAllData(sortedData);
                setData(sortedData);
                if (status === "pending") {
                    setCount(response?.data.length);
                }
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu booking:", error);
            toast.error("Không thể tải dữ liệu lịch hẹn");
        } finally {
            setIsLoading(false);
        }
    };
    const filterData = () => {
        let filteredData = [...allData];

        if (selectedDoctor && selectedDoctor !== "all") {
            filteredData = filteredData.filter(booking =>
                booking.doctor_id?._id === selectedDoctor
            );
        }

        if (selectedDate) {
            const dateString = format(selectedDate, 'yyyy-MM-dd');
            filteredData = filteredData.filter(booking =>
                booking.date.startsWith(dateString)
            );
        }

        setData(filteredData);
    };
    useEffect(() => {
        filterData();
    }, [selectedDoctor, selectedDate, allData]);

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
    }, [status]);
    useEffect(() => {
        socket.on("newBooking", (newBooking) => {
            if (status === "pending") {
                setData((prevData) => [newBooking, ...prevData]);
            }
            setCount((prevCount) => prevCount + 1);

        });
        return () => {
            socket.off("newBooking");
        };
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await BookingServices.CancelBooking(id);
            if (response.data.success) {
                toast.success("Hủy lịch hẹn thành công");
                // Refresh your booking list here
                fetchBookings();
            }
        } catch (error) {
            console.error("Delete booking error:", error);
            toast.error(error.response?.data?.message || "Lỗi khi hủy lịch hẹn");
        }
    };
    const getSubServiceName = (serviceId, subServiceId) => {
        const service = services.find(s => s._id === serviceId);
        if (!service) return "Không tìm thấy";

        const subService = service.subServices.find(sub => sub._id === subServiceId);
        return subService ? subService.name : "Không tìm thấy";
    };
    const handleViewRecord = (booking) => {
        setSelectedAppointment({
            id: booking._id,
            doctor: booking?.doctor_id?.username || "Không có bác sĩ",
            title: getSubServiceName(booking.service_id, booking.sub_service_id),
            owner: booking?.guest_name || "Không có tên",
            startHour: booking.hour,
            date: new Date(booking.date)
        });
        setIsViewDialogOpen(true);
    };

    const columns = [
        {
            accessorKey: "date",
            header: "Ngày và giờ đặt",
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
                const serviceId = row.original.service_id;
                const subServiceId = row.original.sub_service_id;
                if (status === "complete") {
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
                } else {
                    return (
                        <div className="">
                            {getSubServiceName(serviceId, subServiceId)}
                        </div>
                    );
                }
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
                                    {type === "dog" ? "Chó" : "Mèo"}
                                </Badge>
                            </>
                        ) : (
                            <Badge
                                variant="outline"
                                className="capitalize bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700"
                            >
                                {row.getValue("type") === "dog" ? "Chó" : "Mèo"}
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
        ...(status === "complete"
            ? [
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
                        const amount = parseFloat(row.getValue("price"));
                        return <div className="font-medium">{amount.toLocaleString()}₫</div>;
                    },
                },
            ]
            : []),
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    {status === "pending" &&
                        <button>
                            <Check className="size-6 p-1 mr-1 "
                                onClick={async () => {
                                    if (row.original.doctor_id) {
                                        // Nếu đã có doctor_id, cập nhật trạng thái ngay lập tức
                                        try {
                                            const res = await BookingServices.AssignDoctor(row.original._id, row.original.doctor_id);
                                            if (res.status === 200) {
                                                toast.success("Cập nhật thành công!");
                                                fetchBookings();
                                                onOpenChange(false); // Đóng modal
                                            }
                                        } catch (error) {
                                            console.error("Lỗi khi cập nhật cuộc hẹn:", error);
                                            toast.error("Cập nhật thất bại, thử lại sau!");
                                        }
                                    } else {
                                        setOpenAssignDoctor(true);
                                        setSelectedBooking(row.original);
                                    }
                                }}
                            />
                        </button>
                    }
                    {status !== "cancel" && status !== "complete" && (
                        <>
                            <button>
                                <Pen className="size-6 p-1 mr-1 " onClick={() => {
                                    setIsEditDialogOpen(true);
                                    setSelectedBooking(row.original)
                                }} />

                            </button>
                            <button onClick={() => handleDelete(row.original._id)}>
                                <Trash2 className="size-6 p-1 text-red-500" />
                            </button>
                        </>
                    )}
                    {status === "complete" && (
                        <>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => handlePaymentClick(row.original)}
                                disabled={row.original.payment?.status === true}
                            >
                                <Wallet
                                    className={cn(
                                        "h-4 w-4",
                                        row.original.payment === "true"
                                            ? "text-green-500"
                                            : "text-orange-500"
                                    )}
                                />
                            </Button>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => handleViewRecord(row.original)}
                            >
                                <FileText className="h-4 w-4 text-blue-500" />
                            </Button>
                        </>
                    )}
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
            <EditBookingDialog open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                bookingData={selectedBooking}
                onUpdate={fetchBookings}>

            </EditBookingDialog>
            <AssignDoctor open={openAssignDoctor} onOpenChange={setOpenAssignDoctor} booking={selectedBooking} onUpdate={fetchBookings} />
            <div className="flex items-center py-4">
                <div className="flex flex-1 gap-2 items-center">
                    <Input
                        placeholder="Tìm kiếm khách hàng..."
                        value={(table.getColumn("guest_name")?.getFilterValue()) ?? ""}
                        onChange={(e) => table.getColumn("guest_name")?.setFilterValue(e.target.value)}
                        className="max-w-sm"
                    />

                    {/* Date filter */}
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

                    {/* Doctor filter */}
                    <Select
                        value={selectedDoctor}
                        onValueChange={(value) => {
                            setSelectedDoctor(value);
                            setCurrentPageIndex(0);
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Lọc theo bác sĩ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả bác sĩ</SelectItem>
                            {doctor.map((doc) => (
                                <SelectItem key={doc._id} value={doc._id}>
                                    {doc.username}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Reset filters button */}
                    {(selectedDate || selectedDoctor !== "all") && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setSelectedDate(null);
                                setSelectedDoctor("all");
                                setCurrentPageIndex(0);
                                setData(allData);
                            }}
                            className="h-8 px-2"
                        >
                            Xóa bộ lọc
                        </Button>
                    )}
                </div>

                {/* Keep existing "Thêm lịch mới" button */}
                {status === "pending" && (
                    <div className="text-center ml-auto">
                        <Button onClick={() => setOpen(true)} className="p-2 font-semibold text-white">
                            Thêm lịch mới
                        </Button>
                        <BookingDialog open={open} onClose={() => setOpen(false)} onUpdate={fetchBookings} />
                    </div>
                )}
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
                    <span className="text-sm text-gray-700">Số sản phẩm mỗi trang:</span>
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
            <MedicalExaminationDialog
                open={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                appointment={selectedAppointment}
                isReadOnly={true} // Add this prop
            />
            <PaymentDialog
                open={isPaymentDialogOpen}
                onOpenChange={setIsPaymentDialogOpen}
                booking={selectedPaymentBooking}
                onPaymentComplete={fetchBookings}
            />

        </div >

    );
}
