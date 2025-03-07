import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Pen, Trash2 } from "lucide-react";
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
export default function BookingStatus({ status, setCount }) {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [services, setServices] = useState([]);
    const [openAssignDoctor, setOpenAssignDoctor] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [doctor, setDoctor] = useState([]);
    const statusMapping = {
        pending: { label: "Chờ xác nhận", color: "bg-yellow-500 text-white" },
        confirm: { label: "Chờ khám", color: "bg-blue-500 text-white" },
        complete: { label: "Đã khám", color: "bg-green-500 text-white" },
        cancel: { label: "Đã hủy", color: "bg-red-500 text-white" },
    };
    const fetchBookings = async () => {
        try {
            const response = await BookingServices.GetAllBooking();
            const pending = response?.data?.filter(booking => booking.status === status)
            setData(pending);
            if (status === "pending") {
                setCount(pending.length);
            }


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
    }
    const getAllDoctor = async () => {
        try {
            const respon = await UserService.getAllDoctor();
            setDoctor(respon.data.doctor);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu bác sĩ:", error);
        }
    };
    useEffect(() => {
        fetchBookings();
        getAllService();
        getAllDoctor();
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
        if (window.confirm("Bạn có chắc chắn muốn xóa booking này?")) {
            try {
                await axios.delete(`http://localhost:5000/bookings/${id}`);
                setData((prevData) => prevData.filter((booking) => booking._id !== id));
                alert("Xóa booking thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa booking:", error);
                alert("Đã xảy ra lỗi. Vui lòng thử lại.");
            }
        }
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
                const pet = row.original.pet_id;
                const sdt = row.original.guest_phone;
                const email = row.original.guest_email;
                return (<>
                    <div className="font-medium">{row.getValue("guest_name")}</div>
                    <div className="text-sm text-muted-foreground">{sdt} - {email}</div></>
                )
            }
        },
        {
            accessorKey: "sub_service_id",
            header: "Dịch vụ",
            cell: ({ row }) => {
                const serviceId = row.original.service_id;
                const subServiceId = row.original.sub_service_id;
                return (
                    <div className="">
                        {getSubServiceName(serviceId, subServiceId)}
                    </div>
                );
            },
        },
        {
            accessorKey: "type",
            header: "Loại thú cưng",
            cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.getValue("type")}</Badge>
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
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    {status === "pending" &&
                        <button>
                            <Check className="size-6 p-1 mr-1 " onClick={() => {
                                setOpenAssignDoctor(true);
                                setSelectedBooking(row.original._id);
                            }} />
                        </button>
                    }
                    <button>
                        <Pen className="size-6 p-1 mr-1 " onClick={() => {
                        }} />

                    </button>
                    <button onClick={() => handleDelete(row.original._id)}>
                        <Trash2 className="size-6 p-1 text-red-500" />
                    </button>
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
        },
    });

    return (

        <div className="w-full">
            <AssignDoctor open={openAssignDoctor} onOpenChange={setOpenAssignDoctor} booking={selectedBooking} onUpdate={fetchBookings} />
            <div className="flex items-center py-4">
                <Input
                    placeholder="Tìm kiếm khách hàng..."
                    value={(table.getColumn("guest_name")?.getFilterValue()) ?? ""}
                    onChange={(e) => table.getColumn("guest_name")?.setFilterValue(e.target.value)}
                    className="max-w-sm"
                />
                <div className="text-center ml-auto">
                    <Button className="p-2 font-semibold text-white" >
                        Thêm lịch mới
                    </Button>



                </div>
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
                        {table.getRowModel().rows.length ? (
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
                                    Không có lịch đặt.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>

    );
}
