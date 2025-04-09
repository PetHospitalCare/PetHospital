import { useState, useEffect } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Pen, Trash2 } from "lucide-react";
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

import { toast } from "sonner";

// import Edit_Order_Modal from "./Edit_Order_Modal";
import { PaymentService } from "@/services/PaymentService.js";

export default function OrdersManagement() {
    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [pageSize, setPageSize] = useState(5);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const fetchData = async () => {
        try {
            const response = await PaymentService.getAllPayments();
            if (response.data.success) {
                const formattedData = response.data.payments.map((payment) => ({
                    id: payment._id,
                    orderNumber: `ĐH-${payment._id.slice(-6).toUpperCase()}`,
                    items: payment.items,
                    totalPrice: payment.totalPrice,
                    shipFee: payment.shipFee,
                    address: payment.address,
                    status: payment.status,
                    createdAt: new Date(payment.createdAt).toLocaleDateString()
                }));
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

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này không?")) {
            try {
                const response = await PaymentService.deletePayment(id);
                if (response.data.success) {
                    toast.success("Xóa đơn hàng thành công!");
                    setData((prevData) => prevData.filter((p) => p.id !== id));
                } else {
                    toast.error(response.data.message || "Không thể xóa đơn hàng.");
                }
            } catch (error) {
                console.error("Lỗi khi xóa đơn hàng:", error);
                toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
            }
        }
    };

    const handleUpdateStatus = async (id, newStatusCode) => {
        try {
            const response = await PaymentService.updatePaymentStatus(id, { status: newStatusCode });
            if (response.data.success) {
                toast.success("Cập nhật trạng thái đơn hàng thành công!");
                fetchData();
            } else {
                toast.error(response.data.message || "Không thể cập nhật trạng thái đơn hàng.");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

    const columns = [
        {
            accessorKey: "orderNumber",
            header: () => <div className="text-center">Order #</div>,
            cell: ({ row }) => <div className="font-medium text-center">{row.getValue("orderNumber")}</div>,
        },
        {
            accessorKey: "items",
            header: () => <div className="text-center">Items</div>,
            cell: ({ row }) => {
                const items = row.getValue("items");
                return (
                    <div className="text-center">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                    </div>
                );
            },
        },
        {
            accessorKey: "totalPrice",
            header: ({ column }) => (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Total
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("totalPrice"));
                return <div className="text-right font-medium">${amount.toFixed(2)}</div>;
            },
        },
        {
            accessorKey: "address",
            header: () => <div className="text-center">Shipping Address</div>,
            cell: ({ row }) => {
                const address = row.getValue("address");
                const displayAddress = typeof address === 'string'
                    ? address
                    : `${address.street}, ${address.city}`;
                return <div className="truncate max-w-[200px]">{displayAddress}</div>;
            },
        },
        {
            accessorKey: "status",
            header: () => <div className="text-center">Status</div>,
            cell: ({ row }) => {
                const statusCode = row.getValue("status");
                let statusColor = "bg-gray-100 text-gray-800";
                let statusText = "Không xác định";

                switch (statusCode) {
                    case 0:
                    case -1:
                        statusColor = "bg-red-100 text-red-800";
                        statusText = statusCode === 0 ? "Đã hủy" : "Thanh toán thất bại";
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
        },
        {
            accessorKey: "createdAt",
            header: () => <div className="text-center">Ngày đặt</div>,
            cell: ({ row }) => <div className="text-center">{row.getValue("createdAt")}</div>,
        },
        {
            id: "actions",
            header: () => <div className="text-center">Thao tác</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    setOpenEdit(true);
                                    setSelectedOrder(row.original);
                                }}
                            >
                                <Pen className="mr-2 h-4 w-4" />
                                <span>Edit Order</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete Order</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleUpdateStatus(row.original.id, "Processing")}
                                disabled={row.original.status === "Processing"}
                            >
                                <span>Mark as Processing</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleUpdateStatus(row.original.id, "Shipped")}
                                disabled={row.original.status === "Shipped"}
                            >
                                <span>Mark as Shipped</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleUpdateStatus(row.original.id, "Delivered")}
                                disabled={row.original.status === "Delivered"}
                            >
                                <span>Mark as Delivered</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleUpdateStatus(row.original.id, "Cancelled")}
                                disabled={row.original.status === "Cancelled"}
                            >
                                <span>Cancel Order</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
            <div className="flex items-center py-4">
                <Input
                    placeholder="Tìm kiếm theo mã đơn hàng..."
                    value={(table.getColumn("orderNumber")?.getFilterValue()) ?? ""}
                    onChange={(e) => table.getColumn("orderNumber")?.setFilterValue(e.target.value)}
                    className="max-w-sm"
                />
                <div className="ml-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Lọc theo trạng thái
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("")}>
                                Tất cả đơn hàng
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue(1)}>
                                Chờ giao hàng
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue(2)}>
                                Hoàn thành
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue(0)}>
                                Đã hủy
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue(-1)}>
                                Thanh toán thất bại
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/*{selectedOrder && (*/}
                {/*    <Edit_Order_Modal*/}
                {/*        open={openEdit}*/}
                {/*        onClose={() => setOpenEdit(false)}*/}
                {/*        orderData={selectedOrder}*/}
                {/*        onSuccess={fetchData}*/}
                {/*    />*/}
                {/*)}*/}
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
        </div>
    );
}