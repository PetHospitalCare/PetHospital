
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
import Add_Modal from "./Add_Product_Modal";

import { ProductService } from "../../services/ProductService";
import { toast } from "sonner"

import Edit_Modal from "./Edit_Product_Modal";

export default function Product_Managerment() {
    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [open, setOpen] = React.useState(false)
    const [openEdit, setOpenEdit] = React.useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [pageSize, setPageSize] = useState(5); // Mặc định hiển thị 5 sản phẩm mỗi trang
    const [currentPageIndex, setCurrentPageIndex] = useState(0);


    const fetchData = async () => {
        try {
            const response = await ProductService.getAllProduct()
            if (response.data.success) {
                const formattedData = response.data.products.map((product) => ({
                    id: product._id,
                    name: product.name,
                    imageUrl: product.images,
                    description: product.description,
                    price: product.price,
                    quantity: product.quantity,
                    type: product.type,
                    category:
                        product.categoryId.length > 0 ? product.categoryId[0].name : "Không rõ",
                }));
                setData(formattedData);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        }
    };

    // Gọi API để lấy danh sách sản phẩm
    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                const response = await ProductService.deleteProduct(id)
                if (response.data.success) {
                    toast.success("Xóa sản phẩm thành công!")

                    setData((prevData) => prevData.filter((p) => p.id !== id));
                } else {
                    toast.error(response.data.message || "Không thể xóa sản phẩm.")

                }
            } catch (error) {
                console.error("Lỗi khi xóa sản phẩm:", error);
                alert("Đã xảy ra lỗi. Vui lòng thử lại.");
            }
        }
    };

    const columns = [
        {
            accessorKey: "imageUrl",
            header: () => <div className="text-center">Ảnh</div>,
            cell: ({ row }) => {
                const images = row.original.imageUrl; // Lấy danh sách ảnh từ API
                return (
                    <div className="flex flex-wrap justify-center gap-3"> {/* Tăng khoảng cách giữa các ảnh */}
                        {images.map((image, index) => (
                            <Zoom key={index}>
                                <img
                                    src={image.url}
                                    alt={`Product ${index}`}
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
            header: () => <div className="text-center">Tên sản phẩm</div>,
            cell: ({ row }) => <div className="capitalize text-center">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "category",
            header: () => <div className="text-center">Danh mục</div>,
            cell: ({ row }) => <div className="capitalize">{row.getValue("category")}</div>,
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
            id: "actions",
            header: () => <div className="text-center font-semibold">...</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <button>
                        <Pen className="size-6 p-1 mr-1 " onClick={() => {
                            setOpenEdit(true);
                            setSelectedProduct(row.original);
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
                <Add_Modal open={open} onClose={() => setOpen(false)} onSuccess={fetchData} />
                <Edit_Modal
                    open={openEdit}
                    onClose={() => setOpenEdit(false)}
                    ProductData={selectedProduct}
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
