
import React, { useState, useEffect } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Pen, Trash2 } from "lucide-react";
import { } from '@heroicons/react/20/solid'
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Page from "@/app/dashboard/page";
import Add_Modal from "./Add_Service_Modal"
import Edit_Modal from "./Edit_Service_Modal";

import axios from "axios";

export default function Service_Managerment() {
    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [open, setOpen] = React.useState(false)
    const [openEdit, setOpenEdit] = React.useState(false)
    const [selectedService, setSelectedService] = useState(null);

    // Gọi API để lấy danh sách sản phẩm
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:9999/service/get-all"); // Thay bằng URL API của bạn
                if (response.data.success) {
                    const formattedData = response.data.services.map((service) => ({
                        id: service._id,
                        name: service.name,
                        description: service.description,
                        price: service.price,
                        duration: service.duration,
                        isAvailable: service.isAvailable

                    }));
                    console.log("Formatted Data:", formattedData);
                    setData(formattedData);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        console.log(id)
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                const response = await axios.delete(`http://localhost:9999/service/delete${id}`);
                if (response.data.success) {
                    alert("Xóa dịch vụ thành công!");
                    setData((prevData) => prevData.filter((p) => p.id !== id));
                } else {
                    alert(response.data.message || "Không thể xóa sản phẩm.");
                }
            } catch (error) {
                console.error("Lỗi khi xóa sản phẩm:", error);
                alert("Đã xảy ra lỗi. Vui lòng thử lại.");
            }
        }
    };

    const columns = [
        {
            id: "select",
            header: ({ table }) => (
                <div className="text-center">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: () => <div className="text-center">Tên dịch vụ</div>,
            cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "price",
            header: () => <div className="text-right">Giá tiền</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("price"));
                return <div className="text-right font-medium">{amount.toLocaleString()}₫</div>;
            },
        },
        {
            accessorKey: "duration",
            header: () => <div className="text-center">Thời gian</div>,
            cell: ({ row }) => {
                const duration = row.getValue("duration");
                const hours = Math.floor(duration / 60);
                const minutes = duration % 60;
                
                let displayTime = "";
                if (hours > 0) {
                    displayTime += `${hours} tiếng`;
                }
                if (minutes > 0) {
                    displayTime += ` ${minutes} phút`;
                }
                
                return <div className="capitalize">{displayTime.trim()}</div>;
            },
        },
        {
            accessorKey: "isAvailable",
            header: () => <div className="text-center">Trạng thái</div>,
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue("isAvailable") ? "Hoạt động" : "Vô hiệu"}
                </div>
            ),
        },
        {
            id: "actions",
            header: () => <div className="text-center font-semibold">...</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <button>
                        <Pen className="size-6 p-1 mr-1 " onClick={() => {
                            setOpenEdit(true);
                            setSelectedService(row.original);
                        }} />

                    </button>

                    <button onClick={() => handleDelete(row.original.id)}>
                        <Trash2 className="size-6 p-1 " />
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
                        placeholder="Tìm kiếm sản phẩm..."
                        value={(table.getColumn("name")?.getFilterValue()) ?? ""}
                        onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                        className="max-w-sm"
                    />
                    <div className="text-center ml-auto">
                        <Button className="p-2 font-semibold text-white" onClick={() => setOpen(true)}>
                            Thêm sản phẩm
                        </Button>

                    </div>
                    <Add_Modal open={open} onClose={() => setOpen(false)} />
                    <Edit_Modal
                    open={openEdit}
                    onClose={() => {
                        setOpenEdit(false);
                        setSelectedService(null);
                    }}
                    ServiceData={selectedService}
                />
                </div>
                <div className="rounded-md border ">
                    <Table >
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
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
