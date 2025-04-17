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
import { ArrowUpDown, ChevronDown, Pen, Trash2, Search } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";

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
                const images = row?.original?.images || [];
                return (
                    <div className="flex flex-wrap justify-center gap-2">
                        {images.slice(0, isMobile ? 1 : 2).map((image, index) => (
                            <Zoom key={index}>
                                <img
                                    src={image?.url}
                                    alt={`Medicine ${index}`}
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
            header: () => <div className="text-center">Tên thuốc</div>,
            cell: ({ row }) => <div className="text-center font-medium">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "pet_type",
            header: () => <div className="text-center">Dành cho</div>,
            cell: ({ row }) => {
                const petType = row.getValue("pet_type");
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
            cell: ({ row }) => <div className="text-center">{row.getValue("unit")}</div>,
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
            accessorKey: "expiry_date",
            header: () => <div className="text-center">Hạn dùng</div>,
            cell: ({ row }) => {
                const rawDate = row.getValue("expiry_date");
                if (!rawDate) return <div className="text-center">N/A</div>;

                const date = new Date(rawDate);
                const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;

                return <div className="text-center">{formattedDate}</div>;
            },
            enableHiding: true,
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
                            setSelectedMedicine(row.original);
                        }}
                    >
                        <Pen className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleDelete(row.original._id)}
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
                unit: false,
                expiry_date: false,
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
                                                setSelectedMedicine(row.original);
                                            }}
                                        >
                                            <Pen className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 text-red-500"
                                            onClick={() => handleDelete(row.original._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                
                                <div className="flex">
                                    <div className="flex-shrink-0 mr-3">
                                        {row.original.images && row.original.images[0] && (
                                            <Zoom>
                                                <img
                                                    src={row.original.images[0].url}
                                                    alt="Medicine"
                                                    className="h-20 w-20 object-cover rounded-md"
                                                />
                                            </Zoom>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="grid grid-cols-2 gap-1 text-sm">
                                            <div className="text-gray-500">Dành cho:</div>
                                            <div>{
                                                Array.isArray(row.original.pet_type)
                                                    ? row.original.pet_type.map((type) => (type === "Dog" ? "Chó" : type === "Cat" ? "Mèo" : type)).join(", ")
                                                    : row.original.pet_type === "Dog"
                                                        ? "Chó"
                                                        : row.original.pet_type === "Cat"
                                                            ? "Mèo"
                                                            : row.original.pet_type
                                            }</div>
                                            
                                            <div className="text-gray-500">Đơn vị:</div>
                                            <div>{row.original.unit}</div>
                                            
                                            <div className="text-gray-500">Số lượng:</div>
                                            <div>{row.original.quantity}</div>
                                            
                                            <div className="text-gray-500">Giá:</div>
                                            <div className="font-medium">{parseFloat(row.original.price).toLocaleString()}₫</div>
                                            
                                            <div className="text-gray-500">Hạn dùng:</div>
                                            <div>{
                                                row.original.expiry_date ? (() => {
                                                    const date = new Date(row.original.expiry_date);
                                                    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
                                                })() : "N/A"
                                            }</div>
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
            <SheetDemo open={openEdit} onOpenChange={setOpenEdit} medicine={selectedMedicine} onsuccess={fetchData} />
            
            {/* Header với tìm kiếm và nút tạo mới */}
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
                
                <Button className="w-full sm:w-auto p-2 font-semibold text-white" onClick={() => setOpen(true)}>
                    Tạo thuốc mới
                </Button>
                
                <AddMedicineDialog open={open} onOpenChange={setOpen} onSuccess={fetchData} />
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