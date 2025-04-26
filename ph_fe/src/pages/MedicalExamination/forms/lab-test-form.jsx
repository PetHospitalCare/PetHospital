import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, Printer } from "lucide-react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { FileText, FileSpreadsheet, Download } from "lucide-react"
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { read, utils } from 'xlsx';
import { font } from "./font"
import { format } from "date-fns"
import { toast } from "sonner"
export function LabTestForm({ petInfo, formData, onChange, subService, isReadOnly }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(formData.fileUrl || null);
    const [showPreview, setShowPreview] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    let tableEndY = 0

    const loadImage = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = url
        })
    }
    const isExcelFile = (file) => {
        const validTypes = [
            'application/vnd.ms-excel', // .xls
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        ];
        return validTypes.includes(file.type);
    };

    const handleExcelToPdf = async (fileInput, fileType) => {
        try {
            // Validate inputs
            if (!fileInput || (!fileType?.includes('excel') && !fileType?.includes('spreadsheet'))) {
                return null
            }

            // Handle file input
            let file = fileInput
            if (typeof fileInput === 'string') {
                const response = await fetch(fileInput)
                if (!response.ok) throw new Error('Failed to fetch file')
                const blob = await response.blob()
                file = new File([blob], 'download.xlsx', {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                })
            }

            // Process Excel file
            const data = await file.arrayBuffer()
            const workbook = read(data)
            const worksheet = workbook.Sheets[workbook.SheetNames[0]]
            const jsonData = utils.sheet_to_json(worksheet, { header: 1 })

            // Initialize PDF
            const pdf = new jsPDF('p', 'mm', 'a4')
            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()
            const margin = 20

            // Add custom font
            pdf.addFileToVFS('times.ttf', font.time)
            pdf.addFont('times.ttf', 'times', 'normal')
            pdf.setFont('times', 'normal')

            // Add header with logo
            const logoImage = await loadImage('/pethospital.png')
            const logoWidth = 30
            const logoHeight = 30
            pdf.addImage(logoImage, 'PNG', margin, margin, logoWidth, logoHeight)

            // Add hospital name
            pdf.setFontSize(20)
            pdf.text('PET HOSPITAL', margin + logoWidth + 10, margin + 15)
            // Add contact details
            pdf.setFontSize(8)
            pdf.text([
                'khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất, Hà Nội 10000 , Hà Nội , Việt Nam ',
                'Hotline: 1900 xxxx - Tel: (028) xxxx xxxx',
                'Email: minhvhhe170320@fpt.edu.vn - Website: www.pethospital.com'
            ], margin + logoWidth + 10, margin + 25)

            // Add horizontal line
            pdf.setDrawColor(41, 128, 185)
            pdf.setLineWidth(0.5)
            pdf.line(margin, margin + logoHeight + 5, pageWidth - margin, margin + logoHeight + 5)

            // Add form title with background
            const titleY = margin + logoHeight + 15
            pdf.setFillColor(41, 128, 185)
            pdf.rect(margin, titleY, pageWidth - (margin * 2), 10, 'F')
            pdf.setFontSize(16)
            pdf.setTextColor(255, 255, 255)
            pdf.text('PHIẾU KẾT QUẢ XÉT NGHIỆM', pageWidth / 2, titleY + 7, { align: 'center' })

            // Reset text color
            pdf.setTextColor(0, 0, 0)

            // Add pet and owner info
            const infoStartY = titleY + 20
            pdf.setFontSize(11)

            // Left column - Pet info
            const leftColX = margin
            pdf.text([
                `Tên thú cưng: ${petInfo?.name || ''}`,
                `Loại: ${petInfo?.type || ''}`,
                `Giống: ${petInfo?.breed || ''}`,
                `Ngày sinh: ${petInfo?.dob ? format(new Date(petInfo.dob), "dd-MM-yyyy") : ''}`,
                `Cân nặng: ${petInfo?.weight || ''} kg`
            ], leftColX, infoStartY)

            // Middle column - Owner info
            const middleColX = pageWidth / 2 - 20
            pdf.text([
                `Chủ nuôi: ${petInfo?.ownerName || ''}`,
                `Số điện thoại: ${petInfo?.phone || ''}`,
                `Email: ${petInfo?.email || ''}`,  // Added comma here
                `Địa chỉ: ${petInfo?.add || ''}`
            ], middleColX, infoStartY)

            // Right column - Pet image
            if (petInfo?.url) {
                const petImage = await loadImage(petInfo.url)
                pdf.addImage(petImage, 'JPEG', pageWidth - margin - 40, infoStartY - 5, 40, 40)
            }

            // Service info box
            const serviceBoxY = infoStartY + 45
            pdf.setDrawColor(189, 195, 199)
            pdf.setLineWidth(0.1)
            pdf.rect(margin, serviceBoxY, pageWidth - (margin * 2), 25)
            pdf.text([
                `${subService.parentName}: ${subService.name}`,
                `Ngày xét nghiệm: ${new Date().toLocaleDateString('vi-VN')}`,
                `Mã phiếu: ${formData.id || 'N/A'}`
            ], margin + 5, serviceBoxY + 10)

            // Add table
            const tableStartY = serviceBoxY + 35
            autoTable(pdf, {
                head: [jsonData[0]],
                body: jsonData.slice(1),
                startY: tableStartY,
                margin: { left: margin, right: margin },
                styles: {
                    font: 'times',
                    fontSize: 10,
                    cellPadding: 3
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontSize: 10,
                    fontStyle: 'normal'
                },
                didDrawPage: (data) => {
                    tableEndY = data.cursor.y
                },
                theme: 'grid',
                tableLineColor: [189, 195, 199],
                tableLineWidth: 0.1
            })

            // Add conclusions with page break check
            let conclusionY = tableEndY + 20;
            const minSpaceNeeded = 100; // Minimum space needed for conclusions

            // Check if there's enough space for conclusions
            if (pageHeight - conclusionY < minSpaceNeeded) {
                pdf.addPage();
                conclusionY = margin;
            }

            // Add interpretation
            if (formData.interpretation) {
                pdf.setFontSize(12);
                pdf.text('Nhận định:', margin, conclusionY);
                pdf.setFontSize(10);
                const interpretationLines = pdf.splitTextToSize(
                    formData.interpretation,
                    pageWidth - (margin * 2)
                );
                pdf.text(interpretationLines, margin, conclusionY + 10);
                conclusionY += interpretationLines.length * 5 + 25;
            }

            // Add results
            if (formData.results) {
                // Check if need new page for results
                if (pageHeight - conclusionY < minSpaceNeeded) {
                    pdf.addPage();
                    conclusionY = margin;
                }

                pdf.setFontSize(12);
                pdf.text('Kết luận:', margin, conclusionY);
                pdf.setFontSize(10);
                const resultLines = pdf.splitTextToSize(
                    formData.results,
                    pageWidth - (margin * 2)
                );
                pdf.text(resultLines, margin, conclusionY + 10);
                conclusionY += resultLines.length * 5 + 25;
            }

            // Add signature section on new page if needed
            if (pageHeight - conclusionY < 50) {
                pdf.addPage();
                conclusionY = margin;
            }

            // Add signature section
            const currentDate = format(new Date(), "'Ngày' dd 'tháng' MM 'năm' yyyy");
            pdf.setFontSize(11);
            pdf.text(`Hà Nội, ${currentDate}`, pageWidth - 40, conclusionY + 20, { align: 'center' });
            pdf.text('Bác sĩ phụ trách', pageWidth - 40, conclusionY + 30, { align: 'center' });
            pdf.setFontSize(10);
            pdf.text('(Ký và ghi rõ họ tên)', pageWidth - 40, conclusionY + 40, { align: 'center' });

            // Add footer
            pdf.setFontSize(8);
            pdf.text('Pet Hospital - Chăm sóc thú cưng của bạn với tất cả sự yêu thương',
                pageWidth / 2, pageHeight - 10, { align: 'center' });

            // Generate PDF URL
            const blob = pdf.output('blob')
            const url = URL.createObjectURL(blob)
            setPdfUrl(url)
            return url

        } catch (error) {
            console.error('Error converting Excel to PDF:', error)
            return null
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!isExcelFile(file)) {
            toast.error('Chỉ chấp nhận file Excel (.xls, .xlsx)');
            e.target.value = ''; // Reset input
            return;
        }

        setSelectedFile(file);
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
        onChange("fileData", {
            file: file,
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified
        });
    };

    // Modify handlePreviewClick function
    const handlePreviewClick = async () => {
        try {
            // Cleanup existing PDF URL
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
                setPdfUrl(null);
            }

            const fileSource = previewUrl || formData.fileUrl;
            const fileType = formData.fileData?.type || formData.fileType;

            if (fileSource && fileType) {
                const url = await handleExcelToPdf(fileSource, fileType);
                if (url) {
                    setPdfUrl(url);
                    window.open(url, '_blank');
                }
            }
        } catch (error) {
            console.error('Preview error:', error);
            toast.error('Có lỗi khi tạo bản xem trước');
        }
    };

    // Add cleanup in useEffect
    useEffect(() => {
        return () => {
            // Cleanup URLs when component unmounts or updates
            if (previewUrl && !formData.fileUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [previewUrl, formData.fileUrl, pdfUrl]);

    return (
        <Card className="mb-4">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex">
                    {subService.parentName}: {subService.name}
                    <div className="ml-auto">
                        <Button
                            onClick={handlePreviewClick}
                            variant="outline"
                            disabled={!selectedFile && !formData.fileUrl}

                        >
                            <Printer className="h-4 w-4 mr-2" />
                            Kết quả
                        </Button>
                    </div>
                </CardTitle>

            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="fileUpload">File kết quả chi tiết (Excel)</Label>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Input
                            id="fileUpload"
                            type="file"
                            className="cursor-pointer"
                            onChange={handleFileChange}
                            accept=".xls,.xlsx"
                            disabled={isReadOnly}
                            onClick={(e) => {
                                if (isReadOnly) {
                                    e.preventDefault();
                                    return;
                                }
                                e.target.value = ''; // Reset input on click
                            }}
                        />
                        <p className="text-sm text-muted-foreground">
                            Chỉ chấp nhận file Excel (.xls, .xlsx)
                        </p>
                    </div>

                    {(formData?.fileData || formData?.fileUrl) && (
                        <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4 text-green-600" />
                            <p className="text-sm text-green-600">
                                File đã tải lên: {formData?.fileData?.name || formData?.fileName}
                            </p>
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="interpretation">Chuẩn đoán</Label>
                    <Textarea
                        id="interpretation"
                        value={formData.interpretation || ""}
                        disabled={isReadOnly}
                        onChange={(e) => onChange("interpretation", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="results">Kết luận</Label>
                    <Textarea
                        id="results"
                        disabled={isReadOnly}
                        value={formData.results || ""}
                        onChange={(e) => onChange("results", e.target.value)}
                        rows={4}
                    />
                </div>


            </CardContent>
        </Card>
    );
}