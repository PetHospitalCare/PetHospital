import axios from "../axios";

//Lấy danh sách thuốc
const getAllMedicine = () => axios.get("/medicine/get-all");

//Tạo thuốc mới
const createMedicine = (data) => {
    return axios.post(`/medicine/create`, data);
}

//Lấy tất cả thông tin của 1 thuốc
const getMedicineById = (id) => {
    return axios.get(`/medicine/get-by-id/${id}`);
};

//Chỉnh sửa thuốc
const updateMedicine = (id, data) => {
    return axios.put(`/medicine/edit/${id}`, data);
}

//Xóa thuốc
const deleteMedicine = (id) => {
    return axios.delete(`/medicine/delete/${id}`);
}


export const MedicineService = {
    getAllMedicine,
    createMedicine,
    getMedicineById,
    updateMedicine,
    deleteMedicine
};
