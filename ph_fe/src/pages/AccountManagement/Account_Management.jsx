import React, { useState, useEffect } from "react";
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
import { Pen, Trash2 } from "lucide-react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import AddProfileDialog from "./Add_Account_Modal";
import SheetDemo from "./Edit_Management";
import { UserService } from "@/services/UserService";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
export default function AccountManagement() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [open, setOpen] = useState(false);
    const [pageSize, setPageSize] = useState(5); // Mặc định hiển thị 5 sản phẩm mỗi trang
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    // Sửa lại hàm fetchData trong Account_Management.jsx
    const fetchData = async () => {
        try {
            const response = await UserService.getAllAccount();
            if (response.data.success) {
                const filteredAccounts = response.data.accounts.filter(
                    account => !account.role.includes('customer')
                );
                setData(filteredAccounts);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu tài khoản:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
            try {
                await UserService.deleteAccount(id);
                setData((prevData) => prevData.filter((acc) => acc._id !== id));
                toast.success("Xóa tài khoản thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa tài khoản:", error);
                toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
            }
        }
    };
    const columns = [
        {
            accessorKey: "url",
            header: () => <div className="text-center">Hình ảnh</div>,
            cell: ({ row }) => {
                const imageUrl = row.getValue("url") || "/profile.png";
                return (
                    <div className="flex justify-center">
                        <img src={imageUrl} alt="Dịch vụ" className="w-28 h-28 object-cover rounded-md" />
                    </div>
                );
            },
        },
        {
            accessorKey: "username",
            header: () => <div className="text-center">Tên</div>,
            cell: ({ row }) => <div className=" text-center">{row.getValue("username")}</div>,
        },
        {
            accessorKey: "email",
            header: () => <div className="text-center">Email</div>,
            cell: ({ row }) => <div className=" text-center">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "role",
            header: () => <div className="text-center">Vai trò</div>,
            cell: ({ row }) => <div className="capitalize text-center">{row.getValue("role").join(", ")}</div>,
        },
        {
            accessorKey: "phone",
            header: () => <div className="text-center">Phone</div>,
            cell: ({ row }) => <div className="capitalize text-center">{row.getValue("phone")}</div>,
        },
        {
            id: "actions",
            header: () => <div className="text-center font-semibold">...</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <button>
                        <Pen className="size-6 p-1 mr-1 " onClick={() => {
                            setOpenEdit(true);
                            setSelectedAccount(row.original);
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

            <SheetDemo open={openEdit} onOpenChange={setOpenEdit} account={selectedAccount} onsuccess={fetchData} />
            <div className="flex items-center py-4">
                <Input
                    placeholder="Tìm kiếm tài khoản..."
                    value={(table.getColumn("username")?.getFilterValue()) ?? ""}
                    onChange={(e) => table.getColumn("username")?.setFilterValue(e.target.value)}
                    className="max-w-sm"
                />
                <div className="text-center ml-auto">
                    <Button className="p-2 font-semibold text-white" onClick={() => setOpen(true)}>
                        Tạo tài khoản mới
                    </Button>

                    <AddProfileDialog open={open} onOpenChange={setOpen} onSuccess={fetchData} />

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
