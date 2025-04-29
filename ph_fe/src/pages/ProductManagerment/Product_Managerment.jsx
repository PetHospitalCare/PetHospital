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
import { ArrowUpDown, ChevronDown, Search, Pen, Trash2 } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { ProductService } from "../../services/ProductService";
import { toast } from "sonner"

import Edit_Modal from "./Edit_Product_Modal";

export default function Product_Managerment() {
    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [open, setOpen] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [pageSize, setPageSize] = useState(5);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Kiểm tra kích thước màn hình
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            
            // Tự động điều chỉnh số lượng hiển thị dựa trên kích thước màn hình
            if (window.innerWidth < 640) {
                setPageSize(5);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const fetchData = async () => {
        try {
            const response = await ProductService.getAllProduct();
            if (response.data.success) {
                const formattedData = response.data.products
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((product) => ({
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
                toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
            }
        }
    };

    const columns = [
        {
            accessorKey: "imageUrl",
            header: () => <div className="text-center">Ảnh</div>,
            cell: ({ row }) => {
                const images = row.original.imageUrl || [];
                return (
                    <div className="flex flex-wrap justify-center gap-2">
                        {images.slice(0, isMobile ? 1 : 2).map((image, index) => (
                            <Zoom key={index}>
                                <img
                                    src={image.url}
                                    alt={`Product ${index}`}
                                    className={`object-cover rounded-md ${isMobile ? 'h-16 w-16' : 'h-24 w-24'}`}
                                />
                            </Zoom>
                        ))}
                        {images.length > (isMobile ? 1 : 2) && (
                            <div className="flex items-center justify-center text-sm text-gray-500">
                                +{images.length - (isMobile ? 1 : 2)}
                            </div>
                        )}
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: () => <div className="text-center">Tên sản phẩm</div>,
            cell: ({ row }) => <div className="capitalize text-center font-medium">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "category",
            header: () => <div className="text-center">Danh mục</div>,
            cell: ({ row }) => <div className="capitalize text-center">{row.getValue("category")}</div>,
            enableHiding: true,
        },
        {
            accessorKey: "quantity",
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="px-2"
                    >
                        SL
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => <div className="text-center">{row.getValue("quantity")}</div>,
        },
        {
            accessorKey: "price",
            header: () => <div className="text-right">Giá</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("price"));
                return <div className="text-right font-medium">{amount.toLocaleString()}₫</div>;
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center">...</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-center space-x-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                            setOpenEdit(true);
                            setSelectedProduct(row.original);
                        }}
                    >
                        <Pen className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleDelete(row.original.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    // Điều chỉnh cột hiển thị dựa trên kích thước màn hình
    useEffect(() => {
        if (isMobile) {
            setColumnVisibility({
                category: false,
            });
        } else {
            setColumnVisibility({});
        }
    }, [isMobile]);

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

    // Hiển thị card layout cho thiết bị di động
    const renderMobileCards = () => {
        return (
            <div className="space-y-4">
                {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                        <Card key={row.id} className="overflow-hidden">
                            <CardContent className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold">{row.original.name}</h3>
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={() => {
                                                setOpenEdit(true);
                                                setSelectedProduct(row.original);
                                            }}
                                        >
                                            <Pen className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 text-red-500"
                                            onClick={() => handleDelete(row.original.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                
                                <div className="flex">
                                    <div className="flex-shrink-0 mr-3">
                                        {row.original.imageUrl && row.original.imageUrl[0] && (
                                            <Zoom>
                                                <img
                                                    src={row.original.imageUrl[0].url}
                                                    alt="Product"
                                                    className="h-20 w-20 object-cover rounded-md"
                                                />
                                            </Zoom>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="grid grid-cols-2 gap-1 text-sm">
                                            <div className="text-gray-500">Danh mục:</div>
                                            <div>{row.original.category}</div>
                                            
                                            <div className="text-gray-500">Số lượng:</div>
                                            <div>{row.original.quantity}</div>
                                            
                                            <div className="text-gray-500">Giá:</div>
                                            <div className="font-medium">{parseFloat(row.original.price).toLocaleString()}₫</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="p-6 text-center text-gray-500">
                            Không có kết quả.
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    };

    return (
        <div className="w-full">
            {/* Modals */}
            <Add_Modal open={open} onClose={() => setOpen(false)} onSuccess={fetchData} />
            <Edit_Modal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                ProductData={selectedProduct}
                onSuccess={fetchData}
            />
            
            {/* Header với tìm kiếm và nút thêm mới */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4">
                <div className="relative w-full sm:max-w-sm">
                    <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        value={(table.getColumn("name")?.getFilterValue()) ?? ""}
                        onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                        className="pl-8"
                    />
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                
                <Button 
                    className="w-full sm:w-auto p-2 font-semibold text-white" 
                    onClick={() => setOpen(true)}
                >
                    Thêm sản phẩm
                </Button>
            </div>

            {/* Hiển thị bảng trên desktop và cards trên mobile */}
            {isMobile ? (
                renderMobileCards()
            ) : (
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="whitespace-nowrap">
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
            )}

            {/* Responsive pagination controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-4">
                <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm text-gray-700">Hiển thị:</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 px-2">
                                {pageSize}
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {[5, 10, 15, 20].map((size) => (
                                <DropdownMenuItem key={size} onClick={() => setPageSize(size)}>
                                    {size}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                
                <div className="text-xs sm:text-sm text-gray-700">
                    {`Trang ${table.getState().pagination.pageIndex + 1} / ${table.getPageCount() || 1}`}
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={!table.getCanPreviousPage()}
                        className="h-8 px-2 sm:px-4"
                    >
                        Trước
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={!table.getCanNextPage()}
                        className="h-8 px-2 sm:px-4"
                    >
                        Sau
                    </Button>
                </div>
            </div>
        </div>
    );
}