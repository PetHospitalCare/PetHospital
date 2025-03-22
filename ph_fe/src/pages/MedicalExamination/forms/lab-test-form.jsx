import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { FileText, FileSpreadsheet, Download } from "lucide-react"

export function LabTestForm({ formData, onChange, subService }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(formData.fileUrl || null);
    const [showPreview, setShowPreview] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
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
        }
    };

    // Cleanup preview URL when component unmounts
    useEffect(() => {
        return () => {
            if (previewUrl && !formData.fileUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl, formData.fileUrl]);

    const renderPreview = () => {
        const fileType = formData.fileData?.type || formData.fileType;
        const fileName = formData.fileData?.name || formData.fileName;
        const fileSource = previewUrl || formData.fileUrl;

        if (!fileType || !fileSource) return null;

        if (fileType.startsWith('image/')) {
            return (
                <img
                    src={fileSource}
                    alt="Preview"
                    className="max-w-full max-h-[500px] object-contain"
                />
            );
        } else if (fileType === 'application/pdf') {
            return (
                <iframe
                    src={fileSource}
                    className="w-full h-[600px]"
                    title="PDF preview"
                />
            );
        } else if (fileType.includes('word') ||
            fileType.includes('excel') ||
            fileType.includes('spreadsheet')) {
            return (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                    {fileType.includes('excel') || fileType.includes('spreadsheet') ? (
                        <FileSpreadsheet className="w-16 h-16 text-green-600 mb-4" />
                    ) : (
                        <FileText className="w-16 h-16 text-blue-600 mb-4" />
                    )}
                    <p className="text-lg font-medium mb-2">{fileName}</p>
                    <p className="text-sm text-muted-foreground">
                        {fileType.includes('excel') || fileType.includes('spreadsheet')
                            ? 'Tệp Excel không thể xem trước trực tiếp'
                            : 'Tệp Word không thể xem trước trực tiếp'}
                    </p>
                    <Button
                        className="mt-4"
                        onClick={() => window.open(fileSource, '_blank')}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Tải xuống để xem
                    </Button>
                </div>
            );
        }
    };

    return (
        <Card className="mb-4">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">{subService.parentName}: {subService.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="fileUpload">File kết quả chi tiết</Label>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Input
                            id="fileUpload"
                            type="file"
                            className="cursor-pointer"
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                        />
                        <p className="text-sm text-muted-foreground">
                            Hỗ trợ: JPG, PNG, PDF, DOC, DOCX, XLS, XLSX (Tối đa: 5MB)
                        </p>
                    </div>

                    {(formData.fileData || formData.fileUrl) && (
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-green-600">
                                Đã chọn: {formData.fileData?.name || formData.fileName}
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowPreview(true)}
                                className="flex items-center gap-1"
                            >
                                <Eye className="h-4 w-4" />
                                Xem
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="results">Kết quả</Label>
                    <Textarea
                        id="results"
                        value={formData.results || ""}
                        onChange={(e) => onChange("results", e.target.value)}
                        rows={4}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="interpretation">Nhận định</Label>
                    <Textarea
                        id="interpretation"
                        value={formData.interpretation || ""}
                        onChange={(e) => onChange("interpretation", e.target.value)}
                    />
                </div>

                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                    <DialogContent className="max-w-5xl">
                        <div className="mt-2">
                            {renderPreview()}
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}