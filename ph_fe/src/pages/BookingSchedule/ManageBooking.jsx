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
import Page from "@/app/dashboard/page";
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

export default function ManageBooking() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [services, setServices] = useState([]);

    const fetchBookings = async () => {
        try {
            const response = await BookingServices.GetAllBooking();
            setData(response.data);
            console.log(response.data)
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

    useEffect(() => {
        fetchBookings();
        getAllService();
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
            header: "Ngày đặt",
            cell: ({ row }) => <div className="">{row.getValue("date").split("T")[0].split("-").reverse().join("/")}</div>,
        },
        {
            accessorKey: "hour",
            header: "Giờ",
            cell: ({ row }) => <div className="">{row.getValue("hour")}</div>,
        },
        {
            accessorKey: "guest_name",
            header: "Khách hàng",
            cell: ({ row }) => <div className="">{row.getValue("guest_name")}</div>,
        },
        {
            accessorKey: "guest_phone",
            header: "SĐT",
            cell: ({ row }) => <div className="">{row.getValue("guest_phone")}</div>,
        },
        {
            accessorKey: "type",
            header: "Loại thú cưng",
            cell: ({ row }) => <div className="">{row.getValue("type")}</div>,
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => <div className="">{row.getValue("status")}</div>,
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
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
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
        <Page>
            <div className="w-full">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Tìm kiếm khách hàng..."
                        value={(table.getColumn("guest_name")?.getFilterValue()) ?? ""}
                        onChange={(e) => table.getColumn("guest_name")?.setFilterValue(e.target.value)}
                        className="max-w-sm"
                    />
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
                                    <TableCell colSpan={columns.length} className="">
                                        Không có kết quả.
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
        </Page>
    );
}
