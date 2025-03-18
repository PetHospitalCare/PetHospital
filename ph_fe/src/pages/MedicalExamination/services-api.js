// // Services data to use directly
// const servicesData = [
//   {
//     _id: "67bb2cf42fc0ba2b92265b2d",
//     name: "Tiêm chủng",
//     description: "Dịch vụ tiêm vaccin cho thú cưng",
//     subServices: [
//       {
//         price: {
//           dog: 250000,
//           cat: 230000,
//         },
//         status: "active",
//         _id: "67bc343ce27130bfb6b692e8",
//         name: "Vaccin dại",
//         disease: "Bệnh dại",
//         duration: 10,
//       },
//       {
//         price: {
//           dog: 350000,
//           cat: null,
//         },
//         status: "active",
//         _id: "67bc343ce27130bfb6b692e9",
//         name: "Vaccin 7 bệnh",
//         disease: "7 bệnh truyền nhiễm",
//         duration: 5,
//       },
//       {
//         price: {
//           dog: 123123,
//           cat: 123312,
//         },
//         name: "Vaccin Phòng Bệnh bạch cầu",
//         duration: 5,
//         status: "active",
//         _id: "67bb674049a1f192cecc669f",
//       },
//     ],
//     status: "active",
//   },
//   {
//     _id: "67bb2cf42fc0ba2b92265b2e",
//     name: "Xét nghiệm",
//     description: "Dịch vụ xét nghiệm sức khỏe cho thú cưng",
//     subServices: [
//       {
//         price: {
//           dog: 200000,
//           cat: 200000,
//         },
//         name: "Xét nghiệm máu ",
//         duration: 30,
//         status: "active",
//         _id: "67cacd27c3bc0af9b38ce892",
//       },
//       {
//         price: {
//           dog: 150000,
//           cat: 150000,
//         },
//         name: "Xét nghiệm nước tiểu",
//         duration: 30,
//         status: "active",
//         _id: "67cacd51c3bc0af9b38ce8a7",
//       },
//     ],
//     status: "active",
//   },
//   {
//     _id: "67bc3adc4302f5b22ce67efd",
//     name: "Chăm sóc thú cưng",
//     description: "Dịch vụ chăm sóc sức khỏe và dinh dưỡng cho thú cưng",
//     subServices: [
//       {
//         price: {
//           dog: 700000,
//           cat: 600000,
//         },
//         _id: "67d6bba39a03774b015ac1a5",
//         name: "Chăm sóc thú cưng tại nhà",
//         duration: 60,
//         status: "active",
//       },
//       {
//         price: {
//           dog: 300000,
//           cat: 250000,
//         },
//         _id: "67d6bba39a03774b015ac1a6",
//         name: "Massage và thư giãn",
//         duration: 30,
//         status: "active",
//       },
//     ],
//   },
//   {
//     _id: "67bc3adc4302f5b22ce67eff",
//     name: "Dịch vụ Lưu trú",
//     description: "Khách sạn thú cưng - nơi an toàn cho chó mèo khi chủ vắng nhà",
//     subServices: [
//       {
//         price: {
//           dog: 500000,
//           cat: 450000,
//         },
//         _id: "67d6bba39a03774b015ac1a8",
//         name: "Lưu trú ngắn hạn (dưới 24h)",
//         duration: 24,
//         status: "active",
//       },
//       {
//         price: {
//           dog: 1200000,
//           cat: 1100000,
//         },
//         _id: "67d6bba39a03774b015ac1a9",
//         name: "Lưu trú dài hạn (trên 3 ngày)",
//         duration: 72,
//         status: "active",
//       },
//     ],
//   },
//   {
//     _id: "67bc3c594302f5b22ce67f01",
//     name: "Phẫu thuật",
//     description: "Dịch vụ phẫu thuật chuyên sâu cho thú cưng với đội ngũ bác sĩ thú y giàu kinh nghiệm.",
//     subServices: [
//       {
//         price: {
//           dog: 2000000,
//           cat: 1500000,
//         },
//         _id: "67d42a4a0b1f0f8ed6ca8d06",
//         name: "Phẫu thuật triệt sản",
//         duration: 120,
//         status: "active",
//       },
//       {
//         price: {
//           dog: 3500000,
//           cat: 3000000,
//         },
//         _id: "67d42a4a0b1f0f8ed6ca8d07",
//         name: "Phẫu thuật cắt u bướu",
//         duration: 180,
//         status: "active",
//       },
//     ],
//   },
//   {
//     _id: "67bd7ea36efdc851d34d7116",
//     name: "Siêu âm & X-quang",
//     description: "Dịch vụ siêu âm và X-quang giúp chẩn đoán các vấn đề sức khỏe của thú cưng.",
//     subServices: [
//       {
//         price: {
//           dog: 300000,
//           cat: 250000,
//         },
//         _id: "67d484db0b1f0f8ed6ca8eb7",
//         name: "Siêu âm ổ bụng",
//         duration: 30,
//         status: "active",
//       },
//       {
//         price: {
//           dog: 400000,
//           cat: 350000,
//         },
//         _id: "67d484db0b1f0f8ed6ca8eb8",
//         name: "Siêu âm tim",
//         duration: 40,
//         status: "active",
//       },
//     ],
//   },
//   {
//     _id: "67cac9f927bc9a411117a9da",
//     name: "Khám sức khỏe",
//     description: "Các dịch vụ khám chuyên khoa cơ bản và phổ biến nhất cho thú cưng",
//     subServices: [
//       {
//         price: {
//           dog: 400000,
//           cat: 350000,
//         },
//         _id: "67d4835c0b1f0f8ed6ca8e66",
//         name: "Khám tổng quát",
//         duration: 45,
//         status: "active",
//       },
//       {
//         price: {
//           dog: 550000,
//           cat: 500000,
//         },
//         _id: "67d4835c0b1f0f8ed6ca8e67",
//         name: "Khám chuyên khoa nội",
//         duration: 50,
//         status: "active",
//       },
//     ],
//   },
// ]

import { Services } from "@/services/Services";

export async function fetchServices() {

  try {
    const response = await Services.getAllService();
    if (response.data.success) {

      return response.data.services
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
  }

  // return servicesData
}

