import { useState, useEffect } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Trash2, Info, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";

import { PaymentService } from "@/services/PaymentService.js";

export default function OrdersManagement() {
    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pageSize, setPageSize] = useState(10);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    // Modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const fuzzyFilter = (row, columnId, filterValue) => {
        if (!filterValue || filterValue === "") return true;

        const itemValue = row.getValue(columnId);
        const itemStr = String(itemValue || "").toLowerCase();
        const filterStr = String(filterValue || "").toLowerCase();

        return itemStr.includes(filterStr);
    };

    const statusSortingFn = (rowA, rowB, columnId) => {
        const statusOrder = {
            "0": 1,   // Thanh toán thất bại
            "-1": 1,  // Thanh toán thất bại
            "-2": 2,  // Đã hủy
            "1": 3,   // Chờ giao hàng
            "2": 4,   // Hoàn thành
        };

        const statusA = String(rowA.getValue(columnId));
        const statusB = String(rowB.getValue(columnId));

        return (statusOrder[statusA] || 0) - (statusOrder[statusB] || 0);
    };

    const fetchData = async () => {
        try {
            const response = await PaymentService.getAllPayments();
            if (response.data.success) {
                const formattedData = response.data.payments.map((payment) => {
                    let shippingAddress = "Không có địa chỉ";
                    if (payment.address) {
                        if (payment.address.selectedAddress) {
                            shippingAddress = payment.address.selectedAddress;
                        } else if (payment.address.province) {
                            shippingAddress = `${payment.address.inputAddress || ""}, ${payment.address.ward}, ${payment.address.district}, ${payment.address.province}`.trim();
                            if (shippingAddress.startsWith(",")) {
                                shippingAddress = shippingAddress.substring(1).trim();
                            }
                        }
                    }

                    const date = new Date(payment.createdAt);
                    const formattedDate = date.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    return {
                        id: payment._id,
                        email: payment.email || "Không có email",
                        phoneNumber: payment.phone || "Không có SĐT",
                        totalPrice: payment.totalPrice,
                        shipFee: payment.shipFee,
                        address: shippingAddress,
                        status: payment.status,
                        createdAt: formattedDate
                    };
                });

                setData(formattedData);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
            toast.error("Không thể tải dữ liệu đơn hàng");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showDeleteModal = (id) => {
        setSelectedOrderId(id);
        setDeleteModalOpen(true);
    };

    const showCancelModal = (id) => {
        setSelectedOrderId(id);
        setCancelModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            const response = await PaymentService.deletePayment(selectedOrderId);
            if (response.data.success) {
                toast.success("Xóa đơn hàng thành công!");
                setData((prevData) => prevData.filter((p) => p.id !== selectedOrderId));
                setDeleteModalOpen(false);
            } else {
                toast.error(response.data.message || "Không thể xóa đơn hàng.");
            }
        } catch (error) {
            console.error("Lỗi khi xóa đơn hàng:", error);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

    const handleCompleteOrder = async (id) => {
        try {
            const response = await PaymentService.updatePaymentStatus({ paymentId: id, status: 2 });
            if (response.data.success) {
                toast.success("Đơn hàng đã được đánh dấu hoàn thành!");
                fetchData();
            } else {
                toast.error(response.data.message || "Không thể cập nhật trạng thái đơn hàng.");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

    const handleCancelOrder = async () => {
        try {
            const response = await PaymentService.cancelOrder(selectedOrderId);
            if (response.data.success) {
                toast.success("Đơn hàng đã được hủy thành công!");
                fetchData();
                setCancelModalOpen(false);
            } else {
                toast.error(response.data.message || "Không thể hủy đơn hàng.");
            }
        } catch (error) {
            console.error("Lỗi khi hủy đơn hàng:", error);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

    const columns = [
        {
            accessorKey: "id",
            header: () => <div className="text-center">ID đơn hàng</div>,
            cell: ({ row }) => <div className="font-medium text-center">{row.getValue("id")}</div>,
            filterFn: fuzzyFilter,
        },
        {
            accessorKey: "email",
            header: () => <div className="text-center">Email</div>,
            cell: ({ row }) => <div className="text-center">{row.getValue("email")}</div>,
            filterFn: fuzzyFilter,
        },
        {
            accessorKey: "phoneNumber",
            header: () => <div className="text-center">Số điện thoại</div>,
            cell: ({ row }) => <div className="text-center">{row.getValue("phoneNumber")}</div>,
            filterFn: fuzzyFilter,
        },
        {
            accessorKey: "totalPrice",
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tổng giá tiền
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("totalPrice"));
                return <div className="text-center font-medium">{amount.toLocaleString()} VND</div>;
            },
        },
        {
            accessorKey: "address",
            header: () => <div className="text-center">Địa chỉ giao hàng</div>,
            cell: ({ row }) => {
                const address = row.getValue("address");
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="truncate max-w-[200px] text-center mx-auto flex items-center justify-center">
                                    <span className="truncate">{address}</span>
                                    <Info className="h-3 w-3 ml-1 text-gray-400" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs whitespace-normal">{address}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Trạng thái
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => {
                const statusCode = row.getValue("status");
                let statusColor = "bg-gray-100 text-gray-800";
                let statusText = "Không xác định";

                switch (statusCode) {
                    case 0:
                    case -1:
                        statusColor = "bg-red-100 text-red-800";
                        statusText = "Thanh toán thất bại";
                        break;
                    case -2:
                        statusColor = "bg-red-100 text-red-800";
                        statusText = "Đã hủy";
                        break;
                    case 1:
                        statusColor = "bg-yellow-100 text-yellow-800";
                        statusText = "Chờ giao hàng";
                        break;
                    case 2:
                        statusColor = "bg-green-100 text-green-800";
                        statusText = "Hoàn thành";
                        break;
                    default:
                        statusText = `Trạng thái: ${statusCode}`;
                }

                return (
                    <div className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>
                            {statusText}
                        </span>
                    </div>
                );
            },
            sortingFn: statusSortingFn,
            filterFn: (row, columnId, filterValue) => {
                if (filterValue === undefined || filterValue === null || filterValue === "") {
                    return true;
                }

                const rowValue = row.getValue(columnId);

                // Gộp status 0 và -1 là thanh toán thất bại
                if (filterValue === 0 && (rowValue === 0 || rowValue === -1)) {
                    return true;
                }

                return rowValue === filterValue;
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Ngày đặt
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => <div className="text-center">{row.getValue("createdAt")}</div>,
        },
        {
            id: "actions",
            header: () => <div className="text-center">Thao tác</div>,
            cell: ({ row }) => {
                const statusCode = row.original.status;
                return (
                    <div className="flex items-center justify-center space-x-3">
                        {/* Delete button - Only show for orders NOT in "Chờ giao hàng" status */}
                        {statusCode !== 1 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() => showDeleteModal(row.original.id)}
                                            className="text-red-500 hover:text-red-700 focus:outline-none"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Xóa đơn hàng</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        {statusCode === 1 && (
                            <>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => handleCompleteOrder(row.original.id)}
                                                className="text-green-500 hover:text-green-700 focus:outline-none"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Đánh dấu hoàn thành</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => showCancelModal(row.original.id)}
                                                className="text-red-500 hover:text-red-700 focus:outline-none"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Hủy đơn hàng</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </>
                        )}
                    </div>
                );
            },
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
    });

    useEffect(() => {
        setCurrentPageIndex(0);
        table.setPageSize(pageSize);
    }, [pageSize, table]);

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
            <div className="flex flex-wrap items-center gap-2 py-4">
                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    <Input
                        id="search-id"
                        placeholder="Tìm theo ID đơn hàng..."
                        value={(table.getColumn("id")?.getFilterValue()) ?? ""}
                        onChange={(e) => table.getColumn("id")?.setFilterValue(e.target.value)}
                        className="w-full md:w-60"
                    />
                    <Input
                        id="search-email"
                        placeholder="Tìm theo email..."
                        value={(table.getColumn("email")?.getFilterValue()) ?? ""}
                        onChange={(e) => table.getColumn("email")?.setFilterValue(e.target.value)}
                        className="w-full md:w-60"
                    />
                    <Input
                        id="search-phone"
                        placeholder="Tìm theo số điện thoại..."
                        value={(table.getColumn("phoneNumber")?.getFilterValue()) ?? ""}
                        onChange={(e) => table.getColumn("phoneNumber")?.setFilterValue(e.target.value)}
                        className="w-full md:w-60"
                    />
                </div>

                <div className="flex flex-wrap gap-2 ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                {(() => {
                                    const status = table.getColumn("status")?.getFilterValue();
                                    switch (status) {
                                        case 1: return "Chờ giao hàng";
                                        case 2: return "Hoàn thành";
                                        case 0: return "Thanh toán thất bại";
                                        case -2: return "Đã hủy";
                                        default: return "Lọc theo trạng thái";
                                    }
                                })()}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue(undefined)}>
                                Tất cả đơn hàng
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue(1)}>
                                Chờ giao hàng
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue(2)}>
                                Hoàn thành
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue(0)}>
                                Thanh toán thất bại
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue(-2)}>
                                Đã hủy
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="outline"
                        className="ml-2"
                        onClick={() => {
                            table.getColumn("id")?.setFilterValue("");
                            table.getColumn("email")?.setFilterValue("");
                            table.getColumn("phoneNumber")?.setFilterValue("");
                            table.getColumn("status")?.setFilterValue(undefined);
                        }}
                    >
                        Xóa bộ lọc
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
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Không tìm thấy đơn hàng nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">Hiển thị:</span>
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
                    <div className="text-sm text-gray-700">
                        {`Trang ${table.getState().pagination.pageIndex + 1} / ${table.getPageCount() || 1}`}
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

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa đơn hàng</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex space-x-2 justify-end">
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Xóa đơn hàng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cancel Order Confirmation Modal */}
            <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn hủy đơn hàng này không? Đơn hàng đã hủy sẽ không thể khôi phục.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex space-x-2 justify-end">
                        <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
                            Đóng
                        </Button>
                        <Button variant="destructive" onClick={handleCancelOrder}>
                            Hủy đơn hàng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}