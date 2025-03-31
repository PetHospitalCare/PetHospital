
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function PetCareForm({ formData, onChange, subService, isReadOnly }) {
    return (

        <Card className="mb-4">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">  {subService.parentName}: {subService.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                <div className="space-y-2">
                    <Label htmlFor="careDetails">Chi tiết dịch vụ</Label>
                    <Textarea
                        id="careDetails"
                        value={formData.careDetails || ""}
                        onChange={(e) => onChange("careDetails", e.target.value)}
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="careNotes">Ghi chú</Label>
                    <Textarea id="careNotes" value={formData.notes || ""} onChange={(e) => onChange("notes", e.target.value)} />
                </div>
            </CardContent>
        </Card>
    )
}

