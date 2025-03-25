import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useState } from "react"
import { jsPDF } from "jspdf"
import { font } from "./font"
import { format } from "date-fns"
export function CheckupForm({ petInfo, formData, onChange, subService }) {
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
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20

      // Add font
      pdf.addFileToVFS('times.ttf', font.time)
      pdf.addFont('times.ttf', 'times', 'normal')
      pdf.setFont('times', 'normal')

      // Add header with logo
      const logoImage = await loadImage('/pethospital.png')
      const logoWidth = 30
      const logoHeight = 30
      pdf.addImage(logoImage, 'PNG', margin, margin, logoWidth, logoHeight)

      // Add hospital info
      pdf.setFontSize(20)
      pdf.text('PET HOSPITAL', margin + logoWidth + 10, margin + 15)
      pdf.setFontSize(8)
      pdf.text([
        'khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất, Hà Nội 10000 , Hà Nội , Việt Nam ',
        'Hotline: 1900 xxxx - Tel: (028) xxxx xxxx',
        'Email: minhvhhe170320@fpt.edu.vn - Website: www.pethospital.com'
      ], margin + logoWidth + 10, margin + 25)

      // Add line separator
      pdf.setDrawColor(41, 128, 185)
      pdf.setLineWidth(0.5)
      pdf.line(margin, margin + logoHeight + 5, pageWidth - margin, margin + logoHeight + 5)

      // Add title
      const titleY = margin + logoHeight + 15
      pdf.setFillColor(41, 128, 185)
      pdf.rect(margin, titleY, pageWidth - (margin * 2), 10, 'F')
      pdf.setFontSize(16)
      pdf.setTextColor(255, 255, 255)
      pdf.text('PHIẾU KHÁM TỔNG QUÁT', pageWidth / 2, titleY + 7, { align: 'center' })

      // Reset text color
      pdf.setTextColor(0, 0, 0)

      // Add pet and owner info
      const infoStartY = titleY + 20
      pdf.setFontSize(11)

      // Pet info
      pdf.text([
        `Tên thú cưng: ${petInfo?.name || ''}`,
        `Loại: ${petInfo?.type || ''}`,
        `Giống: ${petInfo?.breed || ''}`,
        `Ngày sinh: ${petInfo?.dob ? format(new Date(petInfo.dob), "dd-MM-yyyy") : ''}`,
        `Cân nặng: ${petInfo?.weight || ''} kg`
      ], margin, infoStartY)

      // Owner info
      pdf.text([
        `Chủ nuôi: ${petInfo?.ownerName || ''}`,
        `Số điện thoại: ${petInfo?.phone || ''}`,
        `Email: ${petInfo?.email || ''}`,
        `Địa chỉ: ${petInfo?.address || ''}`
      ], pageWidth / 2 - 20, infoStartY)

      // Pet image
      if (petInfo?.url) {
        const petImage = await loadImage(petInfo.url)
        pdf.addImage(petImage, 'JPEG', pageWidth - margin - 40, infoStartY - 5, 40, 40)
      }

      // Add examination details
      const examY = infoStartY + 50
      pdf.setFontSize(12)
      pdf.text([
        `Nhiệt độ: ${formData.temperature || 'N/A'} °C`,
        `Nhịp tim: ${formData.heartRate || 'N/A'} bpm`,
        `Nhịp thở: ${formData.respiratoryRate || 'N/A'} bpm`,
        `Tình trạng nước: ${formData.hydration || 'N/A'}`,
        `Thể trạng: ${formData.bodyCondition || 'N/A'}`
      ], margin, examY)

      // Add description and diagnosis
      const descY = examY + 50
      pdf.setFontSize(12)
      pdf.text('Mô tả:', margin, descY)
      pdf.setFontSize(10)
      const splitDesc = pdf.splitTextToSize(formData.description || 'N/A', pageWidth - (margin * 2))
      pdf.text(splitDesc, margin, descY + 10)

      const predY = descY + 40
      pdf.setFontSize(12)
      pdf.text('Chuẩn đoán:', margin, predY)
      pdf.setFontSize(10)
      const splitPred = pdf.splitTextToSize(formData.prediction || 'N/A', pageWidth - (margin * 2))
      pdf.text(splitPred, margin, predY + 10)

      const treatY = predY + 40
      pdf.setFontSize(12)
      pdf.text('Điều trị:', margin, treatY)
      pdf.setFontSize(10)
      const splitTreat = pdf.splitTextToSize(formData.treatment || 'N/A', pageWidth - (margin * 2))
      pdf.text(splitTreat, margin, treatY + 10)

      // Add signature section
      const signatureY = treatY + 50
      pdf.text('Bác sĩ phụ trách', pageWidth - 40, signatureY, { align: 'center' })
      pdf.text('(Ký và ghi rõ họ tên)', pageWidth - 40, signatureY + 10, { align: 'center' })

      // Add footer
      pdf.setFontSize(8)
      pdf.text('Pet Hospital - Chăm sóc thú cưng của bạn với tất cả sự yêu thương',
        pageWidth / 2, pageHeight - 10, { align: 'center' })

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
      const blob = pdf.output('blob')
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
      return url

    } catch (error) {
      console.error('PDF generation error:', error)
      return null
    }
  }

  const handlePreview = async () => {
    const url = await handleGeneratePDF()
    if (url) {
      window.open(url, '_blank')
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
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="temperature">Nhiệt độ (°C)</Label>
            <Input
              id="temperature"
              value={formData.temperature || ""}
              onChange={(e) => onChange("temperature", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heartRate">Nhịp tim (bpm)</Label>
            <Input
              id="heartRate"
              value={formData.heartRate || ""}
              onChange={(e) => onChange("heartRate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="respiratoryRate">Nhịp thở (bpm)</Label>
            <Input
              id="respiratoryRate"
              value={formData.respiratoryRate || ""}
              onChange={(e) => onChange("respiratoryRate", e.target.value)}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Tình trạng tổng quát</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hydration">Tình trạng nước</Label>
              <Select value={formData.hydration || ""} onValueChange={(value) => onChange("hydration", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Bình thường</SelectItem>
                  <SelectItem value="mild">Mất nước nhẹ</SelectItem>
                  <SelectItem value="moderate">Mất nước vừa</SelectItem>
                  <SelectItem value="severe">Mất nước nặng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodyCondition">Thể trạng</Label>
              <Select value={formData.bodyCondition || ""} onValueChange={(value) => onChange("bodyCondition", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Gầy còm</SelectItem>
                  <SelectItem value="2">2 - Gầy</SelectItem>
                  <SelectItem value="3">3 - Lý tưởng</SelectItem>
                  <SelectItem value="4">4 - Thừa cân</SelectItem>
                  <SelectItem value="5">5 - Béo phì</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label>Khám theo hệ thống</Label>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prediction">Chuẩn đoán</Label>
            <Textarea
              id="prediction"
              value={formData.prediction || ""}
              onChange={(e) => onChange("prediction", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment">Điều trị</Label>
            <Textarea
              id="treatment"
              value={formData.treatment || ""}
              onChange={(e) => onChange("treatment", e.target.value)}
            />
          </div>


        </div>
      </CardContent>
    </Card>
  )
}

