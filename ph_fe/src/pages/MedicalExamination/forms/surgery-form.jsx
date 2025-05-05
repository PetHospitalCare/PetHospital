"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Printer } from "lucide-react"
import { useState } from "react"
import { jsPDF } from "jspdf"
import { font } from "./font"
import { format } from "date-fns"

export function SurgeryForm({ petInfo, formData, onChange, subService, isReadOnly }) {
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
      pdf.text(`${subService?.name}`, pageWidth / 2, titleY + 7, { align: 'center' })

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
      const middleColX = pageWidth / 2 - 30
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
      let currentY = infoStartY + 45;

      pdf.setFontSize(12);
      pdf.text('Ghi chú trước phẫu thuật:', margin, currentY);
      pdf.setFontSize(10);
      const lineHeight = 4; // Giảm chiều cao dòng để tiết kiệm không gian
      const preOpNotes = pdf.splitTextToSize(formData?.preOpNotes || 'Không có', pageWidth - margin * 2);
      pdf.text(preOpNotes, margin, currentY + lineHeight);

      currentY += preOpNotes.length * lineHeight + 10; // Giảm khoảng cách
      pdf.setFontSize(12);
      pdf.text('Thông tin phẫu thuật:', margin, currentY);
      pdf.setFontSize(10);
      const procedureNotes = pdf.splitTextToSize(formData?.procedureNotes || 'Không có', pageWidth - margin * 2);
      pdf.text(procedureNotes, margin, currentY + lineHeight);

      currentY += procedureNotes.length * lineHeight + 10;
      pdf.setFontSize(12);
      pdf.text('Kết quả:', margin, currentY);
      pdf.setFontSize(10);
      const results = pdf.splitTextToSize(formData?.results || 'Không có', pageWidth - margin * 2);
      pdf.text(results, margin, currentY + lineHeight);

      currentY += results.length * lineHeight + 10;
      pdf.setFontSize(12);
      pdf.text('Chăm sóc hậu phẫu:', margin, currentY);
      pdf.setFontSize(10);
      const postOpCare = pdf.splitTextToSize(formData?.postOpCare || 'Không có', pageWidth - margin * 2);
      pdf.text(postOpCare, margin, currentY + lineHeight);

      currentY += postOpCare.length * lineHeight + 20; // Giảm thêm khoảng cách

      currentY += postOpCare.length * 5 + 30;
      const today = new Date();
      const dateString = format(today, "dd/MM/yyyy");
      pdf.setFontSize(11);
      pdf.text(`Hà Nội, ngày ${dateString.split('/')[0]} tháng ${dateString.split('/')[1]} năm ${dateString.split('/')[2]}`,
        pageWidth - margin - 10, currentY, { align: 'right' });

      pdf.text('Bác sĩ phụ trách', pageWidth - 40, currentY + 10, { align: 'center' });
      pdf.text(`${formData?.doctorName || ''}`, pageWidth - 40, currentY + 20, { align: 'center' });
      pdf.text('(Ký và ghi rõ họ tên)', pageWidth - 40, currentY + 30, { align: 'center' });

      // Chân trang
      pdf.setFontSize(8);
      pdf.text('Pet Hospital - Chăm sóc thú cưng của bạn với tất cả sự yêu thương',
        pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });

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
        <div className="space-y-2">
          <Label htmlFor="preOpNotes">Ghi chú trước phẫu thuật</Label>
          <Textarea
            id="preOpNotes"
            value={formData.preOpNotes || ""}
            onChange={(e) => onChange("preOpNotes", e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="procedureNotes">Thông tin phẫu thuật</Label>
          <Textarea
            id="procedureNotes"
            value={formData.procedureNotes || ""}
            onChange={(e) => onChange("procedureNotes", e.target.value)}
            rows={4}
            disabled={isReadOnly}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="results">Kết quả</Label>
          <Textarea
            id="results"
            value={formData.results || ""}
            onChange={(e) => onChange("results", e.target.value)}
            rows={4}
            disabled={isReadOnly}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postOpCare">Chăm sóc hậu phẫu</Label>
          <Textarea
            id="postOpCare"
            value={formData.postOpCare || ""}
            onChange={(e) => onChange("postOpCare", e.target.value)}
            disabled={isReadOnly}
          />
        </div>
      </CardContent>
    </Card>
  )
}