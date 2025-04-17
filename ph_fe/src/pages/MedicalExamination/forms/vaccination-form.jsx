import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Eye, Printer } from "lucide-react"
import { useState } from "react"
import { jsPDF } from "jspdf"
import { font } from "./font"
import { format } from "date-fns"
export function VaccinationForm({ petInfo, formData, onChange, subService, isReadOnly }) {
    if (!subService) return null
    const [pdfUrl, setPdfUrl] = useState(null);
    const loadImage = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = url
        })
    }

    const handleGeneratePDF = async () => {
        try {
            // Initialize PDF with UTF-8 support
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
            pdf.text('PHIẾU TIÊM VACCIN', pageWidth / 2, titleY + 7, { align: 'center' })

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
                `Email: ${petInfo?.email || ''}`,
                `Địa chỉ: ${petInfo?.address || ''}`
            ], middleColX, infoStartY)

            // Right column - Pet image
            if (petInfo?.url) {
                const petImage = await loadImage(petInfo.url)
                pdf.addImage(petImage, 'JPEG', pageWidth - margin - 40, infoStartY - 5, 40, 40)
            }
            // Add vaccination details box
            const vaccineBoxY = infoStartY + 45;
            pdf.setDrawColor(189, 195, 199);
            pdf.setLineWidth(0.1);
            pdf.rect(margin, vaccineBoxY, pageWidth - (margin * 2), 50);

            // Add vaccination details with error handling
            const vaccineDetails = [
                ` ${subService?.parentName || 'N/A'}: ${subService?.name || 'N/A'}`,
                `Loại vaccin: ${formData?.name || 'N/A'}`,
                `Số lô: ${formData?.batchNumber || 'N/A'}`,
                `Ngày tiêm: ${new Date().toLocaleDateString('vi-VN')}`,
                `Ngày tiêm nhắc lại: ${formData?.nextDate ? format(new Date(formData.nextDate), "dd-MM-yyyy") : 'N/A'}`
            ];

            pdf.text(vaccineDetails, margin + 5, vaccineBoxY + 15);

            // Add notes with line breaks if needed
            const notesY = vaccineBoxY + 70;
            pdf.setFontSize(12);
            pdf.text('Ghi chú:', margin, notesY);

            if (formData?.notes) {
                pdf.setFontSize(10);
                const splitNotes = pdf.splitTextToSize(formData.notes, pageWidth - (margin * 2));
                pdf.text(splitNotes, margin, notesY + 10);
            }

            // Add signature section
            const signatureY = notesY + 40;
            pdf.text('Bác sĩ phụ trách', pageWidth - 40, signatureY, { align: 'center' });
            pdf.text('(Ký và ghi rõ họ tên)', pageWidth - 40, signatureY + 10, { align: 'center' });

            // Add footer
            pdf.setFontSize(8);
            pdf.text('Pet Hospital - Chăm sóc thú cưng của bạn với tất cả sự yêu thương',
                pageWidth / 2, pageHeight - 10, { align: 'center' });

            // Generate URL and cleanup previous if exists
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
            const blob = pdf.output('blob');
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            return url;

        } catch (error) {
            console.error('Detailed error:', error);
            return null;
        }
    };
    const handlePreview = async () => {
        const url = await handleGeneratePDF();
        if (url) {
            window.open(url, '_blank');
        }
    }
    return (
        <Card className="mb-4">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex">
                    {subService.parentName}: {subService.name}
                    <div className="ml-auto">
                        <Button
                            onClick={handlePreview}
                            type="button"
                            variant="outline"
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            Kết quả
                        </Button>
                    </div>
                </CardTitle>

            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="batchNumber">Loại vaccin</Label>
                        <Input
                            id="batchNumber"
                            value={formData.name || ""}
                            onChange={(e) => onChange("name", e.target.value)}
                            disabled={isReadOnly}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="batchNumber">Số lô</Label>
                        <Input
                            id="batchNumber"
                            value={formData.batchNumber || ""}
                            disabled={isReadOnly}
                            onChange={(e) => onChange("batchNumber", e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nextDate">Ngày tiêm nhắc lại</Label>
                    <Input
                        id="nextDate"
                        type="date"
                        value={formData.nextDate || ""}
                        onChange={(e) => onChange("nextDate", e.target.value)}
                        disabled={isReadOnly}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="vaccineNotes">Ghi chú</Label>
                    <Textarea
                        id="vaccineNotes"
                        value={formData.notes || ""}
                        onChange={(e) => onChange("notes", e.target.value)}
                        disabled={isReadOnly}
                    />
                </div>

            </CardContent>
        </Card>
    )
}

