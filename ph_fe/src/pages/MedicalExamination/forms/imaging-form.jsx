import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, Image as ImageIcon, X, Printer } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import "yet-another-react-lightbox/plugins/thumbnails.css"
import { jsPDF } from "jspdf"
import { format } from "date-fns"
import { font } from "./font"
import { cn } from "@/lib/utils";
export function ImagingForm({ formData, onChange, subService, petInfo, isReadOnly }) {
  const [images, setImages] = useState(() => {
    if (formData.images && Array.isArray(formData.images)) {
      // Filter out empty objects and map valid images
      return formData.images
        .filter(image => image && (image.url || image.file))
        .map(image => ({
          url: image.url || (image.file ? URL.createObjectURL(image.file) : ''),
          name: image.name || 'Image',
          publicId: image.publicId || null,
          file: image instanceof File ? image : null
        }));
    }
    return [];
  });
  const [index, setIndex] = useState(-1);
  const [pdfUrl, setPdfUrl] = useState(null);
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      toast.error('Chỉ chấp nhận file ảnh');
      return;
    }

    const invalidFiles = validFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error('File ảnh không được vượt quá 5MB');
      return;
    }

    const newImages = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file: file,
      size: file.size
    }));

    setImages(prev => [...prev, ...newImages]);
    onChange("images", [...(formData.images || []), ...validFiles]);
  };

  const handleRemoveImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].url);
      newImages.splice(index, 1);
      return newImages;
    });

    const updatedFiles = [...(formData.images || [])];
    updatedFiles.splice(index, 1);
    onChange("images", updatedFiles);
  };

  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.url && image.file) {
          URL.revokeObjectURL(image.url);
        }
      });
    };

  }, []);
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
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;

      // Spacing configuration
      const spacing = {
        sectionGap: 15,
        imageGap: 10,
        textGap: 7
      };

      // Add custom font
      pdf.addFileToVFS('times.ttf', font.time);
      pdf.addFont('times.ttf', 'times', 'normal');
      pdf.setFont('times', 'normal');

      // Add header with logo
      const logoImage = await loadImage('/pethospital.png');
      const logoWidth = 30;
      const logoHeight = 30;
      pdf.addImage(logoImage, 'PNG', margin, margin, logoWidth, logoHeight);

      // Add hospital info
      pdf.setFontSize(20);
      pdf.text('PET HOSPITAL', margin + logoWidth + 10, margin + 15);
      pdf.setFontSize(8);
      pdf.text([
        'khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất, Hà Nội 10000 , Hà Nội , Việt Nam ',
        'Hotline: 1900 xxxx - Tel: (028) xxxx xxxx',
        'Email: minhvhhe170320@fpt.edu.vn - Website: www.pethospital.com'
      ], margin + logoWidth + 10, margin + 25);

      // Add horizontal line
      pdf.setDrawColor(41, 128, 185);
      pdf.setLineWidth(0.5);
      pdf.line(margin, margin + logoHeight + 5, pageWidth - margin, margin + logoHeight + 5);

      // Add form title
      const titleY = margin + logoHeight + 15;
      pdf.setFillColor(41, 128, 185);
      pdf.rect(margin, titleY, pageWidth - (margin * 2), 10, 'F');
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`PHIẾU KẾT QUẢ ${subService?.name?.toUpperCase()}`, pageWidth / 2, titleY + 7, { align: 'center' });

      // Reset text color
      pdf.setTextColor(0, 0, 0);

      // Add pet and owner info
      const infoStartY = titleY + 20;
      pdf.setFontSize(11);

      // Left column - Pet info
      pdf.text([
        `Tên thú cưng: ${petInfo?.name || ''}`,
        `Giống: ${petInfo?.breed || ''}`,
        `Ngày sinh: ${petInfo?.dob ? format(new Date(petInfo.dob), "dd-MM-yyyy") : ''}`,
        `Cân nặng: ${petInfo?.weight || ''} kg`
      ], margin, infoStartY);

      // Middle column - Owner info
      pdf.text([
        `Chủ nuôi: ${petInfo?.ownerName || ''}`,
        `Số điện thoại: ${petInfo?.phone || ''}`,
        `Email: ${petInfo?.email || ''}`,
        `Địa chỉ: ${petInfo?.address || ''}`
      ], pageWidth / 2 - 20, infoStartY);

      // Add pet image if available
      if (petInfo?.url) {
        const petImage = await loadImage(petInfo.url);
        pdf.addImage(petImage, 'JPEG', pageWidth - margin - 40, infoStartY - 5, 40, 40);
      }

      // Add description
      const descriptionY = infoStartY + 35;
      pdf.setFontSize(12);
      pdf.text('MÔ TẢ:', margin, descriptionY);

      pdf.setFontSize(11);
      const descriptionLines = pdf.splitTextToSize(
        formData.description || "Không có mô tả",
        pageWidth - (margin * 2)
      );
      pdf.text(descriptionLines, margin, descriptionY + spacing.textGap);

      // Add images section
      const imagesStartY = descriptionY + (descriptionLines.length * spacing.textGap) + spacing.sectionGap;
      pdf.setFontSize(12);
      pdf.text('HÌNH ẢNH CHỤP:', margin, imagesStartY);

      let currentY = imagesStartY + spacing.imageGap;

      if (images.length > 0) {
        const maxWidth = (pageWidth - (margin * 3)) / 2;
        const maxHeight = 45;
        let currentX = margin;
        let rowHeight = 0;

        for (let i = 0; i < images.length; i++) {
          try {
            const img = await loadImage(images[i].url);
            const imgAspectRatio = img.width / img.height;
            let imgWidth = maxWidth;
            let imgHeight = maxWidth / imgAspectRatio;

            if (imgHeight > maxHeight) {
              imgHeight = maxHeight;
              imgWidth = maxHeight * imgAspectRatio;
            }

            if (currentY + imgHeight + 30 > pageHeight - 60) {
              pdf.addPage();
              currentY = margin;
              currentX = margin;
              rowHeight = 0;
            }

            let imageSource = images[i].url;
            if (images[i].file) {
              const reader = new FileReader();
              imageSource = await new Promise((resolve) => {
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(images[i].file);
              });
            }

            pdf.addImage(imageSource, 'JPEG', currentX, currentY, imgWidth, imgHeight);

            pdf.setFontSize(8);
            pdf.text(
              `Hình ${i + 1}`,
              currentX + (imgWidth / 2),
              currentY + imgHeight + 5,
              { align: 'center' }
            );

            rowHeight = Math.max(rowHeight, imgHeight + 15);

            if (currentX + maxWidth + margin < pageWidth - margin) {
              currentX += maxWidth + spacing.imageGap;
            } else {
              currentX = margin;
              currentY += rowHeight + spacing.imageGap;
              rowHeight = 0;
            }
          } catch (err) {
            console.error('Error adding image:', err);
          }
        }

        currentY += rowHeight + spacing.sectionGap;
      }

      // Add results section
      pdf.setFontSize(12);
      pdf.text('KẾT LUẬN:', margin, currentY);

      pdf.setFontSize(11);
      const resultLines = pdf.splitTextToSize(
        formData.results || "Không có kết luận",
        pageWidth - (margin * 2)
      );
      pdf.text(resultLines, margin, currentY + spacing.textGap);

      // Add recommendations if available
      if (formData.recommendations) {
        const recomY = currentY + (resultLines.length * spacing.textGap) + spacing.sectionGap;
        pdf.setFontSize(12);
        pdf.text('ĐỀ XUẤT:', margin, recomY);

        pdf.setFontSize(11);
        const recomLines = pdf.splitTextToSize(
          formData.recommendations,
          pageWidth - (margin * 2)
        );
        pdf.text(recomLines, margin, recomY + spacing.textGap);

        currentY = recomY + (recomLines.length * spacing.textGap) + spacing.sectionGap;
      }

      // Add signature section
      const signatureY = pageHeight - 50;
      const currentDate = format(new Date(), "'Ngày' dd 'tháng' MM 'năm' yyyy");
      pdf.setFontSize(11);
      pdf.text(`Hà Nội, ${currentDate}`, pageWidth - margin - 60, signatureY, { align: 'center' });
      pdf.text('Bác sĩ thực hiện', pageWidth - margin - 60, signatureY + 5, { align: 'center' });
      pdf.setFontSize(8);
      pdf.text('(Ký và ghi rõ họ tên)', pageWidth - margin - 60, signatureY + 25, { align: 'center' });

      // Add footer
      pdf.setFontSize(8);
      pdf.text(
        'Pet Hospital - Chăm sóc thú cưng của bạn với tất cả sự yêu thương',
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );

      // Generate URL
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return url;

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Có lỗi khi tạo PDF');
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
          <Label>Hình ảnh chụp X-quang/siêu âm</Label>
          <div className={cn(
            "relative",
            isReadOnly && "opacity-50 cursor-not-allowed"
          )}>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className={cn(
                "cursor-pointer",
                isReadOnly && "pointer-events-none"
              )}
              disabled={isReadOnly}
            />
            {isReadOnly && (
              <div className="absolute inset-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Định dạng: JPG, PNG. Tối đa 5MB mỗi ảnh
          </p>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {images.map((image, idx) => (
                <div
                  key={idx}
                  className="relative group aspect-square rounded-lg overflow-hidden border cursor-pointer"
                  onClick={() => setIndex(idx)}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                  {!isReadOnly && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white/80 hover:bg-red-500 hover:text-white transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}

                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="findings">Mô tả</Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            rows={4}
            disabled={isReadOnly}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="results">Kết luận</Label>
          <Textarea
            id="results"
            value={formData.results || ""}
            disabled={isReadOnly}
            onChange={(e) => onChange("results", e.target.value)}
          />
        </div>

        <Lightbox
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          slides={images.map(image => ({ src: image.url }))}
          plugins={[Zoom, Thumbnails]}
          zoom={{
            maxZoomPixelRatio: 3,
            zoomInMultiplier: 2
          }}
        />
      </CardContent>
    </Card>
  );
}