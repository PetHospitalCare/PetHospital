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
import Page from "@/app/dashboard/page";
import axios from "axios";
import { ArrowUpDown, ChevronDown, Pen, Trash2 } from "lucide-react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import AddMedicineDialog from "./Add_Medicine_Modal";
import SheetDemo from "./Edit_Management";
import { MedicineService } from "@/services/MedicineService";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function MedicineManagerment() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [open, setOpen] = useState(false);
    const [pageSize, setPageSize] = useState(5); // Mặc định hiển thị 5 sản phẩm mỗi trang
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const fetchData = async () => {
        try {
            const response = await MedicineService.getAllMedicine()
            if (response.data.success) {
                setData(response.data.medicines);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu thuốc:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa thuốc này?")) {
            try {
                const response = await MedicineService.deleteMedicine(id);
                setData((prevData) => prevData.filter((acc) => acc._id !== id));
                toast.success("Xóa thuốc thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa thuốc:", error);
                toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
            }
        }
    };
    const columns = [
        {
            accessorKey: "images",
            header: () => <div className="text-center">Ảnh</div>,
            cell: ({ row }) => {
                const images = row?.original?.images; // Lấy danh sách ảnh từ API
                return (
                    <div className="flex flex-wrap justify-center gap-3"> {/* Tăng khoảng cách giữa các ảnh */}
                        {images.map((image, index) => (
                            <Zoom key={index}>
                                <img
                                    src={image?.url}
                                    alt={`Medicine ${index}`}
                                    className="h-28 w-28 object-cover rounded-md"
                                />
                            </Zoom>
                        ))}
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: () => <div className="text-center">Tên thuốc</div>,
            cell: ({ row }) => <div className=" text-center">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "pet_type",
            header: () => <div className="text-center">Dành cho</div>,
            cell: ({ row }) => {
                const petType = row.getValue("pet_type");

                // Kiểm tra nếu petType là mảng, thì chuyển sang tiếng Việt
                const translatedPetType = Array.isArray(petType)
                    ? petType.map((type) => (type === "Dog" ? "Chó" : type === "Cat" ? "Mèo" : type)).join(", ")
                    : petType === "Dog"
                        ? "Chó"
                        : petType === "Cat"
                            ? "Mèo"
                            : petType;

                return <div className="text-center">{translatedPetType}</div>;
            }
        },
        {
            accessorKey: "unit",
            header: () => <div className="text-center">Đơn vị</div>,
            cell: ({ row }) => <div className=" text-center">{row.getValue("unit")}</div>,
        },
        {
            accessorKey: "quantity",
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Số lượng
                        <ArrowUpDown />
                    </Button>
                </div>
            ),
            cell: ({ row }) => <div className="lowercase text-center">{row.getValue("quantity")}</div>,
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
            accessorKey: "expiry_date",
            header: () => <div className="text-center">Ngày hết hạn</div>,
            cell: ({ row }) => {
                const rawDate = row.getValue("expiry_date");
                if (!rawDate) return <div className="text-center">Không có ngày</div>;



                const date = new Date(rawDate);
                const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;

                return <div className="text-center">{formattedDate}</div>;
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center font-semibold">...</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <button>
                        <Pen className="size-6 p-1 mr-1 " onClick={() => {
                            setOpenEdit(true);
                            setSelectedMedicine(row.original);
                        }} />

                    </button>

                    <button onClick={() => handleDelete(row.original._id)}>
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
            pagination: {
                pageIndex: currentPageIndex, // Sử dụng state currentPageIndex
                pageSize: pageSize, // Sử dụng state pageSize
            },
        },
        initialState: {
            pagination: {
                pageSize: pageSize, // Thiết lập kích thước trang ban đầu
            },
        },
    });

    useEffect(() => {
        setCurrentPageIndex(0);
        table.setPageSize(pageSize);
    }, [pageSize]);

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
            <SheetDemo open={openEdit} onOpenChange={setOpenEdit} medicine={selectedMedicine} onsuccess={fetchData} />
            <div className="flex items-center py-4">
                <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    value={(table.getColumn("name")?.getFilterValue()) ?? ""}
                    onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                    className="max-w-sm"
                />
                <div className="text-center ml-auto">
                    <Button className="p-2 font-semibold text-white" onClick={() => setOpen(true)}>
                        Tạo thuốc mới
                    </Button>

                    <AddMedicineDialog open={open} onOpenChange={setOpen} onSuccess={fetchData} />

                </div>

            </div>
            <div className="rounded-md border  ">
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
        </div>

    );
}
