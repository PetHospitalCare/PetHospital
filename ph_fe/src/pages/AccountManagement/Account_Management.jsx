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
    const fetchData = async () => {
        try {
            const response = await UserService.getAllAccount()
            if (response.data.success) {
                setData(response.data.accounts);
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
                const response = await UserService.deleteAccount(id);
                setData((prevData) => prevData.filter((acc) => acc._id !== id));
                alert("Xóa tài khoản thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa tài khoản:", error);
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
        },
    });


    return (

        <div className="w-full">

            <SheetDemo open={openEdit} onOpenChange={setOpenEdit} account={selectedAccount} onsuccess={fetchData} />
            <div className="flex items-center py-4">
                <Input
                    placeholder="Tìm kiếm sản phẩm..."
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

    );
}
