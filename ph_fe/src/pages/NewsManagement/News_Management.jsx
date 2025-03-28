import React, { useState, useEffect } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ArrowUpDown, Pen, Trash2 } from "lucide-react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import CreateNew from "./Create_new";
import EditNew from "./Edit_new";
import { MedicineService } from "@/services/MedicineService";
import { toast } from "sonner";
import { NewServices } from "@/services/NewService";

export default function News_Management() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedNew, setSelectedNew] = useState(null);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [open, setOpen] = useState(false);

    const fetchData = async () => {
        try {
            const response = await NewServices.GetAllNews();
            if (response.data.success) {
                setData(response.data.news);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu bài viết:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            try {
                const response = await NewServices.deleteNew(id);
                setData((prevData) => prevData.filter((item) => item._id !== id));
                toast.success("Xóa bài viết thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa bài viết:", error);
                toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
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
                <div className="text-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "images",
            header: () => <div className="text-center">Ảnh</div>,
            cell: ({ row }) => {
                const images = row.original.images;
                return (
                    <div className="flex justify-center">
                        {images && (
                            <Zoom>
                                <img
                                    src={typeof images === 'object' ? images.url : images}
                                    alt={row.original.title || "Ảnh bài viết"}
                                    className="h-16 w-16 object-cover rounded-md cursor-pointer"
                                />
                            </Zoom>
                        )}
                        {!images && (
                            <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                                Không có ảnh
                            </div>
                        )}
                    </div>
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: "title",
            header: () => <div className="text-center">Tiêu đề bài viết</div>,
            cell: ({ row }) => <div className="text-center">{row.getValue("title")}</div>,
        },
        {
            accessorKey: "createdBy",
            header: () => <div className="text-center">Người tạo</div>,
            cell: ({ row }) => {
                const createdBy = row.original.createdBy;
                return (
                    <div className="text-center">
                        {createdBy && createdBy.username ? createdBy.username : "N/A"}
                    </div>
                );
            },
        },
        {
            accessorKey: "updatedBy",
            header: () => <div className="text-center">Người cập nhật</div>,
            cell: ({ row }) => {
                const updatedBy = row.original.updatedBy;
                return (
                    <div className="text-center">
                        {updatedBy && updatedBy.username ? updatedBy.username : "N/A"}
                    </div>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: () => <div className="text-center">Ngày tạo</div>,
            cell: ({ row }) => {
                const date = new Date(row.original.createdAt);
                return (
                    <div className="text-center">
                        {date.toLocaleDateString("vi-VN")}
                    </div>
                );
            },
        },
        {
            accessorKey: "updatedAt",
            header: () => <div className="text-center">Ngày cập nhật</div>,
            cell: ({ row }) => {
                const date = new Date(row.original.updatedAt);
                return (
                    <div className="text-center">
                        {row.original.updatedBy ? date.toLocaleDateString("vi-VN") : "N/A"}
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center font-semibold">...</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <button>
                        <Pen className="size-6 p-1 mr-1" onClick={() => {
                            setOpenEdit(true);
                            setSelectedNew(row.original);
                        }} />
                    </button>
                    <button onClick={() => handleDelete(row.original._id)}>
                        <Trash2 className="size-6 p-1" />
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
            <EditNew open={openEdit} onOpenChange={setOpenEdit} post={selectedNew} onsuccess={fetchData} />
            <div className="flex items-center py-4">
                <Input
                    placeholder="Tìm kiếm tiêu đề bài viết..."
                    value={(table.getColumn("title")?.getFilterValue()) ?? ""}
                    onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
                    className="max-w-sm"
                />
                <Input
                    placeholder="Tìm kiếm tên người tạo bài viết..."
                    value={(table.getColumn("username")?.getFilterValue()) ?? ""}
                    onChange={(e) => table.getColumn("username")?.setFilterValue(e.target.value)}
                    className="max-w-sm ml-2"
                />
                <div className="text-center ml-auto">
                    <Button className="p-2 font-semibold text-white" onClick={() => setOpen(true)}>
                        Tạo bài viết mới
                    </Button>
                    <CreateNew open={open} onOpenChange={setOpen} onSuccess={fetchData} />
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
            <div className="flex items-center justify-end space-x-2 py-4">
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