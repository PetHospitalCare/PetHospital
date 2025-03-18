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
import { ArrowUpDown, Pen, Trash2 } from "lucide-react";
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
    const fetchData = async () => {
        try {
            const response = await MedicineService.getAllMedicine()
            console.log(response.data.medicines)
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
                console.log(response)
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
                const images = row.original.images; // Lấy danh sách ảnh từ API
                return (
                    <div className="flex flex-wrap justify-center gap-3"> {/* Tăng khoảng cách giữa các ảnh */}
                        {images.map((image, index) => (
                            <Zoom>
                                <img
                                    src={image.url}
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
        },
    });


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
