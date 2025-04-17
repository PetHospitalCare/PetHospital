// This file now serves as a mapping between service types and their IDs
export const serviceTypes = {
  vaccination: "Tiêm chủng",
  labTest: "Xét nghiệm",
  petCare: "Chăm sóc thú cưng",
  boarding: "Dịch vụ Lưu trú",
  surgery: "Phẫu thuật",
  imaging: "Siêu âm & X-quang",
  checkup: "Khám sức khỏe",
}

// Mapping from service names to their internal IDs for form rendering
export const serviceNameToType = {
  "Tiêm chủng": "vaccination",
  "Xét nghiệm": "labTest",
  "Chăm sóc thú cưng": "petCare",
  "Dịch vụ Lưu trú": "boarding",
  "Phẫu thuật": "surgery",
  "Siêu âm & X-quang": "imaging",
  "Khám sức khỏe": "checkup",
}

// These are kept for reference in case API fails
export const vaccineTypes = [
  "Rabies",
  "Distemper",
  "Parvovirus",
  "Adenovirus",
  "Parainfluenza",
  "Leptospirosis",
  "Bordetella",
  "Lyme Disease",
]

export const labTestTypes = [
  "Complete Blood Count (CBC)",
  "Blood Chemistry",
  "Urinalysis",
  "Fecal Examination",
  "Heartworm Test",
  "Thyroid Function",
  "Liver Function",
  "Kidney Function",
]

export const imagingTypes = ["X-ray", "Ultrasound", "CT Scan", "MRI", "Echocardiogram"]

