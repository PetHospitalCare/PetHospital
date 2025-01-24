
import React, { useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

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
import Layout from "@/components/Sidebar/layout";
import Page from "@/app/dashboard/page";

const data = [
    { id: "m5gr84i9", amount: 316, status: "success", email: "ken99@yahoo.com", imageUrl: "https://m.economictimes.com/thumb/msid-100966456,width-1200,height-900,resizemode-4,imgsize-63314/why-become-a-product-manager.jpg" },
    { id: "3u1reuv4", amount: 242, status: "success", email: "Abe45@gmail.com", imageUrl: "/images/image2.jpg" },
    { id: "derv1ws0", amount: 837, status: "processing", email: "Monserrat44@gmail.com", imageUrl: "/images/image3.jpg" },
    { id: "5kma53ae", amount: 874, status: "success", email: "Silas22@gmail.com", imageUrl: "/images/image4.jpg" },
    { id: "bhqecj4p", amount: 721, status: "failed", email: "carmella@hotmail.com", imageUrl: "/images/image5.jpg" },


];


export default function Product_Managerment() {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});

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
                        className=""
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
            accessorKey: "imageUrl",
            header: ({ column }) => (
                <div className="text-center">
                    Ảnh
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <img
                        src={row.getValue("imageUrl")}
                        alt="Product"
                        className="h-24 w-24 object-cover rounded-md"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },

        {
            accessorKey: "status",
            header: ({ column }) => (
                <div className="text-center">
                    Tên sản phẩm
                </div>

            ),
            cell: ({ row }) => <div className="capitalize ">{row.getValue("status")}</div>,
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <div className="text-center">
                    Danh mục
                </div>

            ),
            cell: ({ row }) => <div className="capitalize ">{row.getValue("status")}</div>,
        },
        {
            accessorKey: "email",
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
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },

        {
            accessorKey: "amount",
            header: () => <div className="text-right">Giá tiền</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("amount"));
                return <div className="text-right font-medium">${amount.toFixed(2)}</div>;
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const payment = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
                                Copy payment ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View customer</DropdownMenuItem>
                            <DropdownMenuItem>View payment details</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
        },
    });

    return (
        <Page>
            <div className="w-full">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter emails..."
                        value={(table.getColumn("email")?.getFilterValue()) ?? ""}
                        onChange={(e) => table.getColumn("email")?.setFilterValue(e.target.value)}
                        className="max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
                                <DropdownMenuCheckboxItem
                                    key={col.id}
                                    checked={col.getIsVisible()}
                                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                                >
                                    {col.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                                        No results.
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
