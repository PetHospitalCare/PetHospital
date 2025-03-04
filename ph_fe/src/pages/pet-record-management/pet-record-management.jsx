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
import { Pen, Trash2 } from "lucide-react";
import { } from '@heroicons/react/20/solid'
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
// import AddPetRecordModal from "./add-pet-record-modal.jsx";

import { PetRecordService } from "@/services/PetRecordService.js";

import axios from "axios";
// import EditPetModal from "./edit-pet-record-modal.jsx";

export default function PetRecordManagement() {
    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [open, setOpen] = React.useState(false)
    const [openEdit, setOpenEdit] = React.useState(false)
    const [selectedPetRecord, setSelectedPetRecord] = useState(null);

    // Gọi API để lấy danh sách bản ghi thú cưng
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await PetRecordService.getAllPetRecords();

                if (response.data.success) {
                    const formattedData = response.data.petRecords.map((petRecord) => ({
                        customer_id: petRecord.customer_id,
                        customer_name: petRecord.customer_name,
                        phoneNumber: petRecord.phoneNumber,
                        pet_name: petRecord.pet_name,
                        service: 'Khám Bệnh',
                        time: '2025-02-22 14:00 - 15:00'
                    }));

                    setData(formattedData);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu thú cưng:", error);
            }
        };

        fetchData();

        // setData([
        //     {customer_id: '123', customer_name: 'Customer111', phoneNumber: '0123456781', pet_name: 'Mực', service: 'Khám Bệnh', time: '2025-02-22 14:00 - 15:00'},
        //     {id: 'petR2', name: 'Customer222', phoneNumber: '0123456782', petName: 'Milo', service: 'Cắt Giống', time: '2025-02-22 15:00 - 16:00'},
        //     {id: 'petR3', name: 'Customer333', phoneNumber: '0123456783', petName: 'Bún', service: 'Hộ Sinh', time: '2025-02-22 16:00 - 17:00'},
        // ]);
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) {
            try {
                const response = await PetRecordService.deletePet(id)

                if (response.data.success) {
                    alert("Xóa bản ghi thành công!");
                    setData((prevData) => prevData.filter((p) => p.id !== id));
                } else {
                    alert(response.data.message || "Không thể xóa bản ghi.");
                }
            } catch (error) {
                console.error("Lỗi khi xóa bản ghi:", error);
                alert("Đã xảy ra lỗi. Vui lòng thử lại.");
            }
        }
    };

    const columns = [
        {
            id: "select",
            header: ({ table }) => (
                <div className="text-left">
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
            accessorKey: "customer_name",
            header: () => <div className="text-center">Tên</div>,
            cell: ({ row }) => <div className="capitalize text-center">{row.getValue("customer_name")}</div>,
        },
        {
            accessorKey: "phoneNumber",
            header: () => <div className="text-center">Số điện thoại</div>,
            cell: ({ row }) => <div className="capitalize text-center">{row.getValue("phoneNumber")}</div>,
        },
        // {
        //     accessorKey: "imageUrl",
        //     header: () => <div className="text-center">Thú cưng</div>,
        //     cell: ({ row }) => {
        //         const images = row.original.imageUrl; // Lấy danh sách ảnh từ API
        //         return (
        //             <div className="flex flex-wrap justify-center gap-3"> {/* Tăng khoảng cách giữa các ảnh */}
        //                 {images.map((image, index) => (
        //                     <Zoom>
        //                         <img
        //                             src={image}
        //                             alt={`Pet ${index}`}
        //                             className="h-28 w-28 object-cover rounded-md"
        //                         />
        //                     </Zoom>
        //                 ))}
        //             </div>
        //         );
        //     },
        //     enableSorting: false,
        //     enableHiding: false,
        // },
        {
            accessorKey: "pet_name",
            header: () => <div className="text-center">Thú cưng</div>,
            cell: ({ row }) => <div className="capitalize text-center">{row.getValue("pet_name")}</div>,
        },
        {
            accessorKey: "service",
            header: () => <div className="text-center">Dịch vụ</div>,
            cell: ({ row }) => <div className="capitalize text-center">{row.getValue("service")}</div>,
        },
        {
            accessorKey: "time",
            header: () => <div className="text-center">Thời gian</div>,
            cell: ({ row }) => <div className="capitalize text-center">{row.getValue("time")}</div>,
        },
        {
            id: "actions",
            header: () => <div className="text-center font-semibold">Hành động</div>,
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
        },
    });

    return (
        <Page>
            <div className="w-full">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Tìm kiếm..."
                        value={(table.getColumn("customer_name")?.getFilterValue()) ?? ""}
                        onChange={(e) => table.getColumn("customer_name")?.setFilterValue(e.target.value)}
                        className="max-w-sm"
                    />
                    <div className="text-center ml-auto">
                        <Button className="p-2 font-semibold text-white" onClick={() => setOpen(true)}>
                            Thêm bản ghi thú cưng
                        </Button>

                    </div>
                    {/*<AddPetRecordModal open={open} onClose={() => setOpen(false)} />*/}
                    {/*<EditPetModal*/}
                    {/*    open={openEdit}*/}
                    {/*    onClose={() => setOpenEdit(false)}*/}
                    {/*    PetData={selectedPet}*/}
                    {/*/>*/}
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
